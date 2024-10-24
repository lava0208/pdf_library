import { useState, useEffect, ChangeEvent } from "react";
import axios from 'axios';
import Head from 'next/head';
import { BASE_URL } from '@/Config';
import SignatureHeader from '@/components/SignatureHeader';
import withAuth from '@/components/withAuth';
import CreatableSelect from "react-select/creatable";

const isValidEmail = (email: any) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const Signature = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState<{ label: string, value: string }[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (newValue: any) => {
        const validEmails = newValue.filter((option: any) => isValidEmail(option.value));
        setSelectedEmails(validEmails);
    };

    useEffect(() => {}, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files?.[0]);
        }
    };

    const sendFile = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('username', localStorage.getItem('username') || '');
            formData.append('folderId', '');
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            formData.append('docname', fileNameWithoutExtension || '');

            try {
                setIsLoading(true);
                const response = await axios.post(`${BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 201) {
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
        </>
    );
};

export default withAuth(Signature);
