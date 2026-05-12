"use client";

import Link from "next/link";
import { Home, Share2, Upload } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="h-full flex flex-col p-4">

      {/* Logo */}
      <div className="text-2xl font-bold mb-10 text-white">
        Cloudinary Showcase
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        <Link
          href="/home"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
        >
          <Home size={20} />
          <span>Home Page</span>
        </Link>

        <Link
          href="/social-share"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          <Share2 size={20} />
          <span>Social Share</span>
        </Link>

        <Link
          href="/video-upload"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          <Upload size={20} />
          <span>Video Upload</span>
        </Link>

      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <SignOutButton>
          <button
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              text-white
              py-3
              rounded-xl
              font-semibold
              transition-all
              duration-300
            "
          >
            Logout
          </button>
        </SignOutButton>
      </div>

    </div>
  );
}