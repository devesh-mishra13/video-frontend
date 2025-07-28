'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'next/navigation';

// Define the Chat interface
interface Chat {
  chat_name: string;
  chat_id: string; // or number, depending on the type of chat_id
}

interface MyJwtPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
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

const Home = () => {
  const params = useParams();
  // console.log(params)
const chat_id = params.uid as string;
// console.log("🚀 Initial chat_id from URL:", chat_id);

const [queryImage, setQueryImage] = useState<File | null>(null);
const [videoFiles, setVideoFiles] = useState<FileList | null>(null);
const [results, setResults] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [videosUploaded, setVideosUploaded] = useState(false);
const [uploadProgress, setUploadProgress] = useState<number>(0);
const [searchPerformed, setSearchPerformed] = useState(false);
const [existingChats, setExistingChats] = useState<Chat[]>([]);
const [userId, setUserId] = useState<string>('');

// ✅ Fetch user ID on mount
useEffect(() => {
  const storedUserStr = localStorage.getItem("user");
  if (storedUserStr) {
    try {
      const storedUser = JSON.parse(storedUserStr);
      console.log("✅ Found user ID in localStorage:", storedUser.id);
      setUserId(storedUser.id); // Use the actual ID
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage", err);
    }
  } else {
    console.warn("⚠️ No user ID found in localStorage.");
  }
}, []);


const handleNewChat = async () => {
  try {
    console.log("you are in handlenewchat")
    console.log("🔧 Creating a new chat for user:", userId); // Log added for clarity
      const res = await axios.post('http://localhost:8000/chat/create', {
        user_id: userId,
        chat_name: `Chat ${existingChats.length + 1}`,
        chat_id:chat_id
      });
      const newChat: Chat = {
        chat_name: `Chat ${existingChats.length + 1}`,
        chat_id: chat_id,
      };
      setExistingChats((prev) => [newChat, ...prev]);
      return res.data.chat_id;
  } catch (err) {
    console.error('❌ Error creating chat:', err);
  }
};


const handleVideoUpload = async () => {
  if (!videoFiles) {
    console.warn("⚠️ No video files selected for upload.");
    return;
  }

  console.log("📁 Starting video upload for files:", videoFiles);
  setLoading(true);
  setUploadProgress(0);

  const formData = new FormData();
  Array.from(videoFiles).forEach((file) => {
    console.log("🗂️ Appending file to FormData:", file.name);
    formData.append("videos", file);
  });

  try {
    console.log("📤 Uploading to:", "https://devesh-mishra13-similarvideo-from-image.hf.space/upload_videos/");
    await axios.post(
      "https://devesh-mishra13-similarvideo-from-image.hf.space/upload_videos/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
            console.log(`📊 Upload progress: ${percent}%`);
          }
        },
      }
    );

    console.log("00 Using chat ID to handlenewchat", chat_id);
    const currentChatId = await handleNewChat();
    console.log("🧠 Using chat ID to store embeddings:", currentChatId);

    await axios.post(`http://localhost:8000/chat/${currentChatId}/store_embeddings`, {
      chat_id: currentChatId,
    });

    setVideosUploaded(true);
    alert("✅ Videos uploaded and embeddings saved to chat!");
  } catch (error) {
    console.error("❌ Upload Error:", error);
    alert("❌ Failed to upload videos.");
  } finally {
    setLoading(false);
  }
};

const handleSearch = async () => {
  if (!queryImage) {
    console.warn("⚠️ No query image selected.");
    return;
  }

  console.log("🔍 Performing search with image:", queryImage.name);
  setLoading(true);
  setSearchPerformed(false);

  const formData = new FormData();
  formData.append("query_image", queryImage);

  try {
    const res = await axios.post(
      "https://devesh-mishra13-similarvideo-from-image.hf.space/search/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log("🔎 Search Results:", res.data.matches);
    setResults(res.data.matches);
    setSearchPerformed(true);
  } catch (error) {
    console.error("❌ Search Error:", error);
    alert("❌ Search failed. Make sure videos are uploaded first.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans relative flex">
      {/* SidePanel fixed on left */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#161b22] border-r border-gray-700 z-50">
        <SidePanel />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Go to Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="mx-auto w-fit absolute top-8 right-8 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-600 rounded-full text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 text-sm"
        >
          Go to Home
        </button>

        <h1 className="text-4xl font-bold mb-5 text-blue-500 text-center">🎥 Similar Video Search</h1>
        <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto">
          Find matching frames from videos based on your query image using CLIP & Faiss.
        </p>

        {!videosUploaded && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-300">Upload Video Files</label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => setVideoFiles(e.target.files)}
                className="bg-[#161b22] border border-gray-600 rounded p-4 w-full text-sm"
              />
            </div>

            <button
              onClick={handleVideoUpload}
              disabled={loading || !videoFiles}
              className={`px-8 py-3 rounded text-sm font-medium w-full ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#C49A28]'} transition-all`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                    />
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload Videos'
              )}
            </button>

            {loading && uploadProgress < 100 && (
              <div className="mt-4 bg-gray-600 h-2 w-full rounded-lg">
                <div
                  className="bg-[#D4AF37] h-2 rounded-lg"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {videosUploaded && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-300">Upload Query Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setQueryImage(e.target.files?.[0] || null)}
                className="bg-[#161b22] border border-gray-600 rounded p-4 w-full text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !queryImage}
              className={`px-8 py-3 rounded text-sm font-medium w-full ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#C49A28]'} transition-all`}
            >
              {loading ? 'Searching...' : 'Search Frames'}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-blue-500">
                🎯 Most Similar Video:
              </h2>
              <p className="text-sm text-gray-300 break-all mt-1">
                {results[0].filename}
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-[#D4AF37]">
              📸 Top Matching Frames
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-[#161b22] rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-[#D4AF37]/40 transition-all"
                >
                  <img
                    src={`data:image/jpeg;base64,${result.image_base64}`}
                    alt={result.filename}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-300 break-all">
                    <strong>Video: </strong>{result.filename}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
