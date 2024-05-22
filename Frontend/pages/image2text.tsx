import { useState } from "react";
import Button from "../components/button";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";

interface TextContentTextareaProps {
  label: string;
  text: string;
  highlighted?: boolean;
}

const { createWorker } = require('tesseract.js');

function TextContentTextarea(props: TextContentTextareaProps) {
  return (
    <div
      className={`w-full bg-slate-50 dark:bg-slate-700 px-2 pt-1 pb-4 text-black dark:text-white rounded-md shadow flex flex-col  ${
        props.highlighted
          ? "border-2 dark:border-blue-700 border-blue-400 min-h-[15rem]"
          : "border dark:border-blue-900 min-h-[12rem]"
      }`}
    >
      <div className="flex justify-between">
        <h4 className="text-blue-700 dark:text-blue-400 text-lg font-medium my-1">{props.label}</h4>
        <CopyToClipboardButton type="text" title={`Copy text`} copy={props.text} />
      </div>
      <textarea
        className="w-full h-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-md p-1.5 whitespace-pre-wrap"
        readOnly
        value={props.text}
      ></textarea>
    </div>
  );
}

const Image2Text = () => {
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <Header text="Convert Image to Text using OCR"/>
      <input
        aria-label="Add files"
        accept=".png, .jpeg, .jpg, .bmp"
        onChange={(e) => {
          if (!e.currentTarget.files) return;
          if (e.currentTarget.files.length > 0) {
            setFile(e.currentTarget.files.item(0)!);
          }
        }}
        className="2xl:p-12 max-w-full p-5 my-4 rounded-lg border border-blue-700 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 border-dashed block mx-auto"
        type="file"
      />
      <div className="w-full flex justify-end mb-2">
        <Button
          isLoading={isLoading}
          onClick={async (ev) => {
            setIsLoading(true);
            const worker = await createWorker();
            const { data } = await worker.recognize(file, { tessjs_create_pdf: '0' });
            setText(data.text);
            await worker.terminate();
            setIsLoading(false);
          }}
        >
          Extract Text
        </Button>
      </div>
      {text !== '' && (
        <>
          <div className="w-fit mx-auto text-center my-2">
            <h3 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Extract PDF Text</h3>
            <details className=" text-gray-700 dark:text-gray-300 px-2 p-1 rounded-md border bg-slate-50 dark:bg-slate-800 dark:border-slate-600">
              <summary className="cursor-pointer">Options & Instructions</summary>
              <p className="mx-auto mb-2 text-sm">
                Below the text contents of are displayed and can be copied using the button on the right.
              </p>
            </details>
          </div>
          <div className="flex">
            <TextContentTextarea text={text} label="Text from Image" highlighted={true} />
          </div>
        </>
      )}
    </>
  )
}

export default withAuth(Image2Text);