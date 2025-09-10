"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ForgotForm = () => {
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();




  const [user, setUser] = useState({
    email: "",
  });
  {
    useEffect(() => {
      if (user.email) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, [user]);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await axios.post("http://localhost:1000/auth/forgot", {
        email: user.email,
      });
      // console.log("forgot res: ", res);

      if (res?.status == 200 || res?.status == 201) {
        router.push(`/verify?email=${encodeURIComponent(user.email)}&type=forgot`);
      }
    } catch (error) {
      console.error("error in forgot password", error);
    }
  };

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
        <form className="space-y-5" onSubmit={handleSubmit}>
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
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={disabled}
            className=" w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Reset Password
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
