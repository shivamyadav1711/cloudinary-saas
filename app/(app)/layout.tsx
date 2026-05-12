"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser, SignInButton } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  Sparkles,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open bg-gradient-to-br from-base-100 via-base-200 to-base-300 min-h-screen">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/70 border-b border-base-300 shadow-lg">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* MOBILE MENU */}
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost"
              >
                <MenuIcon />
              </label>
            </div>

            {/* LOGO */}
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="flex items-center gap-3 cursor-pointer group">

                  <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Cloudinary Showcase
                    </h1>

                    <p className="text-xs opacity-60 font-medium">
                      AI Powered SaaS
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-none flex items-center gap-4">

              {/* SHOW SIGN IN BUTTON ONLY WHEN LOGGED OUT */}
              {!user && (
                <SignInButton mode="modal">
                  <button className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/40 hover:scale-105 transition-all duration-300">
                    Sign In
                  </button>
                </SignInButton>
              )}

              {/* SHOW USER DETAILS ONLY WHEN LOGGED IN */}
              {user && (
                <>
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="font-semibold text-sm">
                      {user.username || "User"}
                    </span>

                    <span className="text-xs opacity-60">
                      {user.emailAddresses[0].emailAddress}
                    </span>
                  </div>

                  <div className="avatar online">
                    <div className="w-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg shadow-primary/40">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username ||
                          user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="btn btn-error btn-circle shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <LogOutIcon className="h-5 w-5 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-base-100/70 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-base-300">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-base-100 border-r border-base-300 shadow-2xl">

          {/* SIDEBAR TOP */}
          <div className="p-6 border-b border-base-300">

            <div className="flex items-center gap-4">

              <div className="bg-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/40">
                <ImageIcon className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Dashboard
                </h2>

                <p className="text-sm opacity-60">
                  Manage your media
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR MENU */}
          <ul className="menu p-5 gap-3 w-full text-base-content">

            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-300
                  
                  ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                      : "hover:bg-base-200 hover:translate-x-1"
                  }
                  `}
                >
                  <item.icon className="w-5 h-5" />

                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* SIGN OUT BUTTON */}
          {user && (
            <div className="p-5 mt-auto">
              <button
                onClick={handleSignOut}
                className="btn btn-error w-full rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <LogOutIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}