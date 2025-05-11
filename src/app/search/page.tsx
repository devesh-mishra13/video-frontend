'use client';

import React, { useState } from 'react';
import axios from 'axios';
import SidePanel from './SidePanel'; // Adjust the path as needed

export default function Home() {
  const [queryImage, setQueryImage] = useState<File | null>(null);
  const [videoFiles, setVideoFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [videosUploaded, setVideosUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleVideoUpload = async () => {
    if (!videoFiles) return;
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(videoFiles).forEach((file) => formData.append('videos', file));

    try {
      await axios.post(
        'https://devesh-mishra13-similarvideo-from-image.hf.space/upload_videos/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        }
      );
      setVideosUploaded(true);
      alert('Videos uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload videos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!queryImage) return;
    setLoading(true);
    setSearchPerformed(false);

    const formData = new FormData();
    formData.append('query_image', queryImage);

    try {
      const res = await axios.post(
        'https://devesh-mishra13-similarvideo-from-image.hf.space/search/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setResults(res.data.matches);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Search Error:', error);
      alert('Search failed. Make sure videos are uploaded first.');
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
                    <strong>Score:</strong> {result.score.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500 break-all">{result.filename}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && searchPerformed && (
          <div className="text-red-400 text-md mt-4 text-center">
            ❌ No matching frames found for the uploaded image.
          </div>
        )}
      </div>
    </div>
  );
}
