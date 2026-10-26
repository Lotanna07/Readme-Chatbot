"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      setSuccessMsg("");
    } else {
      setSuccessMsg("Account created! Check your email to confirm.");
      setErrorMsg("");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg font-semibold"
        >
          Create Account
        </button>

        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
