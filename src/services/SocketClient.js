// socket.js
import { serverLocalPath } from '@/constants/app';
import { io } from 'socket.io-client';

// Replace with the correct server URL or use an environment variable
const SERVER_URL = serverLocalPath;

// Initialize socket connection and export it
const socket = io(SERVER_URL);

export default socket;
