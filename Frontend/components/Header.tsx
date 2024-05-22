import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
export default function Header(props: any) {
  const [color, setColor] = useState('');
  const [username, setUsername] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const handleLogo = () => {
    window.location.href = "/";
  }
  useEffect(() => {
    setColor(localStorage.getItem('color') || '');
    setUsername(localStorage.getItem('username') || '');
  }, []);
  return (
    <div className="w-full shadow h-20 flex items-center p-4 justify-between">
      <div className="flex items-center gap-8">
        <Image src="images/logo-black.png" alt="logo" className="cursor-pointer" width={64} height={64} onClick={handleLogo}></Image>
        <h2 className="text-xl sm:text-4xl">{props.text}</h2>
      </div>
      {/* <div>
        <Link href="/">Go to Home</Link>
      </div> */}
      <div className='flex justify-end items-center h-[40px] mr-4 cursor-pointer'>
        <div className={`rounded-[50%] bg-white h-[40px] w-[40px] flex items-center justify-center`} onClick={() => setShowProfile(!showProfile)}>
          <div className={`select-none rounded-[50%] h-[38px] w-[38px] font-sans text-white flex items-center justify-center text-2xl`}
            style={{ backgroundColor: `${color}` }}>{username.charAt(0).toUpperCase()}</div>
        </div>
      </div>
      {showProfile && <UserProfile username={username} top="80px" right="40px" />}
    </div>
  )
}