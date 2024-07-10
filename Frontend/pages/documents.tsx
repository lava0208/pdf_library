import { useState, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import Head from 'next/head';
import { BASE_URL } from '@/Config';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import withAuth from '@/components/withAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Document {
    uniqueId: string;
    name: string;
    updatedAt: string;
    username: string;
    folderId: string | null; // Add folderId to the Document interface
}

interface Folder {
    _id: string;
    name: string;
    updatedAt: string;
    parentId: string | null;
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
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [moveItemId, setMoveItemId] = useState<string | null>(null);
    const [moveItemName, setMoveItemName] = useState<string | null>(null);
    const [isFolderMove, setIsFolderMove] = useState<boolean>(true);

    const router = useRouter();

    const handleClick = (url: string) => {
        router.push(url);
    };

    const handleInputChange = (id: string, value: string) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const getFolderDocuments = async (folderId: string | null = null) => {
        try {
            const username = localStorage.getItem('username');
            const response: AxiosResponse<Document[]> = await axios.get(`${BASE_URL}/history/folder/${username}/${folderId}`, {
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
        if (!folderName.trim()) {
            toast.error('Folder name cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            const parentIdToUse = currentFolderId || null;
            await axios.post(`${BASE_URL}/folder`, { name: folderName, parentId: parentIdToUse });
            setFolderName('New Folder');
            setParentId('');
            await getFolders(parentIdToUse);
        } catch (error) {
            toast.error('Error creating folder', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const deleteFolder = async (folderId: string) => {
        if (confirm("Do you want to delete this folder?") === true) {
            try {
                await axios.delete(`${BASE_URL}/folder/${folderId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                setFolders((prevFolders) => prevFolders.filter(folder => folder._id !== folderId));
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
        setActiveFolderId(folderId);
        setCurrentFolderId(folderId);
        setPath([...path, { folderId, folderName }]);
        getFolders(folderId);
        getFolderDocuments(folderId);
        localStorage.setItem("currentFolderId", folderId);
    };

    const handleBreadcrumbClick = (folderId: string | null, index: number) => {
        setActiveFolderId(folderId);
        setCurrentFolderId(folderId);
        setPath(path.slice(0, index + 1));
        getFolders(folderId);
        getFolderDocuments(folderId);

        if(index === -1){
            localStorage.removeItem("currentFolderId")
        }
    };

    const handleRenameClick = (id: string, isFolder: boolean) => {
        setRenamingFolderId(id);
        setInputValues((prev) => ({
            ...prev,
            [id]: isFolder
                ? folders.find((folder) => folder._id === id)?.name || ''
                : documents.find((doc) => doc.uniqueId === id)?.name || ''
        }));
    };

    const handleRenameBlur = async (id: string, isFolder: boolean) => {
        const value = inputValues[id];
        if (value === undefined || value.trim() === '') {
            setRenamingFolderId(null);
            setIsActiveId(null);
            return;
        }
        if (isFolder) {
            await updateFolderName(id, value);
        } else {
            await updateDocumentName(id, value);
        }
        setRenamingFolderId(null);
        setIsActiveId(null);
    };

    const openMoveModal = (id: string, name: string, isFolder: boolean) => {
        setMoveItemId(id);
        setMoveItemName(name);
        setIsFolderMove(isFolder);
        setShowMoveModal(true);
    };

    const moveItem = async (newParentId: string | null) => {
        if (moveItemId) {
            try {
                const endpoint = isFolderMove ? `/folder/${moveItemId}/move` : `/history/${moveItemId}/move`;
                await axios.put(`${BASE_URL}${endpoint}`, { newParentId: newParentId ? newParentId : null }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                // Refresh folders and documents
                getFolders(currentFolderId);
                getFolderDocuments(currentFolderId);
    
                setShowMoveModal(false);
                toast.success('🦄 Successfully Moved!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            } catch (error) {
                toast.error('Error moving item', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            }
        }
    };

    useEffect(() => {
        localStorage.removeItem("currentFolderId")
        getFolders();
        getFolderDocuments();
    }, []);

    const adjustInputWidth = (input: HTMLInputElement | null) => {
        if (input) {
            input.style.width = `${Math.max(input.value.length + 1, 5)}ch`;
        }
    };

    // Move modal JSX
    const MoveModal = () => (
        <div className={`modal ${showMoveModal ? 'd-block' : 'd-none'}`} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Move {isFolderMove ? 'Folder' : 'Document'}: {moveItemName}</h5>
                        <button type="button" className="close" onClick={() => setShowMoveModal(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Select the destination folder:</p>
                        <ul className="list-group">
                            <li className="list-group-item" onClick={() => moveItem(null)}>Home</li>
                            {folders.filter(folder => folder._id !== moveItemId).map((folder) => (
                                <li key={folder._id} className="list-group-item" onClick={() => moveItem(folder._id)}>
                                    <i className="fa fa-folder mr-2"></i> {folder.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        folders.forEach((folder) => {
            adjustInputWidth(document.getElementById(`folder-name-${folder._id}`) as HTMLInputElement);
        });
    }, [folders]);

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
                                            <input
                                                id={`folder-name-${folder._id}`}
                                                type="text"
                                                className="form-control"
                                                readOnly={renamingFolderId !== folder._id}
                                                value={inputValues[folder._id] !== undefined ? inputValues[folder._id] : folder.name}
                                                onChange={(e) => handleInputChange(folder._id, e.target.value)}
                                                onBlur={() => handleRenameBlur(folder._id, true)}
                                                onDoubleClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="dropdown">
                                                <button className="btn dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fas fa-ellipsis-h"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-start">
                                                    <a className="dropdown-item" href="#" onClick={() => handleRenameClick(folder._id, true)}>
                                                        Rename
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => handleFolderClick(folder._id, folder.name)}>
                                                        View
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => deleteFolder(folder._id)}>
                                                        Delete
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => openMoveModal(folder._id, folder.name, true)}>
                                                        Move
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
                                                readOnly={renamingFolderId !== document.uniqueId}
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
                                                    <a className="dropdown-item" href="#" onClick={() => handleRenameClick(document.uniqueId, false)}>
                                                        Rename
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => deleteDocument(document.uniqueId)}>
                                                        Delete
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={() => openMoveModal(document.uniqueId, document.name, false)}>
                                                        Move
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
            <MoveModal />
            <ToastContainer />
        </>
    );
};

export default withAuth(Documents);
