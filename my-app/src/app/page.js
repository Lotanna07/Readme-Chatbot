import Link from "next/link";
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold">LOTI README CHATBOT</h1>
      <p className="text-gray-500 mt-4">Drop your project here</p>
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Upload
        </button>
      </div>
    </div>
  );
};

export default Home;
