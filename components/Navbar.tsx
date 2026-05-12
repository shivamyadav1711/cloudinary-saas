"use client"

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="w-full border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          href="/home"
          className="text-3xl font-extrabold glow-text"
        >
          AI SaaS
        </Link>

        <div className="flex items-center gap-4">

          <SignedOut>
            <SignInButton mode="modal">
              <button className="glow-btn px-6 py-2 rounded-xl font-semibold">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

        </div>

      </div>
    </div>
  );
}