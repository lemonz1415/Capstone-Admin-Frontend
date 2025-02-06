// components/Navbar.js
"use client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onNavigate?: (path: string) => void;  // Optional prop for handling navigation
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const router = useRouter();

  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-r from-blue-600 to-blue-400 text-white fixed top-0 left-0 h-full p-6 flex flex-col justify-between z-10">
  
        <div>
          {/* Logo */}
          <div
            className="text-2xl font-semibold mb-8 cursor-pointer"
            onClick={() => handleClick("/")}>
            Admin Dashboard
          </div>
          <nav>
            <ul>
              <li>
                <div
                  className="block py-3 px-4 text-lg font-medium cursor-pointer hover:bg-blue-500 transition duration-300"
                  onClick={() => handleClick("/")}>
                  Dashboard
                </div>
              </li>
              <li>
                <div
                  className="block py-3 px-4 text-lg font-medium cursor-pointer hover:bg-blue-500 transition duration-300"
                  onClick={() => handleClick("/questions")}>
                  Manage Question
                </div>
              </li>
              <li>
                <div
                  className="block py-3 px-4 text-lg font-medium cursor-pointer hover:bg-blue-500 transition duration-300"
                  onClick={() => handleClick("/users")}>
                  Manage User
                </div>
              </li>
              <li>
                <div
                  className="block py-3 px-4 text-lg font-medium cursor-pointer hover:bg-blue-500 transition duration-300"
                  onClick={() => handleClick("/settings")}>
                  Settings
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* Login Button */}
        <div className="flex justify-center mb-4">
          <div
            className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-xl font-semibold cursor-pointer hover:bg-blue-800 hover:shadow-lg transition duration-300"
            onClick={() => router.push("/login")}
          >
            Login
          </div>
        </div>
      </aside>
    </div>
  );
}
