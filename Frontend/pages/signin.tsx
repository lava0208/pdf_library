import { BASE_URL } from "@/Config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState ,useEffect } from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        'email': '',
        'password': ''
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
                eyeIcon.removeEventListener("click", () => {});
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
        if (formData.email !== "" && formData.password !== "") {
            fetch(`${BASE_URL}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            })
                .then((response) => {
                    if(response.ok) {
                        toast.success('🦄 Successfully Logined!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });;
                        return response.json();
                    } else {
                        toast.error('Failed to login!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                        document.getElementById("email")?.focus();
                        setFormData({
                            'email': '',
                            'password': ''
                        })
                    }
                })
                .then((data) => {
                    const {token, color, username} = data;
                    localStorage.setItem("color", color);
                    localStorage.setItem("username", username);
                    localStorage.setItem("login-token", token);
                    const originPath = localStorage.getItem("originDestination");
                    console.log(originPath)
                    if (originPath) router.push(originPath);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    return (
        <div className="auth auth-container auth-forms">
            <Head>
                <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet' />
            </Head>            
            <div className="auth auth-form login">
                <div className="auth auth-form-content">
                    <header className="auth auth-header">Login</header>
                    <form action="#">
                        <div className="auth auth-field">
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email}></input>
                        </div>

                        <div className="auth auth-field">
                            <input type="password" name="password" placeholder="Password" className="auth auth-password" onChange={handleChange} value={formData.password}></input>
                            <i className='bx bx-hide eye-icon'></i>
                        </div>

                        <div className="auth auth-field">
                            <button onClick={handleSubmit}>Login</button>
                        </div>
                    </form>

                    <div className="auth auth-form-link">
                        <span className="auth">Don't have an account? <a href="/signup" className="auth auth-link">Signup</a></span>
                    </div>
                </div>

                <div className="auth auth-line"></div>

                <div className="auth media-options">
                    <a href="#" className="auth auth-field google">
                        <img src="./images/google.png" alt="" className="auth google-img"></img>
                        <p className="auth">Login with Google</p>
                    </a>
                </div>

            </div>
            <ToastContainer />
        </div>
    )
}