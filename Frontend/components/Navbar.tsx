import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import UserProfile from "./UserProfile";

const menus = [
    {
        id: 1,
        title: "PDF Viewer",
        description: "You can read your PDF document and use some extra features.",
        icon: "fa fa-book",
        path: "/pdfviewer",
    },
    {
        id: 2,
        title: "Manage your Page",
        description: "You can simply change the order of pages and delete pages by your hand.",
        icon: "fa fa-file-o",
        path: "/reorder_pages",
    },
    {
        id: 3,
        title: "Extract Text",
        description: "You can extract text from your PDF document.",
        icon: "fa fa-font",
        path: "/extract_text",
    },
    {
        id: 4,
        title: "Image to Text",
        description: "You can extract text from specified image using OCR function.",
        icon: "fa fa-openid",
        path: "/image2text",
    },
    {
        id: 5,
        title: "Word to PDF",
        description: "You can convert your Word document to PDF document easily.",
        icon: "fa fa-file-word-o",
        path: "/word2pdf",
    },
    {
        id: 6,
        title: "Excel to PDF",
        description: "You can convert your excel document to PDF document simply.",
        icon: "fa fa-file-excel-o",
        path: "/excel2pdf",
    },
    {
        id: 7,
        title: "Image to PDF",
        description: "You can make PDF document from images perfectly.",
        icon: "fa fa-picture-o",
        path: "/image2pdf",
    },
    {
        id: 8,
        title: "Version Control",
        description: "You can manage your pdf version easily.",
        icon: "fa fa-code-fork",
        path: "/",
    },
];

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [color, setColor] = useState('');
    const [username, setUsername] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem("originalDestination", router.asPath);
    }, [router.asPath]);

    const handleClick = function (url: any) {
        router.push(url);
    };

    useEffect(() => {
        setColor(localStorage.getItem('color') || '');
        setUsername(localStorage.getItem('username') || '');
    }, []);

    return (
        <nav className="header-navbar">
            <div className="header-left">
                <Image
                    id="logo"
                    src="/images/logo.png"
                    alt="logo"
                    width={80}
                    height={80}
                />
                <div className="menu-item">
                    <div className="menu-title" onClick={toggleDropdown}>
                        All Tools <i className="fa fa-solid fa-angle-down"></i>
                    </div>
                    {isDropdownOpen && (
                        <div className="all-menu-dropdown">
                            {menus.map((menu) => (
                            <div
                                key={menu.id}
                                className="menu-sub-item"
                                onClick={() => handleClick(menu.path)}
                            >
                                <i className={menu.icon} aria-hidden="true"></i>
                                <div className="ml-3">
                                    <div className="title">{menu.title}</div>
                                    <div className="description">{menu.description}</div>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
                <div
                    className="menu-title"
                    onClick={() => { handleClick("/documents"); }}
                >
                    Documents
                </div>
                <div
                    className="menu-title"
                    onClick={() => { handleClick("/signature"); }}
                >
                    E-Sign
                </div>
            </div>
            <div className="header-right">
                {/* <div
                    className="menu-title"
                    onClick={() => { handleClick("/"); }}
                >
                    Pricing
                </div> */}
                {
                    username ? (
                        <div className="flex items-center justify-between">
                            <div className='flex justify-end items-center h-[40px] mr-2 cursor-pointer'>
                                <div className={`rounded-[50%] bg-white h-[40px] w-[40px] flex items-center justify-center`} onClick={() => setShowProfile(!showProfile)}>
                                <div className={`select-none rounded-[50%] h-[38px] w-[38px] font-sans text-white flex items-center justify-center text-2xl`}
                                    style={{ backgroundColor: `${color}` }}>{username.charAt(0).toUpperCase()}</div>
                                </div>
                            </div>
                            {showProfile && <UserProfile username={username} top="80px" right="40px" />}
                        </div>
                    ) : (
                        <div
                            className="menu-title"
                            onClick={() => { handleClick("/signin"); }}
                        >
                            Log in
                        </div>
                    )
                }
            </div>
        </nav>
    );
}
