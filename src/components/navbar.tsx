"use client";

import { lowerCase } from "lodash";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faUsers,
  faSignInAlt,
  faCircleUser,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/auth.context";
import { useEffect, useState, useRef } from "react";
import { fetchMe } from "@/query/user.query";
import { isPermissioned } from "@/util/auth";
import { roles } from "@/util/role";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  //----------------
  // AUTH
  //----------------
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openUnauthorizeModal, setOpenUnauthorizeModal] = useState(false);

  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetchMe();
          setUser(response);
          setIsFetching(false);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
          setIsFetching(false);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const isCanManageQuestion =
    isPermissioned(user, [roles.ADMIN, roles.QUESTION_CREATOR]) && !isFetching;
  const isCanManageUser = isPermissioned(user, [roles.ADMIN]) && !isFetching;

  const MENU = [
    {
      topic: "Manage Question",
      path: "/questions",
      icon: faClipboardList,
      isShow: isCanManageQuestion,
    },
    {
      topic: "Manage User",
      path: "/users",
      icon: faUsers,
      isShow: isCanManageUser,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 50);
  };

  const isActive = (menuPath: string) => pathname.startsWith(menuPath);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E3A8A] text-white fixed top-0 left-0 h-full flex flex-col shadow-lg">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xl font-bold py-6 px-6 shadow-md ">
          Management System
        </div>

        {/* Main Navigation */}
        <nav className="p-4 pt-8">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase">
            Main Menu
          </h3>
          <ul>
            {MENU?.filter((item) => item.isShow === true)?.map((m) => (
              <li key={`menu_${lowerCase(m?.topic)}`}>
                <div
                  className={`flex items-center w-full py-3 px-4 text-lg font-medium rounded-lg cursor-pointer transition duration-300 ${
                    isActive(m.path)
                      ? "bg-blue-500 text-white shadow-md" // Active State
                      : "hover:bg-[#374151] hover:text-white"
                  }`}
                  onClick={() => router.push(m?.path)}
                >
                  <FontAwesomeIcon icon={m.icon} className="mr-3" />
                  {m?.topic}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Header */}
      <header className="flex items-center justify-between bg-white text-black text-xl font-medium py-[12px] px-6 fixed top-0 left-[16rem] right-0 shadow-md z-[5]">
        <div>Welcome to the Admin Panel</div>
        {/* Login Button */}
        {isLoggedIn ? (
          <div className="relative group">
            <button
              className="flex items-center space-x-2 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all px-3 py-2 rounded-full border-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center pl-1">
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-white text-lg mr-1"
                />
              </div>
              <span className="font-medium text-sm">
                {user ? `${user.firstname} ${user.lastname}` : ""}
              </span>
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-[280px] bg-white text-gray-800 rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-medium text-blue-700">
                    {user?.email}
                  </p>
                </div>
                <ul>
                  <li
                    onClick={() => router.push("/profile")}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-3 text-gray-700 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    <span className="text-blue-500">Profile</span>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-red-50 cursor-pointer flex items-center space-x-3 text-gray-700 transition-colors duration-200 border-t border-gray-100"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="text-red-500"
                    />
                    <span className="text-red-500">Sign Out</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div
            className="py-2 px-5 bg-blue-500 text-white rounded-lg text-lg font-medium cursor-pointer transition duration-300 hover:bg-blue-600 shadow-md"
            onClick={() => router.push("/login")}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </div>
        )}
      </header>
    </div>
  );
}
