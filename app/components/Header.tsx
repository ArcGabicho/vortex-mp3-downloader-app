"use client";

import { Github, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../utils/firebase";
import toast from "react-hot-toast";

export default function Header() {
  const handleLogout = async () => {
    const result = await logout();
    if (result.error) {
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada correctamente");
    }
  };

  return (
    <header className="flex justify-between items-center mb-12">
      <div className="flex items-center space-x-4">
        <Image
          src="/favicon.png"
          alt="Vortex MP3 Downloader"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold">Vortex MP3 Downloader</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="https://github.com/ArcGabicho/vortex-mp3-downloader-app"
          target="_blank"
          aria-label="Repositorio de GitHub"
          rel="noopener noreferrer"
          className="flex items-center border border-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-800 transition"
        >
          <Github />
        </Link>
        <button 
          onClick={handleLogout}
          className="cursor-pointer flex items-center space-x-2 border border-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-800 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
