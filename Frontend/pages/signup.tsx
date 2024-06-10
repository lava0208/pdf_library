import { BASE_URL } from "@/Config";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {

    const [formData, setFormData] = useState({
        'username': '',
        'email': '',
        'password': '',
        'confirmPassword': '',
        'signature': '',
    })
    useEffect(() => {
        const pwShowHide = document.querySelectorAll(".eye-icon");
        pwShowHide.forEach((eyeIcon) => {
            if (eyeIcon) {
                eyeIcon.addEventListener("click", () => {
                    let pwFields = eyeIcon.parentElement?.parentElement?.querySelectorAll(".auth-password") as NodeListOf<HTMLInputElement>;
                    pwFields.forEach((password) => {
                        if (password.type === "password") {
                            password.type = "text";
                            eyeIcon.classList.replace("bx-hide", "bx-show");
                        } else {
                            password.type = "password";
                            eyeIcon.classList.replace("bx-show", "bx-hide");
                        }
                    });
                });
            }
        });

        return () => {
            // Clean up event listeners if needed
            pwShowHide.forEach((eyeIcon) => {
                eyeIcon.removeEventListener("click", () => { });
            });
        };
    }, []);

    const handleChange = function (e: any) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = function (e: any) {
        e.preventDefault();
        if (formData.username !== "" && formData.email !== "" && formData.password !== "") {
            if (formData.password === formData.confirmPassword) {
                fetch(`${BASE_URL}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    }),
                })
                    .then((response) => {
                        if (response.ok) {
                            toast.success('User created successfully', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            window.location.href = "/signin";
                        } else {
                            toast.error('User already exists', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            // window.location.href = "/signup";
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } else {
                alert("Password doesn't match");
            }
        }
    }
    return (
        <div className="auth auth-container auth-forms">
            <Head>
                <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet' />
            </Head>
            <div className="auth auth-form signup">
                <div className="auth auth-form-content">
                    <header className="auth auth-header">Signup</header>
                    <form action="#">

                        <div className="auth auth-field">
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username}></input>
                        </div>

                        <div className="auth auth-field">
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email}></input>
                        </div>

                        <div className="auth auth-field">
                            <input type="password" name="password" placeholder="Create password" className="auth auth-password" onChange={handleChange} value={formData.password}></input>
                        </div>

                        <div className="auth auth-field">
                            <input type="password" name="confirmPassword" placeholder="Confirm password" className="auth auth-password" onChange={handleChange} value={formData.confirmPassword}></input>
                            <i className='bx bx-hide eye-icon'></i>
                        </div>

                        <div className="auth auth-field">
                            <button onClick={handleSubmit}>Signup</button>
                        </div>
                    </form>

                    <div className="auth auth-form-link">
                        <span>Already have an account? <Link href="/signin" className="auth auth-link">Login</Link></span>
                    </div>
                </div>

                <div className="auth auth-line"></div>

                <div className="auth media-options">
                    <a href="#" className="auth auth-field google">
                        <Image src="./images/google.png" alt="" className="auth google-img" width={'100'} height={'100'} />
                        <p className="auth">Signup with Google</p>
                    </a>
                </div>

            </div>
            <ToastContainer />
        </div>
    )
}