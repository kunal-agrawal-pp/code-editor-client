import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { DialogDemo } from './DialogDemo'
import ComboboxForm from './DropdownMenu';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getToken, getUUID } from '@/utils/token';
import { serverPath } from '@/constants/app';
// import ComboboxForm from './DropDown'

import socket from '@/services/SocketClient';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ isSideBarOpen }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [projectTile, setProjectTile] = useState('');
    const [projectDesc, setProjectDesc] = useState('');

    const navigate = useNavigate();

    const languageOptions = [
        { label: "React Js", value: "React Js" },
        { label: "Python", value: "Python" },
        { label: "Java", value: "Java" },
        // ... more options
    ];

    const handleSelect = (value) => {
        console.log('Selected value:', value);
    };

    useEffect(() => {
        // Clean up the listener when the component unmounts
        return () => {
            socket.off('message');
        };
    }, []);

    const handleSubmit = async () => {
        console.log('Project title:', projectTile);
        console.log('Selected language:', selectedLanguage);

        if (!projectTile) {
            toast.error("Please enter the project title");
            return;
        }

        const loadingToast = toast.loading('Processing...');

        try {
            const response = await axios.post(`${serverPath}/user/create-space`, {
                token: getToken() || "",
                user_uuid: getUUID() || "",
                space_lang: selectedLanguage,
                space_title: projectTile,
                space_desc: projectDesc || "",
            });

            console.log('Response:', response.data.data);
            const owner = response.data.data.owner;
            const space_uuid = response.data.data.space_uuid;
            const space_title = response.data.data.space_title;
            const space_lang = response.data.data.space_lang;
            const space_desc = response.data.data.space_desc;
            const space_icon = response.data.data.space_icon;

            const space_url = response.data.data.space_url;

            if (response.data.success) {
                toast.success("Great!...Setting your environment");
                const loadingToast2 = toast.loading('Processing...');

                socket.emit('create-environment', `{"user_uuid": "${getUUID()}", "space_uuid": "${space_uuid}", "space_lang": "${space_lang}"}`);
                socket.on('environment-created', (data) => {
                    if (data.success) {
                        console.log('Environment created:', data);
                        document.cookie = `space_uuid=${space_uuid}`;
                        document.cookie = `space_title=${space_title}`;
                        document.cookie = `space_lang=${space_lang}`;
                        document.cookie = `space_desc=${space_desc}`;
                        document.cookie = `space_icon=${space_icon}`;
                        document.cookie = `space_url=${space_url}`;
                        navigate(`/code/${space_uuid}`);
                                                
                        // toast.success("Your environment is ready...loading it...");
                    }else {
                        toast.error("Failed to set environment");
                    }
                    console.log('Environment created:', data);
                    toast.dismiss(loadingToast2);
                });

                // const response2 = await axios.post(`${serverPath}/user/create-environment`, {
                //     user_uuid: getUUID() || "",
                //     environment_language: selectedLanguage,
                //     token: getToken() || "",
                // });

                // if (response2.data.success) {
                //     toast.success("Great!...Environment set");
                //     toast.dismiss(loadingToast2);
                // } else {
                //     toast.error("Failed to set environment");
                // }

            } else {
                toast.error("Failed to create repl");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to create repl");
        } finally {
            toast.dismiss(loadingToast);
        }
    }




    return (
        <>
            {isSideBarOpen && (
                <div className="w-[15rem] h-[93vh] py-[1.2rem] px-[0.5rem] bg-[var(--color-1)]">
                    <>
                        <div className="w-[100%] flex flex-col items-center">


                            <DialogDemo
                                button={
                                    <Button type="outline" className="py-2 px-4 button">
                                        + Create Repl
                                    </Button>
                                }
                                html={
                                    <div className=''>
                                        <h3 className="text-black text-lg font-light">Select your environment</h3>
                                        <ComboboxForm
                                            options={languageOptions}
                                            onSelect={handleSelect}
                                            label="Language"
                                            placeholder="Select language"
                                            selectedValue={selectedLanguage}
                                            setSelectedValue={setSelectedLanguage}
                                        // description="This give you the power to select your environment"
                                        />
                                        <br />
                                        <Input type="text" placeholder="Enter the project title" value={projectTile} onChange={(e) => { setProjectTile(e.target.value) }}></Input>
                                        <br />
                                        <Input type="text" placeholder="Enter the project description (not required)" value={projectDesc} onChange={(e) => { setProjectDesc(e.target.value) }}></Input>
                                        <div className='items-center w-[100%] text-center mt-5'>
                                            <Button onClick={() => { handleSubmit() }} type="outline" className="py-2 px-4 button">
                                                Create Repl
                                            </Button>
                                        </div>
                                    </div>
                                }
                            />

                        </div>
                    </>
                </div>
            )}
        </>
    )
}

export default Sidebar