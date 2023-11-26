import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="App">
      <div>
        <h2>Welcome, {localStorage.getItem('username')}</h2>
        <button onClick={() => {localStorage.removeItem('username'); window.location.reload();}}>Logout</button>
        <div className="Chat">
          {messages.map((msg, index) => (
            <div key={index} className={msg.user === localStorage.getItem('username') ? 'MyMessage' : 'OtherMessage'}>
              <strong>{msg.user}:</strong> {msg.msg}
            </div>
          ))}
        </div>
        <div className="InputContainer">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
