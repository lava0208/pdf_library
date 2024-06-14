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
            fetch(`${BASE_URL}/getpdfdata?uniqueId=${initialId}`)
                .then((response) => {
                    if (response.ok) {
                        setId(initialId);
                    }
                    else {
                        router.push("/signin");
                    }
                })
                .catch((error) => { console.error(error) })
        } else {
            let token = localStorage.getItem("login-token");
            if (token) {
                fetch(`${BASE_URL}/signin`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        // Handle successful response
                    } else {
                        localStorage.setItem("originDestination", router.asPath);
                        // Assuming router is defined elsewhere in your code
                        router.push("/signin");
                    }
                }).catch(error => {
                    console.error("Error fetching data:", error);
                });
            } else {
                localStorage.setItem("originDestination", router.asPath);
                // Assuming router is defined elsewhere in your code
                router.push("/signin");
            }
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
                        backgroundColor: "#3C97FE",
                        borderRadius: "10px",
                        margin: "5px",
                    }}
                >
                    <div className='flex justify-end items-center h-[40px] mr-4'>
                        <div className={`rounded-[50%] bg-white h-[25px] w-[25px] flex items-center justify-center cursor-pointer`} onClick={() => setShowProfile(!showProfile)}>
                            <div className={`select-none rounded-[50%] h-[23px] w-[23px] font-sans text-white flex items-center justify-center text-lg`}
                                style={{ backgroundColor: `${color}` }}>{username.charAt(0).toUpperCase()}</div>
                        </div>
                    </div>
                    {showProfile && <UserProfile username={username} top="45px" right="20px" />}
                    <div
                        style={{
                            marginLeft: "5px",
                            marginRight: "5px",
                            marginBottom: "5px",
                        }}
                    >
                        <iframe
                            id="pdfIframe"
                            src={`./pdfview/web/viewer.html?id=${id}`}
                            style={{
                                width: "100%",
                                height: "calc(99vh - 45px)",
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