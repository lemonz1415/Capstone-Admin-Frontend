"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-10 ml-[250px]">
      <div className="p-8 bg-gray-100">
        {/* Dashboard Header */}
        <header className="flex justify-between items-center bg-white shadow-md p-4 mb-8">
          <div className="text-2xl font-semibold text-gray-800">Dashboard</div>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Questions */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Total Questions
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-4">120</p>
          </div>

          {/* Total Users */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-4">800</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-4">5</p>
          </div>
        </div>

        {/* Manage Sections */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Manage Your Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Manage Questions */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition duration-300"
              onClick={() => router.push("/manage-question")}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Manage Questions
              </h3>
              <p className="text-gray-600 mt-4">
                Add, edit, and manage TOEIC® practice questions.
              </p>
            </div>

            {/* Manage Users */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition duration-300"
              onClick={() => router.push("/manage-user")}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Manage Users
              </h3>
              <p className="text-gray-600 mt-4">
                View and manage user accounts, roles, and permissions.
              </p>
            </div>

            {/* Settings */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition duration-300"
              onClick={() => router.push("/settings")}
            >
              <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
              <p className="text-gray-600 mt-4">
                Customize platform settings, notifications, and preferences.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
