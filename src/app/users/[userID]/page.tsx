"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faArrowLeft,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Chip, Tooltip, Switch } from "@heroui/react";
import toast from "react-hot-toast";
import { convertDateToENWithoutTime } from "@/util/util.function";
import { getUserDetailQuery, disableEnableUserQuery } from "@/query/user.query";

interface User {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  DOB: string;
  // create_at: string;
  // update_at: string;
  is_verify: boolean;
  // role_id: "ADMIN" | "USER";
  is_active: boolean;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { userID } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userIDString = userID && typeof userID === "string" ? userID : null;

  // Fetch user detail เมื่อ component ถูก mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!userIDString) {
        toast.error("Invalid user ID");
        router.push("/users");
        return;
      }
      setIsLoading(true);
      try {
        const data = await getUserDetailQuery(userIDString);
        // console.log(data)
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user details");
        router.push("/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userID]);

  const handleDisableEnableUser = async () => {
    if (!userIDString) {
      toast.error("Invalid user ID");
      return;
    }
    try {
      await disableEnableUserQuery(userIDString); // เปลี่ยนสถานะ
      const updatedUser = await getUserDetailQuery(userIDString); // ดึงข้อมูลใหม่
      setUser(updatedUser); // อัปเดต State
      toast.success(
        updatedUser.is_active
          ? "User enabled successfully"
          : "User disabled successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    }
  };

  const handleEdit = () => {
    router.push(`/users/${userID}/edit`);
  };

  const handleEditPermissions = () => {
    router.push(`/users/${userID}/permission`);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading user details...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">User not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-10 ml-[250px]">
      {/* Back to User Management */}
      <button
        onClick={() => router.push("/users")}
        className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to all users
      </button>

      {/* User Header */}
      <div className="flex items-center gap-x-6 my-[30px] mx-4">
        <FontAwesomeIcon
          icon={faUserCircle}
          size="3x"
          className="text-white rounded-xl p-2"
          style={{
            backgroundColor:
              //     !user.is_active
              //       ? "#D3D3D3"
              //       : user.role_id === "ADMIN"
              //       ? "#4CAF50"
              //       : user.role_id === "USER"
              //       ? "#2196F3"
              //       : "#FFD700",
              // }}
              !user.is_active
                ? "#D3D3D3"
                : "#2196F3"
          }}
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{`${user.firstname} ${user.lastname}`}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        {/* Toggle Switch */}
        <Switch
          isSelected={user.is_active}
          onChange={handleDisableEnableUser}
          color="success"
          size="lg"
          className="ml-auto"
        >
          {user.is_active ? "Active" : "Inactive"}
        </Switch>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow-md px-8 py-6 mb-[30px]">
        <div className="flex justify-between items-center mb-[20px] mt-[-10px] border-b-1 border-grey-500">
          <h2 className="text-lg font-semibold text-gray-800">
            USER INFORMATION
          </h2>
          <Button variant="flat" color="primary" onPress={handleEdit}>
            Edit Info
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-x-12 gap-y-6">
          <div>
            <p className="text-sm font-medium text-gray-600">First Name:</p>
            <p>{user.firstname}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Last Name:</p>
            <p>{user.lastname}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Date of Birth:</p>
            <p>{user.DOB ? convertDateToENWithoutTime(user.DOB) : "N/A"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Email:</p>
            <p>{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Verification Status:
            </p>
            <Chip
              color={user.is_verify ? "primary" : "danger"}
              size="sm"
              className={
                user.is_verify
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
              }
            >
              {user.is_verify ? "Verified" : "Unverified"}
            </Chip>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Active Status:</p>
            <Chip
              color={user.is_active ? "success" : "danger"}
              size="sm"
              className={
                user.is_active
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }
            >
              {user.is_active ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="mr-1" />
                  Active
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Inactive
                </>
              )}
            </Chip>
          </div>

          {/* <div>
            <p className="text-sm font-medium text-gray-600">Created At:</p>
            <p>
            {user.create_at ? convertDateToEN(user.create_at) : "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Updated At:</p>
            <p>
            {user.update_at ? convertDateToEN(user.update_at) : "N/A"}
            </p>
          </div> */}
        </div>
      </div>

      {/* User Permission */}
      <div className="bg-white rounded-lg shadow-md px-8 py-6 mb-[30px]">
        <div className="flex justify-between items-center mb-[20px] mt-[-10px] border-b-1 border-grey-500">
          <h2 className="text-lg font-semibold text-gray-800">USER PERMISSION</h2>
          <Button variant="flat" color="primary" onPress={handleEditPermissions}>
            Edit Permission
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-x-12 gap-y-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Permission:</p>
          </div>
        </div>
      </div>
    </div>
  );
}
