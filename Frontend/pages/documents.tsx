import { useState, ChangeEvent, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import Head from "next/head";
import Button from "../components/button";
import { BASE_URL } from "@/Config";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";

const Documents = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [error, setError] = useState<null | Error>(null);

    const router = useRouter();

    const handleClick = function (url: any) {
        router.push(url);
    }

    const getDocuments = async () => {
        try {
            const response: AxiosResponse = await axios.get(`${BASE_URL}/history`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setDocuments(response.data)
        } catch (err:any) {
            setError(err);
        }
    }

    useEffect(() => {
        getDocuments()
    }, []);

    return (
        <>
            <Head>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
            </Head>
            <Header text="My documents" />
            <div id="Services" className="content-section text-center">
                <div className="container">
                    {isLoading && <p>Loading documents...</p>}
                    {error && <p>Error: {error.message}</p>}

                    <div className="block-heading">
                        <h2>My documents</h2>
                        <p>You can choose any document.</p>
                    </div>

                    <div className="text-right">
                        <button
                            className="btn btn-info"
                            onClick={() => { handleClick('/pdfviewer') }}
                        >
                            Create document
                        </button >
                    </div>

                    <div className="row">
                        {documents.length > 0 && (
                            documents.map((document, i) =>(
                                <div className="col-md-3 col-sm-6 document-list">
                                    <div className="service-box">
                                        <div className="service-icon yellow">
                                            <div className="front-content">
                                                <i className="fa fa-book" aria-hidden="true"></i>
                                                <h3>Document {i + 1}</h3>
                                            </div>
                                        </div>
                                        <div className="service-content">
                                            <h3>Manage Document</h3>
                                            <div className="service-flex">
                                                <h3 onClick={() => { handleClick('/pdfviewer/?id=' + document.uniqueId + '&draft=false') }}>
                                                    <i className="fa fa-eye" aria-hidden="true"></i> View
                                                </h3>
                                                <h3 onClick={() => { handleClick(document.uniqueLink) }}>
                                                    <i className="fa fa-edit" aria-hidden="true"></i> Edit
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuth(Documents);