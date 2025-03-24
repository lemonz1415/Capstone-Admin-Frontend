"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import withAuth from "@/middleware/withAuth";
import { fetchMe } from "@/query/user.query";
import { getAllQuestionQuery } from "@/query/question.query";
import { getAllUsersQuery } from "@/query/user.query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPen,
  faUsers,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { convertDateToENWithoutTime } from "@/util/util.function";
interface User {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  DOB: string;
  role: string;
  is_verify: boolean;
  is_active: boolean;
}

function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLoggedIn) {
        try {
          setLoading(true);
          const data = await fetchMe();
          setUserInfo(data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserInfo();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        if (userInfo?.role === "ADMIN") {
          // สำหรับ Admin ดึงข้อมูลทั้งหมด
          const questionsData = await getAllQuestionQuery({
            page: 1,
            per_page: 9999,
          });
          const usersData = await getAllUsersQuery({ page: 1, per_page: 9999 });

          setStats({
            totalQuestions: questionsData?.totalItems || 0,
            totalUsers: usersData?.length || 0,
          });
        } else if (userInfo?.role === "QUESTION_CREATOR") {
          // สำหรับ Question Creator ดึงเฉพาะคำถามที่สร้างโดยตัวเอง
          const questionsData = await getAllQuestionQuery({
            // เพิ่มพารามิเตอร์เพื่อกรองเฉพาะคำถามที่สร้างโดยผู้ใช้คนนี้
            user_id: userInfo.user_id, // ใช้ created_by แทน user_id
            page: 1,
            per_page: 9999,
          });

          setStats({
            totalQuestions: questionsData?.totalItems || 0,
            totalUsers: 0, // ไม่แสดงจำนวนผู้ใช้สำหรับ Question Creator
          });
        }
      } catch (error) {
        console.error("Error fetching system statistics:", error);
      }
    };

    if (isLoggedIn && userInfo) {
      fetchSystemStats();
    }
  }, [isLoggedIn, userInfo]);

  if (loading)
    return (
      <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">Loading...</div>
    );

  if (!userInfo)
    return (
      <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">
        No user information found
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 pb-2 border-b border-gray-200">
          Profile
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - User Profile and System Statistics */}
          <div className="w-full md:w-1/3">
            {(userInfo.role === "ADMIN" ||
              userInfo.role === "QUESTION_CREATOR") && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-300">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col items-center mb-4 -mt-6">
                    <div className="w-28 h-28 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center shadow-lg mb-4">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-blue-600"
                        size="6x"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 text-center">
                        {userInfo.firstname} {userInfo.lastname}
                      </h2>
                      <p className="text-gray-500 text-center mb-2">
                        {userInfo.email}
                      </p>
                      <div className="flex gap-2 pt-2 justify-center">
                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded">
                          {userInfo.role}
                        </span>
                        {/* Active Status */}
                        {userInfo.is_active ? (
                          <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 text-sm font-medium px-2.5 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6 pb-2 mt-1 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800">
                    System Statistics
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg flex items-center">
                    <div className="bg-blue-600 w-12 h-12 rounded-full mr-4 shadow-md flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="text-white text-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        {userInfo.role === "QUESTION_CREATOR"
                          ? "Your Questions"
                          : "Total Questions"}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold text-blue-700">
                          {stats.totalQuestions}
                        </p>
                        <button
                          onClick={() => {
                            router.push("/questions");
                          }}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-all duration-200 shadow-sm"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* แสดงจำนวนผู้ใช้เฉพาะสำหรับ Admin */}
                  {userInfo.role === "ADMIN" && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg flex items-center">
                      <div className="bg-green-600 w-12 h-12 rounded-full mr-4 shadow-md flex justify-center items-center">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-white text-xl"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          Total Users
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-3xl font-bold text-green-700">
                            {stats.totalUsers}
                          </p>
                          <button
                            onClick={() => {
                              router.push("/users");
                            }}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-all duration-200 shadow-sm"
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - User Information */}
          <div className="w-full md:w-2/3">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 border border-gray-300">
              <div className="flex justify-between items-center mb-6 pb-2 -mt-2 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  Personal Information
                </h3>
                <button className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
                  <FontAwesomeIcon icon={faPen} className="text-sm" />
                  <span>Edit Info</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    First Name
                  </h4>
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 p-4 rounded-lg">
                    {userInfo.firstname}
                  </p>
                </div>

                {/* Last Name */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Last Name
                  </h4>
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 p-4 rounded-lg">
                    {userInfo.lastname}
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Email Address
                  </h4>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg pr-4">
                    <p className="text-gray-900 text-lg font-medium bg-gray-50 p-4 rounded-lg">
                      {userInfo.email}
                    </p>
                    {userInfo.is_verify ? (
                      <span className="bg-green-50 text-green-600 text-xs px-2 py-1 border border-green-500 rounded-3xl">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-600 text-xs px-2 py-1 border border-red-500 rounded-3xl">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Date of Birth
                  </h4>
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 p-4 rounded-lg">
                    {userInfo.DOB
                      ? convertDateToENWithoutTime(userInfo.DOB)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* System Access Section */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6 -mt-2 pb-2 border-b border-gray-200 ">
                System Access
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">Role</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {userInfo.role}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">Permissions</span>
                  <div>
                    {userInfo.role === "ADMIN" ? (
                      <span className="text-gray-600">Full system access</span>
                    ) : userInfo.role === "QUESTION_CREATOR" ? (
                      <span className="text-gray-600">
                        Create, view and edit own questions
                      </span>
                    ) : (
                      <span className="text-gray-600">Limited access</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Account Status
                  </span>
                  {userInfo.is_active ? (
                    <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-sm font-medium px-2.5 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
