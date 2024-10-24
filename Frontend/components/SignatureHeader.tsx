import Image from "next/image";
export default function SignatureHeader() {
  const linkToDocuments = () => {
    if(window.location.pathname == "/documents"){
      window.location.href = "/";
    }else{
      window.location.href = "/documents";
    }
  }
  return (
    <div className="w-full shadow flex items-center px-3 py-2 justify-between">
      <div className="flex items-center gap-3">
        <Image src="images/home.svg" alt="home" className="cursor-pointer" width={20} height={20} onClick={linkToDocuments}></Image>
        <div className="flex items-center gap-2 border-left pl-2">
          <Image src="images/signature.svg" alt="signature" className="cursor-pointer" width={24} height={24}></Image>
          <h2 className="text-xl sm:text-xl m-0">Request Signature</h2>
        </div>
      </div>
      <div className='flex justify-end items-center h-[40px] mr-1 cursor-pointer'>
        <h2 className="text-xl sm:text-lg m-0" onClick={linkToDocuments}>Close</h2>
      </div>
    </div>
  )
}