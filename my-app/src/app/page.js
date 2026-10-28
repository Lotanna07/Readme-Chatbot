import Link from "next/link";
import BlurText from "@/components/BlurText";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
      <span className="mb-6 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-gray-300">
        LOTI README CHATBOT
      </span>

      <BlurText
        text="Turn any project into a README"
        delay={120}
        animateBy="words"
        className="text-5xl md:text-7xl font-semibold tracking-tight justify-center"
      />

      <p className="mt-6 max-w-xl text-lg text-gray-400">
        Drop in a zip. Get a complete, GitHub-ready README with the tech stack,
        setup steps and environment variables.
      </p>

      <div className="mt-10 flex items-center gap-6">
        <Link
          href="/signup"
          className="rounded-full bg-white px-7 py-3 font-medium text-black transition hover:bg-gray-200"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="text-gray-300 transition hover:text-white"
        >
          Log in →
        </Link>
      </div>
    </div>
  );
};

export default Home;
