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
    <div className="min-h-screen flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="text-sm text-gray-400 transition hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-gray-400">
          Start turning projects into READMEs.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-white/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-white/40"
          />
          <button
            onClick={handleSignUp}
            className="mt-2 w-full rounded-full bg-white py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Create account
          </button>
        </div>

        {errorMsg && <p className="mt-4 text-sm text-red-400">{errorMsg}</p>}
        {successMsg && (
          <p className="mt-4 text-sm text-emerald-400">{successMsg}</p>
        )}

        <p className="mt-8 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
