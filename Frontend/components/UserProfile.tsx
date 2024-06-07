import { CiLogout } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";

export default function UserProfile(props: any) {
    return (
        <div className={`bg-white flex flex-col justify-between w-[160px] shadow-md h-[240px] fixed rounded-[10px] border-slate-200 z-50`} style={{ top: props.top, right: props.right }}>
            <div className="bg-orange-300 w-full h-[180px] rounded-t-[10px] flex flex-col items-center justify-center font-sans">
                <RxAvatar className="text-[70px] text-white"/>
                <span>{props.username}</span>
            </div>
            <div className="cursor-pointer h-[60px] flex gap-2 bg-[#3C97FE] rounded-b-[10px] justify-center items-center hover:text-white" onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}>
                <CiLogout />
                Log out
            </div>
        </div>
    )
}