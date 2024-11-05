import { useEffect, useRef, useState, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import io from "socket.io-client";

const CodeEditor = ({ language, defaultValue, currFileContent, filePath, onChange, setIsSaved }) => {
    const editorRef = useRef();
    const socketRef = useRef(null);
    const [fileContent, setFileContent] = useState(currFileContent);
    const [isConnected, setIsConnected] = useState(false);
    const updateQueueRef = useRef([]);
    const lastChangeTimestamp = useRef(null);
    const saveTimeoutRef = useRef(null);

    // Track if the editor has initialized listeners to avoid redundant setup
    const [isEditorMounted, setIsEditorMounted] = useState(false);

    

    useEffect(() => {
        setFileContent(currFileContent);
    }, [currFileContent]);

    const processUpdateQueue = useCallback(() => {
        if (!socketRef.current?.connected || updateQueueRef.current.length === 0) return;

        console.log("Processing queued updates:", updateQueueRef.current.length);

        while (updateQueueRef.current.length > 0) {
            const update = updateQueueRef.current.shift();
            try {
                socketRef.current.emit("file-updated", update);
                console.log("Successfully processed queued update for:", update.filePath);
            } catch (error) {
                console.error("Failed to process update:", error);
                updateQueueRef.current.unshift(update);
                break;
            }
        }
    }, []);

    useEffect(() => {
        let socketInstance = null;

        const initializeSocket = () => {
            const port = localStorage.getItem("userDockerPort");
            if (!port) {
                console.error("No port found in localStorage");
                return null;
            }

            const DEFAULT_SERVER_URL = `http://localhost:${port}`;
            console.log("Initializing socket connection to:", DEFAULT_SERVER_URL);

            socketInstance = io(DEFAULT_SERVER_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000,
                transports: ['websocket']
            });

            socketRef.current = socketInstance;

            socketInstance.on("connect", () => {
                console.log("Socket connected, id:", socketInstance.id);
                setIsConnected(true);
                processUpdateQueue();
            });

            socketInstance.on("disconnect", (reason) => {
                console.log("Socket disconnected:", reason);
                setIsConnected(false);
            });

            socketInstance.on("connect_error", (error) => {
                console.error("Connection error:", error.message);
                setIsConnected(false);
            });

            socketInstance.on("file-save-status", (response) => {
                if (!response.success) {
                    console.error("File save error:", response.message);
                } else {
                    console.log("File saved successfully:", response.filePath);
                }
            });

            return socketInstance;
        };

        initializeSocket();

        return () => {
            if (socketInstance) {
                console.log("Cleaning up socket connection");
                socketInstance.off("connect");
                socketInstance.off("disconnect");
                socketInstance.off("connect_error");
                socketInstance.off("file-save-status");
                socketInstance.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [processUpdateQueue]);

    const emitFileUpdate = useCallback((changeDetails) => {
        if (!filePath) {
            console.error("Cannot emit update: filePath is missing");
            return;
        }

        const updateData = {
            ...changeDetails,
            filePath: filePath.trim(),
        };

        console.log("Preparing to emit update for file:", updateData.filePath);

        const isSocketConnected = socketRef.current?.connected;

        if (!isSocketConnected) {
            console.log("Socket not connected, queueing update for:", updateData.filePath);
            updateQueueRef.current.push(updateData);
            if (socketRef.current) {
                socketRef.current.connect();
            }
            return;
        }

        try {
            socketRef.current.emit("file-updated", updateData);
            console.log("Update emitted successfully for:", updateData.filePath);
        } catch (error) {
            console.error("Emit error:", error);
            updateQueueRef.current.push(updateData);
        }
    }, [filePath]);

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
        setIsEditorMounted(true);
    };

    useEffect(() => {
        if (isEditorMounted && filePath) {
            const editor = editorRef.current;
            const scheduleSave = (currentContent, changes) => {
                // Clear any existing timeout
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                
                // Update the last change timestamp
                lastChangeTimestamp.current = Date.now();
                
                setIsSaved(false);
                // Schedule a new save
                saveTimeoutRef.current = setTimeout(() => {
                    // Only save if 5 seconds have passed since the last change
                    if (Date.now() - lastChangeTimestamp.current >= 5000) {
                        const changeDetails = {
                            filePath,
                            content: currentContent,
                            timestamp: new Date().toISOString(),
                            changes: changes.map(change => ({
                                range: change.range,
                                text: change.text,
                                rangeLength: change.rangeLength
                            }))
                        };

                        emitFileUpdate(changeDetails);
                        setIsSaved(true);
                    }
                }, 5000);
            };

            // Set up the model change listener
            const disposable = editor.onDidChangeModelContent((event) => {
                const currentContent = editor.getValue();
                scheduleSave(currentContent, event.changes);
            });

            // Cleanup function
            return () => {
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                disposable.dispose();
            };
        }
    }, [isEditorMounted, filePath, emitFileUpdate]);

    const handleEditorChange = (value) => {
        setFileContent(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="w-[100%] h-[100%]">
            <Editor
                options={{
                    minimap: {
                        enabled: false,
                    },
                }}
                height="100%"
                theme="vs-dark"
                language={language}
                defaultValue={defaultValue}
                onMount={onMount}
                value={fileContent}
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditor;