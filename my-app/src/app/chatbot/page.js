"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Chatbot = () => {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);
  return (
    <div>
      <h1>Chatbot</h1>
      <p>Drop project here</p>
    </div>
  );
};

export default Chatbot;
