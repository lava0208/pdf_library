'use client';
import { BASE_URL } from '@/Config';
import { useRouter } from 'next/router';
import UserProfile from '@/components/UserProfile';
import { useState, useEffect } from 'react';

const OpenPdf = () => {

    const router = useRouter();

    const [color, setColor] = useState('');
    const [username, setUsername] = useState('');

    const [showProfile, setShowProfile] = useState(false);

    const [id, setId] = useState('');

    useEffect(() => {
        setColor(localStorage.getItem('color') || '');
        setUsername(localStorage.getItem('username') || '');
        const urlParams = new URLSearchParams(window.location.search);
        const initialId = urlParams.get('id');
        if (initialId) {
            fetch(`${BASE_URL}/getpdfform?uniqueId=${initialId}`)
                .then((response) => {
                    if (response.ok) {
                        setId(initialId);
                    }
                    else {
                        router.push("/signin");
                    }
                })
                .catch((error) => { console.error(error) })
        }
    }, [setId]);

    useEffect(() => {
        if (id) {
            const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement | null;
            if (iframe) {
                iframe.src = `./pdfview/web/viewer.html?id=${id}`;
            }
        }
    }, [id]);

    return (
        <>
            <div style={{ width: "100%", maxHeight: "100vh", overflow: "hidden" }} onClick={() => { }}>
                <div
                    style={{
                        overflow: "hidden",
                    }}
                >
                    {showProfile && <UserProfile username={username} top="45px" right="20px" />}
                    <div>
                        <iframe
                            id="pdfIframe"
                            src={`./pdfview/web/viewer.html?id=${id}`}
                            style={{
                                width: "100%",
                                height: "100vh",
                                border: "none",
                                paddingBottom: "none",
                                margin: "none",
                            }}
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OpenPdf;