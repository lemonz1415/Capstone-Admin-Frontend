// components/Navbar.js
"use client";
import { lowerCase } from "lodash";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const MENU = [
    // { topic: "Dashboard", path: "/", disable: true },
    { topic: "Manage Question", path: "/questions", disable: false },
    // { topic: "Manage User", path: "/user", disable: true },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-r from-blue-600 to-blue-400 text-white fixed top-0 left-0 h-full p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-xl font-semibold mb-8">Management System</div>
          <nav>
            <ul>
              {MENU?.map((m) => (
                <li key={`menu_${lowerCase(m?.topic)}`}>
                  <div
                    className="block py-3 px-4 text-lg font-medium cursor-pointer hover:bg-blue-500 transition duration-300"
                    onClick={() => router.push(m?.path)}
                  >
                    {m?.topic}
                  </div>
                </li>
              ))}
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
