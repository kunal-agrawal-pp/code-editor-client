import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
// import dockerSocket from "@/services/DockerSocket";

const Terminal = ({ isLivePreActive, dockerSocket }) => {
  const terminalRef = useRef();
  const terminalInstance = useRef(null);
  const isRendered = useRef(false);
  const currentLine = useRef("");

  // const [refresh, setRefresh] = useState(false);
  const [refreshDockerSocket, setRefreshDockerSocket] = useState(dockerSocket);

  useEffect(() => {
    console.log(dockerSocket)
    setRefreshDockerSocket(dockerSocket);
  }, [dockerSocket]);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const container = terminalRef.current;
    if (!container) return;

    setTimeout(() => {
      try {
        const term = new XTerminal({
          rows: isLivePreActive ? 10 : 30,
          cols: 80,
          cursorBlink: true,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          fontSize: 14,
          lineHeight: 1,
          focus: false,
          theme: {
            background: '#1a1b26',
            foreground: '#a9b1d6',
            cursor: '#f7768e',
            cursorAccent: '#1a1b26',
            selection: '#28292f',
            // other colors...
          },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(container);

        setTimeout(() => {
          try {
            fitAddon.fit();
            term.focus();
            // Write a welcome message
            term.write('\x1b[1;32m# Welcome to Terminal\x1b[0m\r\n');
            term.write('\x1b[1;32m# Type commands below\x1b[0m\r\n\r\n');
            term.write('\x1b[1;36m$\x1b[0m ');
          } catch (e) {
            console.error('Error fitting terminal:', e);
          }
        }, 0);

        terminalInstance.current = term;

        refreshDockerSocket.on("terminal:output", (data) => {
          console.log("Received from socket:", data);
          if (terminalInstance.current) {
            terminalInstance.current.write(data);
          }
        });

        refreshDockerSocket.on("file:refresh", ({ event, path }) => {
          if (path) {
            console.log("Refreshing path:", path.split('/').slice(0, -1).join('/'));
            // ../user/new/fol/gg
            const dirPath = path.replace("../user/", "").split('/').slice(0, -1).join('/');
            console.log("=======Refreshing path:", dirPath);
            // refreshDockerSocket.emit("get-folder", dirPath);
          }
        });

        term.onData((data) => {
          console.log(refreshDockerSocket)
          // userTerminalType(data)
          console.log("Sending to socket:", data);
          refreshDockerSocket.emit("terminal:write", { data });

          const code = data.charCodeAt(0);

          if (code === 13) { // Enter
            term.write('\r\n');
            if (currentLine.current.trim().length > 0) {
              term.write(`\x1b[1;33m${currentLine.current}\x1b[0m\r\n`);
            }
            term.write('\x1b[1;36m$\x1b[0m ');
            currentLine.current = '';
          } else if (code === 127) { // Backspace
            if (currentLine.current.length > 0) {
              currentLine.current = currentLine.current.slice(0, -1);
              term.write('\b \b');
            }
          } else { // Regular characters
            currentLine.current += data;
            // term.write(data);
          }
        });

        const handleResize = () => {
          try {
            fitAddon.fit();
          } catch (e) {
            console.error('Error during resize:', e);
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (terminalInstance.current) {
            terminalInstance.current.dispose();
          }
        };
      } catch (e) {
        console.error('Error initializing terminal:', e);
      }
    }, 100);
  }, []);

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto">
      {/* Terminal Header */}
      <div className="bg-gray-800 rounded-t-lg flex items-center p-2 gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-gray-400 text-sm font-mono">terminal</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="w-full h-full mb-[100px] bg-[#1a1b26] rounded-b-lg shadow-2xl border border-gray-800">
        <div
          ref={terminalRef}
          className="h-full w-full overflow-auto p-4 font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default Terminal;
