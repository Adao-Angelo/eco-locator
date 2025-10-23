import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-emerald-100 via-white to-emerald-200 relative overflow-hidden text-center px-6">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-400/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/30 rounded-full blur-3xl"></div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 max-w-md w-full z-10">
        <h1 className="text-9xl font-extrabold text-emerald-600 drop-shadow-md">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          Oops! We couldn’t find the page you were looking for.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 rounded-full text-white font-medium w-full sm:w-auto
                     bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30
                     transition-all duration-300 transform hover:scale-105"
        >
          Return Home
        </Link>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-emerald-600/10 to-transparent animate-pulse"></div>
    </main>
  );
}
