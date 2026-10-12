import Link from "next/link";
const Home = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">LOTI README CHATBOT</h1>
      <p className="text-gray-500 mb-4">Drop your project here</p>
      <Link href="/signup" className="mx-2">
        Sign Up
      </Link>
      <Link href="/login" className="mx-2">
        Login
      </Link>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Upload
      </button>
    </div>
  );
};

export default Home;
