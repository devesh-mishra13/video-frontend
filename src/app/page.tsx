'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';


interface MyToken {
  email: string;
  exp: number;
  name?: string; // if you add it later
}

const FeatureSection = ({ title, description, imageSrc, imageOnLeft = true }: { title: string; description: string; imageSrc: string; imageOnLeft?: boolean }) => {
  return (
    <section className="w-full py-20 px-6 md:px-16 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className={`flex flex-col md:flex-row items-center justify-between gap-12 ${!imageOnLeft ? 'md:flex-row-reverse' : ''}`}>
        <motion.div
          className="w-full md:w-1/2 h-auto max-h-[400px] rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden bg-black"
          initial={{ opacity: 0, x: imageOnLeft ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={500}
            height={300}
            className="rounded-xl object-contain w-full h-full"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 text-left"
          initial={{ opacity: 0, x: imageOnLeft ? 100 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-blue-500 mb-4">{title}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
        </motion.div>
      </div>
    </section>
  );
};

const UseCaseSection = () => {
  return (
    <section className="w-full py-20 px-6 md:px-16 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-blue-500 mb-6">Real-World Use Cases</h2>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">
          Our AI-powered image-to-video search is more than just a cool tech demo. It solves real challenges across industries:
        </p>
        <div className="text-left text-gray-300 space-y-4 text-lg">
          <p>🎥 <strong>Media & Film:</strong> Instantly locate scenes across massive video archives for editing or analysis.</p>
          <p>🛡️ <strong>Surveillance:</strong> Detect matching frames from multiple CCTV videos using one key image.</p>
          <p>⚖️ <strong>Legal & Investigations:</strong> Rapidly pinpoint specific events for courtroom evidence with just an image.</p>
          <p>📚 <strong>Education & Research:</strong> Retrieve academic or historical video clips by visual similarity.</p>
        </div>
      </motion.div>
    </section>
  );
};

const InnovationSection = () => {
  return (
    <section className="w-full py-20 px-6 md:px-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-purple-500 mb-6">Behind the Innovation</h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
          This project is the result of extensive research and experimentation in computer vision and information retrieval.
          We combined cutting-edge tools like <strong>OpenAI’s CLIP</strong> and <strong>FAISS</strong> to build a robust backend
          capable of identifying image-to-video matches in milliseconds.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed">
          Whether you're a student, a researcher, or a tech enthusiast, this platform offers a hands-on look into the power of AI-powered search.
          From scalable architecture to model fine-tuning, it showcases what’s possible when vision meets innovation.
        </p>
      </motion.div>
    </section>
  );
};

const HeroSection = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
  const tokenString = localStorage.getItem('access_token');
  if (!tokenString) return;

  try {
    const tokenData = jwtDecode<MyToken>(tokenString);
    console.log(tokenData);

    if (Date.now() > tokenData.exp * 1000) {
      localStorage.removeItem('access_token');
      return;
    }

    setUsername(tokenData.email);
  } catch (err) {
    console.error('Invalid token', err);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <main className="bg-black">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0" />

        {/* Top Right: Login or Profile */}
        <div className="absolute top-6 right-6 z-10">
          {username ? (
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-800 rounded-full text-white font-semibold shadow hover:shadow-xl cursor-pointer"
              >
                👤 {username}
              </motion.div>
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" passHref>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-600 rounded-full text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <span className="text-lg">Login / Signup</span>
              </motion.div>
            </Link>
          )}
        </div>

        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-500 drop-shadow-md">
            Search Smarter with a Snap
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            Upload an image frame and let our AI instantly discover the most similar video scene across different video clips. It's smart. It's fast. It's powerful.
          </p>

          <Link href="/search" passHref>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mx-auto w-fit px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-600 rounded-full text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <span className="text-lg">🚀 Start Your Search</span>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      <FeatureSection
        title="How It Works"
        description="We break down each video into frames, extract their visual features, and compare them with the uploaded image using deep learning and vector similarity."
        imageSrc="/generated-image (2).png"
      />
      <FeatureSection
        title="Why It's Useful"
        description="Perfect for surveillance, media editing, and legal evidence — this tool finds exact or visually similar moments across a massive video dataset."
        imageSrc="/generated-image (3).png"
        imageOnLeft={false}
      />
      <FeatureSection
        title="Tech Behind It"
        description="Powered by advanced vision models like CLIP or ResNet, paired with vector databases like FAISS or Milvus for fast, scalable retrieval."
        imageSrc="/generated-image (4).png"
      />

      <UseCaseSection />
      <InnovationSection />
    </main>
  );
};

export default HeroSection;
