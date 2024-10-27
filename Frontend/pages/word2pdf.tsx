import { useState, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import Button from "../components/button";
import { BASE_URL } from "@/Config";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Word2PDF = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };
    const handleFileUpload = async () => {
        setIsLoading(true);
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response: AxiosResponse = await axios.post(
                    `${BASE_URL}/upload_word`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } catch (error) {
                toast.error('Error uploading file!', {
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
        } else {
            toast.error('No file selected!', {
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
        toast.success('successfully converted!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        setIsLoading(false);
    };
    const handleFileDownload = async () => {
        try {
            const response: AxiosResponse<Blob> = await axios.get(
                `${BASE_URL}/download_word`,
                {
                    responseType: "blob", // Set the response type to blob
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "file.pdf"); // Set the filename for the downloaded file
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            toast.error("Error downloading file", {
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

    return (
        <>
            <Header text="Convert Word to PDF Document" icon="word.png" />

            <div className="container w-50">
                <label
                    htmlFor="add-file"
                    className="file-upload-container mt-5"
                >
                    <div className="file-upload-content">
                        <img src="images/download.svg" className="img-fluid bg-img" />
                        <div>
                            {file ? (
                                file.name
                            ) : (
                                <>
                                    <strong className="mr-1">Choose a file</strong>or drag it here.
                                </>
                            )}
                        </div>
                    </div>
                </label>
                <input
                    id="add-file"
                    aria-label="Add files"
                    accept=".docx, .doc"
                    onChange={handleFileChange}
                    className="hidden"
                    type="file"
                />
            </div>

            {
                file && (
                    <div className="w-full flex justify-center gap-5 mt-4">
                        <Button
                            size="lg"
                            isLoading={isLoading}
                            onClick={handleFileUpload}
                        >
                            <img src="images/convert.svg" width={18} />
                            Convert
                        </Button>
                        <Button
                            size="lg"
                            isLoading={isLoading}
                            onClick={handleFileDownload}
                        >
                            <img src="images/download.svg" width={18} />
                            Download
                        </Button>
                    </div>
                )
            }

            <ToastContainer />
        </>
    );
};

export default withAuth(Word2PDF);
