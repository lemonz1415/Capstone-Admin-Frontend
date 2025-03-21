"use client";

import { lowerCase } from "lodash";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faUsers,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/auth.context";
import { useEffect, useState } from "react";
import { fetchMe } from "@/query/user.query";
import { isPermissioned } from "@/util/auth";
import { roles } from "@/util/role";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  //----------------
  // AUTH
  //----------------
  const [user, setUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [openUnauthorizeModal, setOpenUnauthorizeModal] = useState(false);

  useEffect(() => {
    console.log("fetch user");
    const fetchUserData = async () => {
      try {
        const response = await fetchMe();
        setUser(response);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

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
      <header className="flex items-center justify-between bg-white text-black text-xl font-medium py-4 px-6 fixed top-0 left-[16rem] right-0 shadow-md z-[5]">
        <div>Welcome to the Admin Panel</div>
        {/* Login Button */}
        <div
          className={`py-2 px-5 bg-blue-500 text-white rounded-lg text-lg font-medium cursor-pointer transition duration-300 hover:bg-blue-600 shadow-md ${
            pathname === "/login"
              ? "bg-blue-600 text-white shadow-lg" // Active State
              : ""
          }`}
          onClick={() => router.push("/login")}
        >
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
          Login
        </div>
      </header>
    </div>
  );
}
