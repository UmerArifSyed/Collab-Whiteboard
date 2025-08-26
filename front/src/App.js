import React, { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect("http://localhost:3001");

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const mainContentRef = useRef(null);

  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [users, setUsers] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [toolboxPosition, setToolboxPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const paletteColors = ["#000000", "#ef4444", "#3b82f6", "#22c55e", "#f97316", "#ffffff"];

  useEffect(() => {
    if (isJoined && canvasRef.current) {
      const canvas = canvasRef.current;
      if (mainContentRef.current) {
        canvas.width = mainContentRef.current.offsetWidth - 48;
        canvas.height = mainContentRef.current.offsetHeight - 48;
      }
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      contextRef.current = context;

      socket.on('update-user-list', (userList) => setUsers(userList));
      socket.on('start-drawing', ({ offsetX, offsetY, color, lineWidth }) => {
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = lineWidth;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
      });
      socket.on('drawing', ({ offsetX, offsetY }) => {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      });
      socket.on('finish-drawing', () => contextRef.current.closePath());
      socket.on('clear-canvas', () => {
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      });

      return () => {
        socket.off('update-user-list');
        socket.off('start-drawing');
        socket.off('drawing');
        socket.off('finish-drawing');
        socket.off('clear-canvas');
      };
    }
  }, [isJoined]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const handleSidebarMouseDown = (e) => { e.preventDefault(); setIsResizing(true); };
  const handleToolboxMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - toolboxPosition.x, y: e.clientY - toolboxPosition.y };
  };
  const handleMouseUp = useCallback(() => { setIsResizing(false); setIsDragging(false); }, []);
  const handleMouseMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 500) setSidebarWidth(newWidth);
    }
    if (isDragging) {
      setToolboxPosition({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
    }
  }, [isResizing, isDragging]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit('start-drawing', { offsetX, offsetY, color, lineWidth });
  };
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    socket.emit('finish-drawing');
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit('drawing', { offsetX, offsetY });
  };

  const handleEraser = () => setColor("#ffffff");
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas');
  };

  const handleJoin = () => {
    if (username.trim() !== '') {
      socket.emit('join-server', username);
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="username-modal-overlay">
        <div className="username-modal">
          <h2>Welcome to the Whiteboard!</h2>
          <p>Please enter a username to join.</p>
          <input
            type="text"
            placeholder="Your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App dark">
      <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
        <h2>Collaborative Whiteboard</h2>
        <div className="user-list">
          <h3>Active Users ({users.length})</h3>
          <ul>
            {users.map(([id, name]) => (
              <li key={id}>
                <span className="username">{name}</span>
                {id === socket.id && <span className="you-tag">(You)</span>}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="resizer" onMouseDown={handleSidebarMouseDown}></div>
      <main className="main-content" ref={mainContentRef}>
        <div className="toolbox" style={{ top: `${toolboxPosition.y}px`, left: `${toolboxPosition.x}px` }}>
          <div className="toolbox-header" onMouseDown={handleToolboxMouseDown}>Tools</div>
          <div className="toolbox-content">
            <div className="tool-group">
              <label>Color</label>
              <div className="color-palette">
                {paletteColors.map(paletteColor => (
                  <div 
                    key={paletteColor}
                    className={`color-swatch ${color === paletteColor ? 'active' : ''}`}
                    style={{ backgroundColor: paletteColor }}
                    onClick={() => setColor(paletteColor)}
                  />
                ))}
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                />
              </div>
            </div>
            <div className="tool-group">
              <label>Brush: {lineWidth}</label>
              <input type="range" min="1" max="100" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
            </div>
            <button className="tool-button" onClick={handleEraser}>Eraser ✏️</button>
            <button className="tool-button" onClick={handleClearCanvas}>Clear 🗑️</button>
          </div>
        </div>
        <canvas ref={canvasRef} id="whiteboard-canvas" onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} />
      </main>
    </div>
  );
}

export default App;