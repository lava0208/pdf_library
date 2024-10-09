'use client';
import { BASE_URL } from '@/Config';
import { useRouter } from 'next/router';
import UserProfile from '@/components/UserProfile';
import { useState, useEffect } from 'react';
import withAuth from "@/components/withAuth";
import Link from "next/link";

const PDFViewer = () => {
  const router = useRouter();

  const [color, setColor] = useState('');
  const [username, setUsername] = useState('');

  const [showProfile, setShowProfile] = useState(false);

  const [id, setId] = useState('');
  const [isDraft, setIsDraft] = useState('');

  useEffect(() => {
    setColor(localStorage.getItem('color') || '');
    setUsername(localStorage.getItem('username') || '');
    const urlParams = new URLSearchParams(window.location.search);
    const initialId = urlParams.get('id');
    const isOpenSavedPdf = urlParams.get('draft');
    const username = localStorage.getItem('username');
    
    if (initialId) {
      var url = isOpenSavedPdf != null ? `${BASE_URL}/history/${username}/${initialId}` : `${BASE_URL}/getpdfdata?uniqueId=${initialId}`;
      
      fetch(url)
        .then((response) => {
          if (response.ok) {
            setId(initialId);
            if(isOpenSavedPdf != null){
              if(isOpenSavedPdf == "true"){
                setIsDraft("true")
              }else{
                setIsDraft("false")
              }
            }
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
        if(isDraft != null){
          iframe.src = `./pdfview/web/viewer.html?id=${id}&draft=${isDraft}`;
        }else{
          iframe.src = `./pdfview/web/viewer.html?id=${id}`;
        }
      }
    }
  }, [id]);

  return (
    <>
      <div style={{ width: "100%", maxHeight: "100vh", overflow: "hidden" }} onClick={() => {}}>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          {/* <div className='flex justify-between items-center pdf-header'>
            <Link href="/">
              <img src="images/logo-black.png" alt="logo" width={'50'} />
            </Link>
            <div className="view-mode">
              <div className="item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg> View</div>
              <div className="item active"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 19h-4v-2h4v2zm2.946-4.036l3.107 3.105-4.112.931 1.005-4.036zm12.054-5.839l-7.898 7.996-3.202-3.202 7.898-7.995 3.202 3.201zm-6 8.92v3.955h-16v-20h7.362c4.156 0 2.638 6 2.638 6s2.313-.635 4.067-.133l1.952-1.976c-2.214-2.807-5.762-5.891-7.83-5.891h-10.189v24h20v-7.98l-2 2.025z"/></svg> Edit</div>
            </div>
            <div className={`rounded-[50%] bg-white h-[25px] w-[25px] flex items-center justify-center cursor-pointer`} onClick={() => setShowProfile(!showProfile)}>
              <div className={`select-none rounded-[50%] h-[23px] w-[23px] font-sans text-white flex items-center justify-center text-lg`} 
                style={{backgroundColor: `${color}`}}>{username.charAt(0).toUpperCase()}</div>
            </div>
          </div> */}
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

export default withAuth(PDFViewer);