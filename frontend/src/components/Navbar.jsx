import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrickWall, Menu } from "lucide-react";
import ThemeSelector from './ThemeSelector';

const API_BASE = import.meta.env.VITE_API_URL;

function Navbar() {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/auth/user`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUser(data);
          setIsAdmin(data.isAdmin);
        } else {
          setUser(null);
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

        {/* MOBILE */}
        <div className="lg:hidden flex items-center">
          <ThemeSelector />

          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">
            <Menu />
          </button>

          {isOpen && (
            <ul className="absolute top-16 right-4 menu menu-lg p-4 shadow bg-base-200 rounded-xl w-60 space-y-2 z-[9999]">
              <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/modals" onClick={() => setIsOpen(false)}>Modal</Link></li>
              <li><Link to="/aboutuspage" onClick={() => setIsOpen(false)}>About</Link></li>
              <li><Link to="/contactpage" onClick={() => setIsOpen(false)}>Contact</Link></li>

              {!isAdmin && <li><Link to="/savedpage" onClick={() => setIsOpen(false)}>Wishlist</Link></li>}

              {user ? (
                <li><a href={`${API_BASE}/auth/logout`}>Logout</a></li>
              ) : (
                <li><a href={`${API_BASE}/auth/google`}>Login</a></li>
              )}
            </ul>
          )}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
          <Link to="/">Home</Link>
          <Link to="/modals">Modal</Link>
          <Link to="/aboutuspage">About</Link>
          <Link to="/contactpage">Contact</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3 justify-end flex-1">
          <ThemeSelector />

          {!isAdmin && (
            <Link to="/savedpage" className="btn btn-ghost btn-circle">
              ❤️
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <img src={user?.photo} className="w-8 h-8 rounded-full" />
              <a href={`${API_BASE}/auth/logout`} className="btn btn-sm">Logout</a>
            </div>
          ) : (
            <a href={`${API_BASE}/auth/google`} className="btn btn-sm btn-primary">
              Login
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;
