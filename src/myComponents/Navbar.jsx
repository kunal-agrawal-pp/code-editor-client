import React, { useEffect, useRef } from 'react'
// import NotificationSVG from '../assets/notication.svg';
import SearchSVG from '../assets/search.svg';
import SidebarSVG from '../assets/sidebar.svg';
import DownArrow from '../assets/down-arrow.svg';
import Profile from '../assets/profile.svg'
import UserlogoTemp from '../assets-temp/user-logo.gif';
import '../css/Navbar.css'
// import { DropdownMenu } from './DropdownMenu';

import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isSideBarOpen, setIsSideBarOpen }) => {
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const UserDetails = {
        user_name: "TechWithKunal",
        user_slug: "TechWithKunal",
        user_logo: UserlogoTemp,
    }


    // TEMP
    // const user_name = "TechWithKunal"

    useEffect(() => {
        // Function to handle key press events
        const handleKeyDown = (event) => {
            if (event.key === '/') {
                event.preventDefault(); // Prevent the default behavior (optional)
                if (inputRef.current) {
                    inputRef.current.focus(); // Focus the input when '/' is pressed
                }
            }
        };

        // Attach the event listener when the component is mounted
        window.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    /*
        profile - https://replit.com/@TechLearning 
        not - account - https://replit.com/account
        logout - https://replit.com/logout
    */
    const menuItems = [
        {
            label: "Profile",
            icon: <img src={Profile} className='w-[20px] h-[20px]' />,
            // shortcut: "p",
            onClick: () => { navigate(`/user/@${UserDetails.user_slug}`) },
        },
        {
            label: "Logout",
            icon: <LogOut className='w-[20px] h-[20px]' />,
            // shortcut: "",
            onClick: () => console.log("Billing clicked"),
        },
    ];

    return (
        <>
            <div className="bg-skin-color txt-black w-[100%] h-[7vh] text-white border-b-2 br-grey-100 m-0 p-0 flex items-center px-[1rem]">
                {/* ============ LEFT ========== */}
                <div className="flex items-center flex-row w-[20%] h-[100%]">
                    {/* Sidebar icon */}
                    <div className="cursor-pointer w-[20px] h-[20px]" onClick={() => { setIsSideBarOpen(!isSideBarOpen) }}>
                        <img src={SidebarSVG} alt="Search Icon" style={{ width: '20px', height: '20px' }} />
                    </div>

                    {/* logo */}
                    <div className='cursor-pointer' onClick={() => { navigate("/lol") }}>
                        <div className="flex items-center w-[20px] mx-[0.5rem]">
                            <div className="txt-secondary-color text-[25px] mx-[5px]">{"{"}</div>
                            <div className="flex flex-col">
                                <div className="text-sm txt-logo-color font-bold">ByteForge</div>
                            </div>
                            <div className="txt-secondary-color text-[25px] mx-[5px]">{"}"}</div>
                        </div>
                    </div>

                    {/* Account */}
                    {/* <div> */}
                    {/* <button className="button-tranparent"> */}
                    {/* ORGANIGATIOIN logo */}
                    {/* ORGANIGATIOIN NAME */}
                    {/* ORGANIGATIOIN TAG - "Free", "Prenium" */}
                    {/* ORGANISATION ARROW (down) */}
                    {/* </button> */}
                    {/* </div> */}
                </div>

                {/* ============ MIDDLE ========== */}
                <div className="flex items-center flex-row grid justify-items-center w-[60%] h-[100%]">
                    <div className="input-box flex items-center color-light-black">
                        <img src={SearchSVG} alt="Search Icon" className='color-light-black' />
                        <input className="txt-input" type="text" placeholder="Search" ref={inputRef} />
                        <div className='button-code text-xs'>press - /</div>
                    </div>
                </div>

                {/* ============ RIGHT ========== */}
                <div className="flex items-center grid justify-items-end flex-row w-[20%] h-[100%]">
                    {/* <img src={NotificationSVG} alt="Search Icon" className="color-light-black" /> */}

                    {/* user profile */}
                    
                    {/* <DropdownMenu
                        triggerElement={<div className='button-hover-white flex items-center px-[0.2rem] py-[0.3rem] br-1 hover:bg-white transition-1'>
                            <img src={UserDetails.user_logo} alt="" className='no-img user-logo w-[32px] h-[32px]' />
                            <img src={DownArrow} alt="" className='w-[25px] h-[25px]' />
                        </div>}

                        menuLabel={
                            <>
                                <div className='flex items-center bg-white w-[100%] h-[3.5rem] px-[0.5rem] gap-[0.3rem]'>
                                    <img src={UserDetails.user_logo} alt="" className='no-img user-logo w-[32px] h-[32px]' />
                                    <div>
                                        <h4 className='text-sm'>@{UserDetails.user_name}</h4>
                                        <div className="button-code text-xs ml-[0.2rem] !w-[2rem] !h-[1.3rem]">FREE</div>
                                    </div>
                                </div>
                            </>}

                        isMenuLabelIsElement={true}
                        menuItems={menuItems} /> */}
                </div>
            </div>
        </>
    )
}

export default Navbar