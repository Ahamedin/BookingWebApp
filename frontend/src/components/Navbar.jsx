import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrickWall, Menu } from "lucide-react";
import ThemeSelector from './ThemeSelector';

function Navbar() {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;


useEffect(() => {
  fetch(`${BACKEND_URL}/auth/user`, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (data) {
        setUser(data);
        setIsAdmin(data.isAdmin);
      }
    })
    .catch(() => setUser(null));
}, []);



  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto px-4 relative">

        {/* LOGO */}
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <BrickWall className="size-9 text-primary" />
            <span className="font-semibold text-xl font-mono tracking-widest">
              BLOCKSTORE
            </span>
          </Link>
        </div>

        {/* MOBILE MENU */}
        <div className="lg:hidden flex items-center">
          <ThemeSelector />

          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-base-content focus:outline-none">
            <Menu />
          </button>

          {isOpen && (
            <ul className="absolute top-16 right-4 menu menu-lg p-4 shadow bg-base-200 rounded-xl w-60 space-y-2 z-[9999]">
              <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/modals" onClick={() => setIsOpen(false)}>Modal</Link></li>
              <li><Link to="/aboutuspage" onClick={() => setIsOpen(false)}>About</Link></li>
              <li><Link to="/contactpage" onClick={() => setIsOpen(false)}>Contact</Link></li>

              {!isAdmin && (
                <li><Link to="/savedpage" onClick={() => setIsOpen(false)}>Wishlist</Link></li>
              )}

              {user ? (
                <li><a href={`${BACKEND_URL}/auth/logout`}>Logout</a></li>
              ) : (
                <li><a href={`${BACKEND_URL}/auth/google`}>Login</a></li>
              )}
            </ul>
          )}
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
          <Link to="/" className="font-serif">Home</Link>
          <Link to="/modals" className="font-serif">Modal</Link>
          <Link to="/aboutuspage" className="font-serif">About</Link>
          <Link to="/contactpage" className="font-serif">Contact</Link>
        </div>

        {/* RIGHT SIDE (desktop) */}
        <div className="hidden lg:flex items-center gap-3 justify-end flex-1">
          <ThemeSelector />

          {!isAdmin && (
            <Link to="/savedpage" className="btn btn-ghost btn-circle">
              <svg
                className="size-6"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={3.5}
              >
                <line x1="8" y1="56" x2="24" y2="40" />
                <path d="m52 28 4-4-4-4-8-8-4-4-4 4a5.66 5.66 0 0 0 0 8l-8 8a11.31 11.31 0 0 0-16 0l23.94 24.12L36 52a11.36 11.36 0 0 0 0-16l8-8a5.66 5.66 0 0 0 8 0z" />
              </svg>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.photo} className="w-8 h-8 rounded-full" />
              <a href={`${BACKEND_URL}/auth/logout`} className="btn btn-sm">Logout</a>
            </div>
          ) : (
<a href={`${BACKEND_URL}/auth/google`} className="btn btn-sm btn-primary">Login</a>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;
