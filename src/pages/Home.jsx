import React, { useEffect } from 'react'
import BasicTemplate from '../myComponents/BasicTemplate'

const Home = () => {

    useEffect(() => {console.log(":LKJHGF")},[])

    return (
        <>
        <BasicTemplate />
        
        
        </>
    )
}

export default Home


// import React, { useState } from 'react';
// import CustomModal from '../components/ModalComponent';
// import { Button } from 'antd';
// import axios from 'axios'; // Import axios for API calls

// const Home = () => {
//     const [open, setOpen] = useState(false);
//     const [confirmLoading, setConfirmLoading] = useState(false);
//     const [modalText, setModalText] = useState('Content for the Dashboard modal');
//     const [loading, setLoading] = useState(false); // Add loading state
//     const [repelAllowed, setRepelAllowed] = useState({})

//     // Function to show modal and make async request
//     const showModal = async () => {
//         setOpen(true);
//         setLoading(true); // Start loading spinner

//         // Make the API request
//         try {
//             let response = await axios.get('https://api.freeapi.app/api/v1/public/randomusers?page=1&limit=10');
//             response = JSON.stringify(response.data);
//             setRepelAllowed(response)
//             // setModalText(JSON.stringify(response.data)); // Display fetched data in modal
//         } catch (error) {
//             setModalText('Failed to fetch data'); // Show error message
//         }

//         setLoading(false); // Stop loading spinner
//     };

//     // Handle OK button in the modal
//     const handleOk = () => {
//         setModalText('Closing the modal in 2 seconds...');
//         setConfirmLoading(true);
//         setTimeout(() => {
//             setOpen(false);
//             setConfirmLoading(false);
//         }, 2000);
//     };

//     // Handle Cancel button in the modal
//     const handleCancel = () => {
//         console.log('Modal closed');
//         setOpen(false);
//     };

//     return (
//         <>
//             <div className="flex h-screen bg-gray-100">
//                 {/* Sidebar */}
//                 <div className="w-64 bg-gray-900 text-gray-100 flex flex-col">
//                     <div className="p-4 border-b border-gray-800">
//                         <h2 className="text-2xl font-bold">Replit Dashboard</h2>
//                     </div>

//                     <div className="flex-1 flex flex-col p-4">
//                         <nav className="flex flex-col gap-4">
//                             {/* Create Repl Button */}
//                             <Button type="primary" className="py-2 px-4">
//                                 + Create Repl
//                             </Button>


//                             {/* Using CustomModal */}
//                             <span onClick={showModal}>
//                             <CustomModal
//                                 title="+ Create Repl"
//                                 content={loading ? 'Loading...' : modalText} // Show loading text while data is fetching
//                                 visible={open}
//                                 onOk={handleOk}
//                                 confirmLoading={confirmLoading}
//                                 onCancel={handleCancel}
//                             />
//                             </span>

//                             <a href="#" className="py-2 px-4 rounded-md hover:bg-gray-800">
//                                 My Repls
//                             </a>
//                             <a href="#" className="py-2 px-4 rounded-md hover:bg-gray-800">
//                                 Templates
//                             </a>
//                             <a href="#" className="py-2 px-4 rounded-md hover:bg-gray-800">
//                                 Explore
//                             </a>
//                             <a href="#" className="py-2 px-4 rounded-md hover:bg-gray-800">
//                                 Settings
//                             </a>
//                         </nav>
//                     </div>

//                     <div className="p-4 border-t border-gray-800">
//                         <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
//                             Log out
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 flex flex-col">
//                     {/* Header */}
//                     <header className="bg-white shadow-md p-4">
//                         <div className="flex justify-between items-center">
//                             <h1 className="text-2xl font-semibold">My Repls</h1>
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 className="border border-gray-300 rounded-md px-4 py-2"
//                             />
//                         </div>
//                     </header>

//                     {/* Dashboard Content */}
//                     <main className="flex-1 p-6">
//                         <div className="grid grid-cols-3 gap-6">
//                             {/* Repl Card 1 */}
//                             <div className="bg-white p-4 rounded-lg shadow-md">
//                                 <h2 className="text-xl font-bold mb-2">Repl 1</h2>
//                                 <p className="text-gray-600">A description of Repl 1</p>
//                                 <button className="bg-blue-500 text-white py-1 px-2 mt-4 rounded-md">
//                                     Open
//                                 </button>
//                             </div>

//                             {/* Repl Card 2 */}
//                             <div className="bg-white p-4 rounded-lg shadow-md">
//                                 <h2 className="text-xl font-bold mb-2">Repl 2</h2>
//                                 <p className="text-gray-600">A description of Repl 2</p>
//                                 <button className="bg-blue-500 text-white py-1 px-2 mt-4 rounded-md">
//                                     Open
//                                 </button>
//                             </div>

//                             {/* Repl Card 3 */}
//                             <div className="bg-white p-4 rounded-lg shadow-md">
//                                 <h2 className="text-xl font-bold mb-2">Repl 3</h2>
//                                 <p className="text-gray-600">A description of Repl 3</p>
//                                 <button className="bg-blue-500 text-white py-1 px-2 mt-4 rounded-md">
//                                     Open
//                                 </button>
//                             </div>
//                         </div>
//                     </main>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Home;
