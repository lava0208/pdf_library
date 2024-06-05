import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { CiLogout } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { BASE_URL } from '@/Config';

export default function UserProfile(props: any) {
    const router = useRouter();
    const [signature, setSignature] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSignature();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const fetchSignature = async () => {
        try {
            const username = localStorage.getItem('username');

            await fetch(`${BASE_URL}/api/users/signature/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(function (res) {
                return res.json();
            })
            .then(function (json) {
                if (json.signature !== "") {
                    setSignature(`${BASE_URL + "/uploads/" + json.signature}`)
                } else {
                    setSignature("")
                }
            })
        } catch (error) {
            console.error("Error fetching signature:", error);
        }
    };

    const handleSignChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('signature', file);
            try {
                const username = localStorage.getItem('username');

                await fetch(`${BASE_URL}/api/users/signature/${username}`, {
                    method: "POST",
                    body: formData
                })
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (json) {
                        var data = json.signature !== "" ? json.signature : "";
                        setSignature(`${BASE_URL + "/uploads/" + data}`)
                    })
            } catch (error) {
                // Handle error
            }
        }
    };

    const handlePreviewClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`bg-white flex flex-col justify-between shadow-md w-[240px] fixed rounded-[10px] border-slate-200 z-50`} style={{ top: props.top, right: props.right }}>
            <div className="bg-orange-300 w-full rounded-t-[10px] flex flex-col items-center justify-center font-sans pt-3">
                <RxAvatar className="text-[70px] text-white" />
                <span>{props.username}</span>
                <button className="my-3 btn btn-info rounded" onClick={handlePreviewClick}>
                    My Signature
                </button>
            </div>
            <div className="cursor-pointer h-[60px] flex gap-2 bg-[#3C97FE] rounded-b-[10px] justify-center items-center hover:text-white" onClick={handleLogout}>
                <CiLogout />

                Log out
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg flex flex-col items-center" style={{ width: '500px' }}>
                        <span className="self-end close" onClick={closeModal} style={{ fontSize: 24 }}>
                            &times;
                        </span>
                        {
                            signature != "" ? (
                                <img src={signature} alt="Signature Preview" className="w-full h-auto object-contain my-3" />
                            ) : (
                                <p>No signature</p>
                            )
                        }

                        <input type="file" accept="image/*" className="form-control" onChange={handleSignChange} />
                    </div>
                </div>
            )}
        </div>
    );
}
