import { useState, ChangeEvent } from "react";
import axios from 'axios';
import Head from 'next/head';
import { BASE_URL } from '@/Config';
import SignatureHeader from '@/components/SignatureHeader';
import withAuth from '@/components/withAuth';
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isValidEmail = (email: any) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const Signature = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState<{ label: string, value: string }[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleChange = (newValue: any) => {
        const validEmails = newValue.filter((option: any) => isValidEmail(option.value));
        setSelectedEmails(validEmails);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files?.[0]);
        }
    };

    const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value;
        setMessage(newMessage);
    };

    const sendFile = async () => {
        if(selectedEmails.length === 0){
            toast.error('Please add recipients', {
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
        if(!file){
            toast.error('Please upload file', {
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
        if (file) {
            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('username', localStorage.getItem('username') || '');
            formData.append('folderId', '');
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            formData.append('docname', fileNameWithoutExtension || '');
            
            localStorage.setItem("recipients", JSON.stringify(selectedEmails));
            localStorage.setItem("message", message);

            try {
                setIsLoading(true);
                const response = await axios.post(`${BASE_URL}/upload-signature`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 201) {
                    window.location.href = response.data.uniqueLink;

                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <Head>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
            </Head>
            <SignatureHeader />
            <div className="content-section">
                <div className="container w-50">
                    {isLoading && <div className="loading-icon-container">
                        <img src="images/loading-icon.gif" className="img-fluid bg-img" />
                    </div>}

                    <label htmlFor="recipients">Recipients</label>
                    <div className="text-sm" id="recipients">
                        <CreatableSelect
                            isMulti
                            value={selectedEmails}
                            onChange={handleChange}
                            getNewOptionData={(inputValue) => ({
                                label: inputValue,
                                value: inputValue,
                            })}
                            placeholder="Add Recipients"
                            noOptionsMessage={() => null}
                        />
                    </div>

                    <label htmlFor="message" className="mt-4">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        placeholder="Type Message"
                        className="form-control d-block w-100"
                        value={message}
                        onChange={handleMessageChange}
                    ></textarea>

                    <label htmlFor="files" className="mt-4">Files</label>
                    <label
                        htmlFor="add-document"
                        className="h-40 w-100 border flex align-items-center justify-content-center rounded-lg"
                    >
                        {file ? file.name : "Drag & Drop Document Here"}
                    </label>

                    <input
                        id="add-document"
                        aria-label="Add files"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        type="file"
                    />

                    <div className="document-navbar text-right">
                        <label className="btn btn-info px-4 d-flex align-items-center mt-3" onClick={sendFile}>
                            Next
                        </label>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default withAuth(Signature);
