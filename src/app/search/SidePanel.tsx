'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface MyJwtPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
}

// Define the Chat interface
interface Chat {
  chat_name: string;
  chat_id: string; // or number, depending on the type of chat_id
}

const SidePanel = () => {
  // Type existingChats as an array of Chat objects
  const [existingChats, setExistingChats] = useState<Chat[]>([]); 
  const [userId, setUserId] = useState<string>('');

  // Decode token to get user ID
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token); 
        // console.log(decoded);
        setUserId(decoded.id);
        fetchChats(decoded.id);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  // Fetch chats for user
  const fetchChats = async (uid: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/user/${uid}/chats`);
      setExistingChats(res.data.chats);
    } catch (err) {
      console.error('Failed to fetch chats', err);
    }
  };

  // Create a new chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post('http://localhost:8000/chat/create', {
        user_id: userId,
        chat_name: `Chat ${existingChats.length + 1}`,
      });
      const newChat: Chat = {  // Type the new chat object
        chat_name: `Chat ${existingChats.length + 1}`,
        chat_id: res.data.chat_id,
      };
      setExistingChats((prev) => [newChat, ...prev]);
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  return (
    <div className="bg-[#161b22] w-64 min-h-screen p-4 border-r border-gray-700">
      <button
        className="w-full mb-6 py-2 bg-[#D4AF37] hover:bg-[#C49A28] text-black font-semibold rounded shadow transition-all"
        onClick={handleNewChat}
      >
        + New Chat
      </button>

      <div>
        <h2 className="text-gray-400 mb-2 text-sm">Existing Chats</h2>
        <ul className="space-y-2">
          {existingChats.map((chat) => (
            <li
              key={chat.chat_id}  // Use chat.chat_id as the key
              className="bg-[#0d1117] px-3 py-2 rounded hover:bg-[#1f2937] text-sm text-white cursor-pointer transition-all"
              onClick={() => console.log(`Selected: ${chat.chat_name}`)}
            >
              {chat.chat_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidePanel;
