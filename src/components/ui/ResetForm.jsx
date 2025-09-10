"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ResetForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  useEffect(() => {
    console.log("reset email: ", email);
  }, []);

  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({
    password: "",
  });

  useEffect(() => {
    if (user.password && email) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
e.preventDefault()
    try {
      const res = await axios.post("http://localhost:1000/auth/resetpassword", {
        email: email,
        password: user.password,
      });
      console.log('reset response: ', res)
      if (res?.status == 200 || res?.status == 201) {
        alert("reset success");
        router.push("/login");
      }
    } catch (error) {
      console.error("error in reset password", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please enter your new password below.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
              value={user.password}
              placeholder="Re-enter new password"
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

export default ResetForm;
