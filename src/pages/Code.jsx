import CodeEditor from '@/myComponents/CodeEditor';
import Terminal from '@/myComponents/Terminal';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Tree } from 'antd';
import socket from '@/services/SocketClient';
import { setSocketWant } from '@/constants/app';
import { getCookieValue, getUUID } from '@/utils/token';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';

const { DirectoryTree } = Tree;

const Code = () => {
  const [isLivePreActive, setIsLivePreActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDockerPort, setUserDockerPort] = useState();
  const [treeData, setTreeData] = useState({});
  const [dockerSocket, setDockerSocket] = useState(null);
  const [currFileContent, setCurrFileContent] = useState("");
  const [selectFilePath, setSelectFilePath] = useState("");
  const [spaceDetails, setSpaceDetails] = useState({});
  const [isSaved, setIsSaved] = useState(true);
  
  const isInitialLoad = useRef(true);

  // Helper function to get nested object by path
  const getNestedObject = (obj, path) => {
    const parts = path.split('/').filter(part => part !== '');
    let current = obj;

    for (const part of parts) {
      if (current === null || typeof current !== 'object') return undefined;
      current = current[part];
    }

    return current;
  };

  // Helper function to set nested object by path
  const setNestedObject = (obj, path, value) => {
    const parts = path.split('/').filter(part => part !== '');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    if (parts.length > 0) {
      current[parts[parts.length - 1]] = value;
    } else {
      Object.assign(obj, value);
    }
    return obj;
  };

  // Function to convert tree data to Ant Design tree format
  const convertToAntdTreeWithPath = (data, parentPath = '') => {
    return Object.entries(data).map(([key, value]) => {
      // Skip any remaining .. entries that might come from the server
      if (key === '.' || key === '..') {
        return null;
      }
      
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      
      if (value === null) {
        return {
          title: key,
          key: currentPath,
          filePath: currentPath,
          isLeaf: true,
        };
      } else {
        return {
          title: key,
          key: currentPath,
          filePath: currentPath,
          children: convertToAntdTreeWithPath(value, currentPath).filter(Boolean),
        };
      }
    }).filter(Boolean); // Filter out null entries
  };

  // Space details initialization
  useEffect(() => {
    const space_uuid = getCookieValue("space_uuid");
    const space_url = getCookieValue("space_url");
    const space_title = getCookieValue("space_title");
    const space_lang = getCookieValue("space_lang");
    const space_desc = getCookieValue("space_desc");
    const space_icon = getCookieValue("space_icon");

    setSpaceDetails({
      space_uuid,
      space_url,
      space_title,
      space_lang,
      space_desc,
      space_icon,
    });
  }, []);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaved]);

  // Initialize Docker socket connection
  useEffect(() => {
    socket.emit("get-user-port", { user_uuid: getUUID() });
    socket.on("take-user-port", ({ port }) => {
      localStorage.setItem("userDockerPort", port);
      setUserDockerPort(port);
    });
  }, []);

  // Handle Docker socket connection and file system events
  useEffect(() => {
    if (!userDockerPort) return;

    setSocketWant(true);
    const DEFAULT_SERVER_URL = `http://localhost:${userDockerPort}`;
    const dockerSocket2 = io(DEFAULT_SERVER_URL);
    setDockerSocket(dockerSocket2);

    if (!dockerSocket2) return;

    // Initial file tree load
    if (isInitialLoad.current) {
      dockerSocket2.emit("get-files");
      isInitialLoad.current = false;
    }

    // Socket event handlers
    dockerSocket2.on("file-tree-ready", (data) => {
      setTreeData(prevTree => {
        if (Object.keys(prevTree).length === 0) {
          return data;
        }
        return prevTree;
      });
      setIsLoading(false);
    });

    dockerSocket2.on("folder-tree-ready", ({ fileTree, dir }) => {
      const pathToUpdate = dir.replace("../user/", "");
      setTreeData(prevTree => {
        const newTree = { ...prevTree };
        if (pathToUpdate === "/" || !pathToUpdate) {
          return fileTree;
        }
        setNestedObject(newTree, pathToUpdate, fileTree);
        return newTree;
      });
    });

    dockerSocket2.on("file-content-ready", (data) => {
      setCurrFileContent(data);
    });

    dockerSocket2.on("connect_error", (error) => {
      console.error("Docker socket connection error:", error);
      toast.error("Failed to connect to Docker.");
    });

    dockerSocket2.on("file:refresh", ({ event, path }) => {
      console.log("File system event received:", event, path);
      dockerSocket2.emit("get-files");
    });

    return () => {
      dockerSocket2.disconnect();
    };
  }, [userDockerPort]);

  // Tree selection handler
  const onSelect = (keys, info) => {
    const selectedNode = info.node;
    if (selectedNode.isLeaf) {
      dockerSocket.emit("get-file-content", selectedNode.filePath);
      setSelectFilePath(selectedNode.filePath);
    } else {
      const safePath = selectedNode.filePath.replace(/^\/+/, '');
      dockerSocket.emit("get-folder", safePath);
    }
  };

  const onExpand = (keys, info) => {
    // Handle tree expansion if needed
  };

  // Loading state handler
  useEffect(() => {
    let toastId;
    if (isLoading) {
      toastId = toast.loading('Processing...');
    } else {
      toast.dismiss(toastId);
    }
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading]);

  return (
    <div className='relative w-full h-full bg-transparent overflow-hidden'>
      <div className='w-full h-[7%] bg-slate-600'>
        <div className='h-[100%] w-[100%] flex items-center justify-between px-10'>
          <div></div>
          <div>
            <Button
              variant="outline"
              className='px-4 py-2 text-white hover:bg-white hover:scale-105 hover:text-black animate'
              onClick={() => setIsLivePreActive(!isLivePreActive)}
            >
              {isLivePreActive ? 'Hide' : 'Show'} Live Preview
            </Button>
          </div>
          <div>
            <h1 className='text-sm text-white'>{isSaved ? "File is saved" : "File is saving..."}</h1>
          </div>
        </div>
      </div>
      <div className='w-full h-[93%]'>
        <div className='w-[20%] h-full absolute top-[7%] left-0 bg-black'>
          <div className='items-center justify-center w-full h-[20px] ml-12 my-3'>
            <p className='text-white'>All files =&gt;</p>
          </div>
          {Object.keys(treeData).length !== 0 && (
            <DirectoryTree
              style={{ 'backgroundColor': 'black', 'color': 'white' }}
              multiple
              draggable
              defaultExpandAll
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={convertToAntdTreeWithPath(treeData)}
              defaultExpandParent={false}
            />
          )}
        </div>

        <div className='w-[50%] h-full absolute top-[7%] left-[20%] bg-white'>
          {((currFileContent || currFileContent === "" || currFileContent === "..." || currFileContent === " ") && selectFilePath) && (
            <CodeEditor 
              setIsSaved={setIsSaved} 
              filePath={selectFilePath} 
              language={"python"} 
              defaultValue={currFileContent} 
              currFileContent={currFileContent} 
            />
          )}
        </div>

        <div className='w-[30%] h-full absolute top-[7%] left-[70%] bg-green-400'>
          <div className={`w-full z-10 ${isLivePreActive ? 'h-[50%]' : 'h-[0%]'} bg-red-200`}>
          </div>
          <div className={`w-full ${isLivePreActive ? 'h-[50%]' : 'h-[100%]'} bg-purple-200`}>
            {dockerSocket && (
              <Terminal 
                isLivePreActive={isLivePreActive} 
                dockerSocket={dockerSocket} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;