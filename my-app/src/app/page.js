import Link from "next/link";
import BlurText from "@/components/BlurText";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <BlurText
        text="LOTI README CHATBOT"
        delay={150}
        animateBy="words"
        className="text-5xl font-bold"
      />
      <p className="text-gray-400 mt-4">Drop your project here</p>
      <div className="flex gap-4 mt-6">
        <Link
          href="/signup"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
