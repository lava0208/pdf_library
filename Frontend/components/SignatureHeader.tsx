import Image from "next/image";
export default function SignatureHeader() {
  const linkToDocuments = () => {
    if(window.location.pathname == "/"){
      window.location.href = "/";
    }else{
      window.location.href = "/";
    }
  }
  return (
    <div className="signature-header">
      <div className="d-flex">
        <img src="images/home.svg" alt="home" width={20} onClick={linkToDocuments} />
        <div className="flex items-center gap-2 border-left pl-2 ml-2">
          <Image src="images/signature.svg" alt="signature" className="cursor-pointer" width={24} height={24}></Image>
          <h2 className="text-xl sm:text-xl m-0">Request Signature</h2>
        </div>
      </div>
      <div className="signature-status-bar">
        <div className="signature-status-item">
          <div className="status-circle progress"></div>
          <small>Add</small>
        </div>        
        <div className="signature-line"></div>
        <div className="signature-status-item">
          <div className="status-circle"></div>
          <small>Prepare</small>
        </div>
        <div className="signature-line"></div>
        <div className="signature-status-item">
          <div className="status-circle"></div>
          <small>Send</small>
        </div>
      </div>
      <div className='flex justify-end items-center h-[40px] mr-1 cursor-pointer'>
        <h2 className="text-xl sm:text-lg m-0" onClick={linkToDocuments}>Close</h2>
      </div>
    </div>
  )
}