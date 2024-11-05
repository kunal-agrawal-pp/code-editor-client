import CodeEditor from '@/myComponents/CodeEditor';
import Terminal from '@/myComponents/Terminal';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Tree } from 'antd';
import { convertToAntdTree } from '@/utils/basic';

const { DirectoryTree } = Tree;

const Code = () => {
  const [isLivePreActive, setIsLivePreActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [treeData, setTreeData] = useState([]);

  const my_tree = {
    "Dockerfile.python": null,
    "requirements.txt": null,
    "server": {
      "index.js": null,
      "package-lock.json": null,
      "package.json": null
    },
    "user": {
      "main.py": null
    }
  };

  useEffect(() => {
    setTreeData(convertToAntdTree(my_tree));
  }, []);

  const onSelect = (keys, info) => {
    const selectedNode = info.node;
    if (selectedNode.isLeaf) {
      console.log(`${selectedNode.title} this file is selected`);
    } else {
      console.log(`${selectedNode.title} this folder selected`);
    }
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...treeData];

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 && 
      info.node.expanded && 
      dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
    
    // Convert tree data to object format and print
    const convertTreeToObject = (nodes) => {
      const result = {};
      
      nodes.forEach(node => {
        if (node.isLeaf) {
          // If it's a file
          result[node.title] = null;
        } else {
          // If it's a folder
          result[node.title] = convertTreeToObject(node.children || []);
        }
      });
      
      return result;
    };

    const treeObject = convertTreeToObject(data);
    console.log('Current Tree Structure:');
    console.log(JSON.stringify(treeObject, null, 2));
  };

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
      <div className='w-full h-[7%] bg-slate-950'>
        B lorem200
      </div>
      <div className='w-full h-[93%]'>
        {/* Left Sidebar */}
        <div className='w-[20%] h-full absolute top-[7%] left-0 bg-black'>
          <DirectoryTree
            multiple
            draggable
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            onDrop={onDrop}
            treeData={treeData}
          />
        </div>

        {/* Code Editor */}
        <div className='w-[50%] h-full absolute top-[7%] left-[20%] bg-white'>
          <CodeEditor language={"python"} defaultValue={""} />
        </div>

        {/* Live Preview and Terminal */}
        <div className='w-[30%] h-full absolute top-[7%] left-[70%] bg-green-400'>
          <div className={`w-full z-10 ${isLivePreActive ? 'h-[50%]' : 'h-[0%]'} bg-red-200`}>
            {/* Content for live preview goes here */}
          </div>
          <div className={`w-full ${isLivePreActive ? 'h-[50%]' : 'h-[100%]'} bg-purple-200`}>
            <Terminal isLivePreActive={isLivePreActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;