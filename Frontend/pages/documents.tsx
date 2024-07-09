import { useState, useEffect, useRef } from "react";
import axios, { AxiosResponse } from 'axios';
import Head from "next/head";
import { BASE_URL } from "@/Config";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Document {
    uniqueId: string;
    name: string;
    updatedAt: string;
    username: string;
}

interface Folder {
    _id: string;
    name: string;
    updatedAt: string;
}

const Documents = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<null | Error>(null);
    const [isActiveId, setIsActiveId] = useState<string | null>(null);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [folderName, setFolderName] = useState('New Folder');
    const [parentId, setParentId] = useState('');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [path, setPath] = useState<{ folderId: string; folderName: string }[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [clickTimeout, setClickTimeout] = useState<number | null>(null);
    const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);

    const router = useRouter();

    const handleClick = (url: string) => {
        router.push(url);
    };

    const handleInputChange = (id: string, value: string) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    
        const inputElement = document.getElementById(`folder-name-${id}`) as HTMLInputElement;
        adjustInputWidth(inputElement);
    };

    const getDocuments = async (folderId: string | null = null) => {
        try {
            const username = localStorage.getItem('username');
            const response: AxiosResponse<Document[]> = await axios.get(`${BASE_URL}/history/${username}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setDocuments(response.data);
        } catch (err: any) {
            setError(err);
        }
    };

    const getFolderDocuments = async (folderId: string | null = null) => {
        try {
            const username = localStorage.getItem('username');
            const response: AxiosResponse<Document[]> = await axios.get(`${BASE_URL}/history/${username}/${folderId || ''}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data && response.data.length > 0) {
                setDocuments(response.data);
            } else {
                setDocuments([]);
            }
        } catch (err: any) {
            setError(err);
        }
    };

    const updateDocumentName = async (id: string, documentname: string) => {
        const username = localStorage.getItem('username');
        const payload = {
            id: id,
            username: username,
            documentname: documentname
        };
    
        try {
            await axios.put(`${BASE_URL}/history/${id}/documentname`, payload, {
                headers: {
                    "Content-Type": "application/json"
                },
            });
    
            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc.uniqueId === id ? { ...doc, name: documentname } : doc
                )
            );
    
            setIsActiveId(null);
            setInputValues({});
            toast.success('🦄 Successfully Updated!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err: any) {
            setError(err);
        }
    };
    
    const deleteDocument = async (id: string) => {
        const username = localStorage.getItem('username');
        if (confirm("Do you want to delete this document?") === true) {
            try {
                await axios.delete(`${BASE_URL}/history/${username}/${id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                setDocuments((prevDocuments) => prevDocuments.filter(doc => doc.uniqueId !== id));
                toast.success('🦄 Successfully Deleted!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (err: any) {
                setError(err);
            }
        }
    };

    const updateFolderName = async (id: string, folderName: string) => {
        try {
            await axios.put(`${BASE_URL}/folder/${id}`, { name: folderName }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            setFolders((prevFolders) =>
                prevFolders.map((folder) =>
                    folder._id === id ? { ...folder, name: folderName } : folder
                )
            );
    
            setRenamingFolderId(null);
            setInputValues({});
            toast.success('🦄 Successfully Updated!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err: any) {
            setError(err);
        }
    };
    
    const getFolders = async (parentId: string | null = null) => {
        try {
            const response: AxiosResponse<Folder[]> = await axios.get(`${BASE_URL}/folder`, {
                headers: {
                    "Content-Type": "application/json"
                },
                params: { parentId }
            });
            if (response.data && response.data.length > 0) {
                setFolders(response.data);
            } else {
                setFolders([]);
            }
        } catch (err: any) {
            setError(err);
        }
    };

    const createFolder = async () => {
        try {
            await axios.post(`${BASE_URL}/folder`, { name: folderName, parentId: currentFolderId });
            setFolderName('');
            setParentId('');
            await getFolders(currentFolderId); // Refresh the folder list after creating a new folder
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const deleteFolder = async (folderId: string) => {
        if (confirm("Do you want to delete this folder?") == true) {
            try {
                await axios.delete(`${BASE_URL}/folder/${folderId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                await getFolders(currentFolderId);

                toast.success('🦄 Successfully Deleted!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (err: any) {
                setError(err);
            }
        }
    };

    const handleFolderClick = (folderId: string, folderName: string) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        } else {
            const timeout = window.setTimeout(() => {
                if (renamingFolderId === null) {
                    setActiveFolderId(folderId);
                    setCurrentFolderId(folderId);
                    setPath([...path, { folderId, folderName }]);
                    getFolders(folderId);
                    getFolderDocuments(folderId);
                }
                setClickTimeout(null);
            }, 200);
            setClickTimeout(timeout);
        }
    };

    const handleBreadcrumbClick = (folderId: string | null, index: number) => {
        setActiveFolderId(folderId);
        setCurrentFolderId(folderId);
        setPath(path.slice(0, index + 1));
        getFolders(folderId);
        getFolderDocuments(folderId);
    };

    const handleRenameClick = (folderId: string) => {
        setRenamingFolderId(folderId);
        setInputValues((prev) => ({ ...prev, [folderId]: folders.find((folder) => folder._id === folderId)?.name || '' }));
    };

    const handleRenameBlur = async (id: string, isFolder: boolean) => {
        if (inputValues[id]) {
            if (isFolder) {
                await updateFolderName(id, inputValues[id]);
            } else {
                await updateDocumentName(id, inputValues[id]);
            }
        } else {
            setRenamingFolderId(null);
            setIsActiveId(null);
        }
    };       

    useEffect(() => {
        getFolders();
        getFolderDocuments();
    }, []);

    const adjustInputWidth = (input: HTMLInputElement | null) => {
        if (input) {
            input.style.width = `${Math.max(input.value.length + 1, 10)}ch`;
        }
    };

    useEffect(() => {
        folders.forEach((folder) => {
            const inputElement = document.getElementById(`folder-name-${folder._id}`) as HTMLInputElement;
            if (inputElement) {
                adjustInputWidth(inputElement);
            }
        });
    }, [folders, inputValues]);

    return (
        <>
            <Head>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
            </Head>
            <Header text="My documents" />
            <div id="Services" className="content-section">
                <div className="container-fluid px-5">
                    {isLoading && <p>Loading documents...</p>}
                    {error && <p>Error: {error.message}</p>}

                    <div className="document-navbar mb-3">
                        <div className="dropdown">
                            <button className="btn btn-info dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-expanded="false">
                                <i className="fa fa-plus"></i> <span className="px-3">New</span>
                            </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#" onClick={createFolder}>
                                    <i className="fa fa-folder"></i> Folder
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/pdfviewer') }}>
                                    <i className="fa fa-file-word-o"></i> Word document
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/reorder_pages') }}>
                                    <i className="fa fa-file"></i> Manage your page
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/extract_text') }}>
                                    <i className="fa fa-font"></i> Extract text
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/image2text') }}>
                                    <i className="fa fa-openid"></i> Image to text
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/word2pdf') }}>
                                    <i className="fa fa-file-word-o"></i> Word to pdf
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/excel2pdf') }}>
                                    <i className="fa fa-file-excel-o"></i> Excel to pdf
                                </a>
                                <a className="dropdown-item" href="#" onClick={() => { handleClick('/image2pdf') }}>
                                    <i className="fa fa-picture-o"></i> Image to pdf
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fa fa-code-fork"></i> Version control
                                </a>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="#" onClick={() => { handleBreadcrumbClick(null, -1) }}>
                                    <i className="fa fa-home" style={{ fontSize: 18 }}></i>
                                </a>
                            </li>
                            {path.map((folder, index) => (
                                <li key={folder.folderId} className="breadcrumb-item">
                                    <a href="#" onClick={() => { handleBreadcrumbClick(folder.folderId, index) }}>{folder.folderName}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <table className="table table-hover folder-table">
                        <thead>
                            <tr>
                                <th><i className="fa fa-file"></i></th>
                                <th className="pl-4" style={{width: '50%'}}>Name</th>
                                <th>Modified</th>
                                <th>Modified By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.map((folder) => (
                                <tr key={folder._id} className={folder._id === activeFolderId ? 'active' : ''} onClick={() => setActiveFolderId(folder._id)} onDoubleClick={() => handleFolderClick(folder._id, folder.name)}>
                                    <td><i className="fa fa-folder"></i></td>
                                    <td>
                                        <div className="name-container">
                                            <input
                                                id={`folder-name-${folder._id}`}
                                                type="text"
                                                className="form-control"
                                                readOnly={renamingFolderId !== folder._id}
                                                value={renamingFolderId === folder._id ? inputValues[folder._id] || folder.name : folder.name}
                                                onChange={(e) => handleInputChange(folder._id, e.target.value)}
                                                onBlur={() => handleRenameBlur(folder._id, true)}
                                                onDoubleClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="dropdown">
                                                <button className="btn dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fas fa-ellipsis-h"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-start">
                                                    <a className="dropdown-item" href="#" onClick={() => handleRenameClick(folder._id)}>
                                                        Rename
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => handleFolderClick(folder._id, folder.name)}>
                                                        View
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => deleteFolder(folder._id)}>
                                                        Delete
                                                    </a>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{new Date(folder.updatedAt).toLocaleDateString()}</td>
                                    <td>{localStorage.getItem('username')}</td>
                                </tr>
                            ))}
                            {documents.map((document, i) => (
                                <tr key={document.uniqueId}>
                                    <td><i className="fa fa-file-pdf-o"></i></td>
                                    <td>
                                        <div className="name-container">
                                            <input
                                                id={`document-name-${document.uniqueId}`}
                                                type="text"
                                                className="form-control"
                                                readOnly={isActiveId !== document.uniqueId}
                                                value={inputValues[document.uniqueId] !== undefined ? inputValues[document.uniqueId] : document.name ? document.name : `Document ${i + 1}`}
                                                onChange={(e) => handleInputChange(document.uniqueId, e.target.value)}
                                                onBlur={() => handleRenameBlur(document.uniqueId, false)}
                                                onDoubleClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="dropdown">
                                                <button className="btn dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fas fa-ellipsis-h"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-start">
                                                    <a className="dropdown-item" href="#" onClick={() => setIsActiveId(document.uniqueId)}>
                                                        Rename
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => { handleClick('/pdfviewer/?id=' + document.uniqueId + '&draft=false') }}>
                                                        View
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => { handleClick('/pdfviewer/?id=' + document.uniqueId + '&draft=true') }}>
                                                        Edit
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => deleteDocument(document.uniqueId)}>
                                                        Delete
                                                    </a>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{new Date(document.updatedAt).toLocaleDateString()}</td>
                                    <td>{document.username}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default withAuth(Documents);
