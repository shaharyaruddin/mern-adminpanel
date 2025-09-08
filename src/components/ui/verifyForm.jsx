    "use client";

    import axios from "axios";
    import { useRouter } from "next/navigation";
    import React, { useEffect, useState } from "react";

    const VerifyForm = () => {
        const router = useRouter()
    const [disabled, setDisabled] = useState(true);
    const [user, setUser] = useState({
        verificationCode: "",
    });

    useEffect(() => {
        if (user.verificationCode) {
        setDisabled(false);
        } else {
        setDisabled(true);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        try {
          e.preventDefault();

        const res = await axios.post(`http://localhost:1000/auth/verify`, {
            verificationCode: user.verificationCode,
        });
        console.log("verify response: ", res);
        alert("verified");

        router.push("/login");
        } catch (error) {
        console.error("error in verification form ", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Verify Your Account
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
            We’ve sent a verification verificationCode to your email. Please enter the verificationCode
            below to verify your account.
            </p>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Verification verificationCode */}
            <div>
                <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Verification verificationCode
                </label>
                <input
                type="text"
                id="verificationCode"
                value={user.verificationCode}
                onChange={(e) => setUser({...user, verificationCode: e.target.value })}
                placeholder="Enter your 6-digit verificationCode"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            {/* Verify Button */}
            <button
                type="submit"
                disabled={disabled}
                className=" w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
                Verify account
            </button>
            </form>

            {/* Extra */}
            <p className="text-sm text-gray-600 text-center mt-6">
            Didn’t receive the verificationCode?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
                Resend verificationCode
            </a>
            </p>
        </div>
        </div>
    );
    };

    export default VerifyForm;
