'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
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
    const { username, password, confirmPassword } = formData;

    if (isSignup && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(
        isSignup
          ? 'https://auth-api-java.onrender.com/api/auth/register'
          : 'https://auth-api-java.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      if (data.token) {
        localStorage.setItem('access_token', data.token);
        window.location.href = '/';
      } else {
        setError('Token not received.');
      }
    } catch (err) {
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
          <div>
            <label htmlFor="username" className="text-lg text-gray-400">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
