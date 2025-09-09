"use client";

import React from "react";

const ForgotForm = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotForm;
