'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (isSignup && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Sending data to the backend
    try {
      const response = await fetch(
            isSignup ? 'http://localhost:8000/signup' : 'http://localhost:8000/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            }
            );
      const data = await response.json();

      if (response.status != 200) {
        setError(data.error);
      } else {
        // Redirect using window.location
        window.location.href = '/'; // Redirect to dashboard after successful login/signup
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <main className="bg-black min-h-screen flex justify-center items-center text-white">
      <motion.div
        className="w-full max-w-md p-8 rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">
          {isSignup ? 'Create an Account' : 'Login'}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label htmlFor="name" className="text-lg text-gray-400">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 text-lg bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-lg text-gray-400">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 text-lg bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-lg text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 text-lg bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="text-lg text-gray-400">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 mt-2 text-lg bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <motion.button
            type="submit"
            className="w-full p-3 mt-6 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-600 rounded-full text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup((prev) => !prev)}
              className="text-blue-500 hover:text-blue-400 font-semibold"
            >
              {isSignup ? 'Login here' : 'Sign Up here'}
            </button>
          </span>
        </div>
      </motion.div>
    </main>
  );
};

export default AuthForm;
