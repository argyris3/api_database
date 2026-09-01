"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <nav
      className={`flex items-center justify-between w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${openMobileMenu ? "" : "backdrop-blur"}`}
    >
      <Link className="flex items-center gap-2 italic font-semibold" href="/">
        <Image
          className="h-9 md:h-9.5 w-auto shrink-0 "
          src="/logo.svg"
          alt="Logo"
          width={140}
          height={40}
          priority
          fetchPriority="high"
        />
        ta_data_mas
      </Link>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/60 dark:bg-black/40  backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="italic font-semibold">
          <a href="/login">Sign in</a>
        </button>
        <button
          className="aspect-square size-10 p-1 items-center justify-center bg-grey-800 hover:bg-grey-800 transition text-black rounded-md flex"
          onClick={() => setOpenMobileMenu(false)}
        >
          <XIcon />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden md:block hover:bg-slate-100 dark:hover:bg-slate-950 transition px-4 py-2 border border-slate-600 rounded-md italic font-semibold">
          <a href="/login">Sign in</a>
        </button>

        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="md:hidden"
        >
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </div>
    </nav>
  );
}
