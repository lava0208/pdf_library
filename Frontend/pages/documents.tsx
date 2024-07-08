import { useState, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import Head from "next/head";
import { BASE_URL } from "@/Config";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Documents = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
    const [error, setError] = useState<null | Error>(null);
    const [isActiveId, setIsActiveId] = useState<string | null>(null);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [folderName, setFolderName] = useState('New Folder');
    const [parentId, setParentId] = useState('');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [path, setPath] = useState<any[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

    const router = useRouter();

    const handleClick = function (url: any) {
        router.push(url);
    };

    const handleInputChange = (id: string, value: string) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const getDocuments = async (folderId = null) => {
        try {
            const username = localStorage.getItem('username');
            const response: AxiosResponse = await axios.get(`${BASE_URL}/history/${username}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setDocuments(response.data);
        } catch (err: any) {
            setError(err);
        }
    };

    const getFolderDocuments = async (folderId = null) => {
        try {
            const username = localStorage.getItem('username');
            const response: AxiosResponse = await axios.get(`${BASE_URL}/history/${username}/${folderId || ''}`, {
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

    const updateDocumentName = async (id: any, documentname: any) => {
        const username = localStorage.getItem('username');
        const payload = {
            id: id,
            username: username,
            documentname: documentname
        };

        if (confirm("Do you want to update this document's name?") === true) {
            try {
                await axios.put(`${BASE_URL}/history/${id}/documentname`, payload, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
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
        }
    };

    const deleteDocument = async (id: any) => {
        const username = localStorage.getItem('username');
        if (confirm("Do you want to delete this document?") == true) {
            try {
                await axios.delete(`${BASE_URL}/history/${username}/` + id, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
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

    const getFolders = async (parentId = null) => {
        try {
            const response: AxiosResponse = await axios.get(`${BASE_URL}/folder`, {
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
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleFolderClick = (folderId: any, folderName: string) => {
        setCurrentFolderId(folderId);
        setPath([...path, { folderId, folderName }]);
        getFolders(folderId);
        getFolderDocuments(folderId);
    };

    const handleBreadcrumbClick = (folderId: any, index: number) => {
        setActiveFolderId(folderId);
        setCurrentFolderId(folderId);
        setPath(path.slice(0, index + 1));
        getFolders(folderId);
        getFolderDocuments(folderId);
    };

    useEffect(() => {
        getFolders();
        getFolderDocuments();
    }, []);

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
                                <a className="dropdown-item" href="#" onClick={() => { createFolder() }}>
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
                                    <i className="fa fa-home" style={{fontSize: 18}}></i>
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
                                <th>Name</th>
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
                                            {folder.name}                                            
                                            <div className="dropdown">
                                                <button className="btn dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fas fa-ellipsis-h"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-left">
                                                    <a className="dropdown-item" href="#">
                                                        Rename
                                                    </a>
                                                    <a className="dropdown-item" href="#">
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
                                    <td>{document.name ? document.name : `Document ${i + 1}`}</td>
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
