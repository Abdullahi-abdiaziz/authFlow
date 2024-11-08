import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Command, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAvatar, setShowAvatar] = useState(false);
  const avatarRef = useRef(null); // Reference for the avatar button

  // Close the avatar dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && avatarRef.current.contains(event.target)) {
        return;
      }
      setShowAvatar(false);
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Command className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                AuthFlow
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2" ref={avatarRef}>
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                      onClick={() => setShowAvatar(!showAvatar)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                    </button>
                    {showAvatar && (
                      <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg py-5 px-3 bg-white ring-1 ring-black ring-opacity-5">
                        <h4 className="font-extrabold">Profile</h4>
                        <p className="font-medium my-2 px-2">{user?.name}</p>
                        <p className="font-medium my-2 px-2">{user?.email}</p>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2 mt-5 text-sm rounded-md bg-red-100 hover:bg-red-300"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
