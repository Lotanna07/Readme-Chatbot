"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Chatbot = () => {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {};
    checkUser();
  }, []);
  return (
    <div>
      <h1>Chatbot</h1>
      <p>Drop project here</p>
    </div>
  );
};

export default Chatbot;
