import { useCallback, useEffect, useState, useRef } from "react";
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import MiniPDFPage from "../components/MiniPDFPage";
import { ReactSortable } from "react-sortablejs";
import Button from "../components/button";
import { PDFDocument } from "@cantoo/pdf-lib";
import { downloadFile } from "@/helper/download-file";
import { debounce } from "lodash";
import { BsTrash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";

const ReorderPages = () => {
  const defaultScale = typeof window !== 'undefined' && window.innerWidth <= 500 ? 0.15 : 0.4;
  const [file, setFile] = useState<File>();
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [pageOrder, setPageOrder] = useState<{ id: number }[]>([]);
  const [scale, setScale] = useState(defaultScale);
  const scaleHandler = useCallback(
    debounce((newScale: number) => {
      setScale(newScale);
    }, 200),
    [setScale] // Include setScale if it's a state updater function
  );

  const pdfDocument = useRef<PDFDocument | null>(null);

  async function addNewPage(position: number) {

    if (pdfDocument.current) {
      const firstPage = pdfDocument.current.getPages()[0];
      const {width, height} = firstPage.getSize();
      pdfDocument.current.insertPage(position, [width, height]);
      const modifiedPdfBytes = await pdfDocument.current.save();
      const modifiedPdfUrl = URL.createObjectURL(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
      getDocument(modifiedPdfUrl).promise.then((doc) => {
        setPDFDoc(doc);
        console.log("doc is changed!", pdfDoc);
        setPageOrder([...Array(doc.numPages).keys()].map((i) => ({ id: i })));
        console.log("New Page added", pageOrder);
      });
    }
  }

  async function downloadReorderedPDF() {
    const resPDF = await PDFDocument.load(await file!.arrayBuffer());
    const resPDF1 = await PDFDocument.load(await file!.arrayBuffer());
    const allPages = resPDF.getPages();
    let numberOfDeleted = 0;
    for (const pageIndex of resPDF.getPageIndices()) {
      resPDF.removePage(pageIndex - numberOfDeleted);
      numberOfDeleted++;
    }
    for (const pageIndex of resPDF1.getPageIndices()) {
      if (pageIndex < pageOrder.length && typeof pageOrder[pageIndex] !== 'undefined') {
        // resPDF.removePage(pageIndex);
        resPDF.insertPage(pageIndex, allPages[pageOrder[pageIndex].id]);
      }
    }

    const resPDFSaved = await resPDF.save();
    downloadFile(await new Response(resPDFSaved).blob(), "reordered.pdf");
  }

  useEffect(() => {
    const loadPDF = async () => {
      if (file) {
        const url = URL.createObjectURL(file);
        getDocument(url).promise.then((doc) => {
          setPDFDoc(doc);
          setPageOrder([...Array(doc.numPages).keys()].map((i) => ({ id: i })));
        });
        // PDF-LIB
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        pdfDocument.current = await PDFDocument.load(existingPdfBytes);
      }
    }
    loadPDF();
  }, [file]);

  return (
    <div>
      <Header text="Reorder or remove pages" />
      <input
        aria-label="Add files"
        accept="application/pdf"
        onChange={(e) => {
          if (!e.currentTarget.files) return;
          if (e.currentTarget.files.length > 0) {
            setFile(e.currentTarget.files.item(0)!);
          }
        }}
        className="2xl:p-12 max-w-full p-5 my-4 rounded-lg border border-blue-700 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 border-dashed block mx-auto"
        type="file"
      />
      {pdfDoc && (
        <>
          <div className="w-full flex justify-end mb-2">
            <Button size="lg" className="mt-1 bg-white dark:bg-slate-800" onClick={downloadReorderedPDF}>
              Download Result
            </Button>
          </div>
          <div className="w-fit mx-auto text-center my-2">
            <h3 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Reorder Pages</h3>
            <details className=" text-gray-700 dark:text-gray-300 px-2 p-1 rounded-md border bg-slate-50 dark:bg-slate-800 dark:border-slate-600">
              <summary className="cursor-pointer">Options & Instructions</summary>
              <p className="mx-auto mb-2 text-sm">
                Drag to reorder the pages of the PDF below.
                <br />
                Finally, download the processed PDF using the <i>Download Result</i> button.
              </p>
              <label className="flex flex-col w-fit text-center gap-x-2 mx-auto text-lg text-gray-700 dark:text-gray-300 ">
                Preview Scale
                <input
                  type="range"
                  defaultValue={defaultScale}
                  step={0.01}
                  max={2}
                  min={0.05}
                  onChange={(ev) => {
                    scaleHandler(ev.currentTarget.valueAsNumber);
                  }}
                />
              </label>
              <Button
                className="my-1"
                onClick={(ev) => {
                  setPageOrder([...Array(pdfDoc.numPages).keys()].map((i) => ({ id: i })));
                }}
              >
                Reset Pages
              </Button>
            </details>
          </div>
          {pageOrder.length === 0 && (
            <div className="mx-auto w-fit my-6">
              <Button
                onClick={(ev) => {
                  setPageOrder([...Array(pdfDoc.numPages).keys()].map((i) => ({ id: i })));
                }}
              >
                Reset Pages
              </Button>
            </div>
          )}
          <ReactSortable
            tag="ol"
            className="h-full flex flex-wrap justify-center items-center"
            list={pageOrder}
            setList={(s) => {
              setPageOrder(s);
            }}
          >
            {pageOrder.map((p, i) => (
              <li
                onContextMenu={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  const newIndexPrompt = prompt("Move to page");
                  let newIndex = i;
                  try {
                    const newIndexParsed = parseInt(newIndexPrompt!);
                    if (newIndexParsed >= 1 && newIndexParsed <= pdfDoc.numPages) {
                      newIndex = newIndexParsed - 1;
                    }
                  } catch (e) {
                    console.error(e);
                  }
                  const newPageOrder = [...pageOrder];
                  newPageOrder.splice(i, 1);
                  newPageOrder.splice(newIndex, 0, p);
                  setPageOrder(newPageOrder);
                }}
                key={p.id}
                className="cursor-pointer relative h-fit bg-white dark:bg-slate-800 m-1 rounded-lg border dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 group"
              >
                <MiniPDFPage key={i} doc={pdfDoc} pageIndex={p.id} scale={scale} />
                <button
                  className="absolute top-0 left-0 p-1 text-red-500 bg-transparent rounded-md hover:bg-red-400 hover:text-black z-10"
                  title="Insert page"
                  onClick={(ev) => {
                    addNewPage(i);
                  }}
                >
                  <IoMdAdd />
                </button>
                <button
                  className="absolute top-0 right-0 p-1 text-red-500 bg-transparent rounded-md hover:bg-red-400 hover:text-black z-10"
                  title="Remove page"
                  onClick={(ev) => {
                    const newPageOrder = [...pageOrder];
                    newPageOrder.splice(i, 1);
                    setPageOrder(newPageOrder);
                  }}
                >
                  <BsTrash />
                </button>
                <div className="absolute top-0 left-0 w-full h-full bg-green-400/0 group-hover:bg-blue-400/30 outline outline-2 outline-transparent group-hover:outline-blue-400 dark:group-hover:outline-blue-500">
                  {" "}
                </div>
              </li>
            ))}
          </ReactSortable>
          <div className="w-full flex justify-end mb-2">
            <Button size="lg" className="mt-1 bg-white dark:bg-slate-800" onClick={downloadReorderedPDF}>
              Download Result
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default withAuth(ReorderPages);