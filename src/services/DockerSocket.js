// DockerSocket.js

// socket.js
import { serverLocalPath, socketWant } from '@/constants/app';
import { io } from 'socket.io-client';
const DEFAULT_SERVER_URL = `http://localhost:3000`;

// Ensure that the socket connection is only established if needed
let dockerSocket;

if (!socketWant) {
    console.log('Socket connection not needed');
    dockerSocket = null;
} else {
    // Replace with the correct server URL or use an environment variable
    // const SERVER_URL = serverLocalPath;
    
    // Initialize socket connection
    dockerSocket = io(DEFAULT_SERVER_URL);
}

export default dockerSocket;
    
    // import { io } from 'socket.io-client';
    
    // // Default URL to connect with the server or Docker container port
    
    // // Function to create a socket connection with a specific port
    // export const getSocket = (port = 3000) => {
        //     const socketUrl = `http://localhost:${port}`;
        //     const socket = io(socketUrl, {
            //         transports: ['websocket', 'polling'], // Allow fallback to polling
            //         reconnection: true,
            //         reconnectionAttempts: 5,
            //         timeout: 10000,
            //     });
            
            //     socket.on('connect', () => {
                //         console.log(`Connected to socket at ${socketUrl}`);
                //     });
                
                //     socket.on('connect_error', (err) => {
                    //         console.error(`Socket connection error:`, err);
                    //     });
                    
                    //     return socket;
                    // };
                    
                    // // Default socket connection for Docker
                    // const dockerSocket = io(DEFAULT_SERVER_URL, {
                        //     transports: ['websocket', 'polling'], // WebSocket with fallback
                        //     reconnection: true,
//     reconnectionAttempts: 5,
//     timeout: 10000,
// });

// export default dockerSocket;
