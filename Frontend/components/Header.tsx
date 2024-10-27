import Image from "next/image";
import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
export default function Header(props: any) {
  const [color, setColor] = useState('');
  const [username, setUsername] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isDocument, setIsDocument] = useState(false);
  const handleLogo = () => {
    window.location.href = "/";
  }
  const handleEsign = () => {
    window.location.href = "/signature";
  }
  useEffect(() => {
    setColor(localStorage.getItem('color') || '');
    setUsername(localStorage.getItem('username') || '');
    setIsDocument(window.location.pathname == "/documents")
  }, []);
  return (
    <>
      <div className="signature-header">
        <div className="d-flex">
          <Image src="images/home.svg" className="cursor-pointer" alt="home" width={20} height={20} onClick={handleLogo} />
          <div className="flex items-center gap-2 border-left pl-2 ml-2">
            <Image src={"images/" + props.icon} alt="signature" width={20} height={20}></Image>
            <h2 className="text-xl sm:text-xl m-0 ml-1">{props.text}</h2>
            {
              isDocument && (
                <h2 className="text-xl sm:text-xl m-0 ml-3 cursor-pointer" onClick={handleEsign}>E-Sign</h2>
              )
            }
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className='flex justify-end items-center h-[40px] mr-2 cursor-pointer'>
            <div className={`rounded-[50%] bg-white h-[40px] w-[40px] flex items-center justify-center`} onClick={() => setShowProfile(!showProfile)}>
              <div className={`select-none rounded-[50%] h-[38px] w-[38px] font-sans text-white flex items-center justify-center text-2xl`}
                style={{ backgroundColor: `${color}` }}>{username.charAt(0).toUpperCase()}</div>
            </div>
          </div>
          {showProfile && <UserProfile username={username} top="80px" right="40px" />}
        </div>
      </div>
    </>
  )
}