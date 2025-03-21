"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  createUserQuery,
  editUserQuery,
  fetchMe,
  getUserDetailQuery,
} from "@/query/user.query";
import Modal from "./modal";
import { formatDate } from "@/util/util.function";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { every } from "lodash";
import { useAuth } from "@/contexts/auth.context";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { isPermissioned } from "@/util/auth";
import { roles } from "@/util/role";
import { Radio, RadioGroup } from "@heroui/react";
import { getAllRoleQuery } from "@/query/role.query";

interface insertDataType {
  firstname: string;
  lastname: string;
  email: string;
  role_id: string | null;
}

export default function UserForm() {
  //----------------
  // CONSTANT
  //----------------

  const router = useRouter();

  const params = useParams();

  const user_id = params?.userID;

  const [insertData, setInsertData] = useState<insertDataType>({
    firstname: "",
    lastname: "",
    email: "",
    role_id: null,
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
  });

  const [role, setRole] = useState([]);

  //----------------
  // AUTH
  //----------------
  const [user, setuser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [openUnauthorizeModal, setOpenUnauthorizeModal] = useState(false);

  useEffect(() => {
    console.log("fetch user");
    const fetchUserData = async () => {
      try {
        const response = await fetchMe();
        setuser(response);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setuser(null);
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const isAllowed = isPermissioned(user, [roles.ADMIN]) && !isFetching;

  useEffect(() => {
    if (isFetching) return;

    if (!isAllowed) {
      setOpenUnauthorizeModal(true);
    }
  }, [isPermissioned, isFetching, router]);

  const [isChange, setIsChange] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isNoUserModal, setIsNoUserModal] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  //----------------
  // FETCH DATA
  //----------------

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) {
      const fetchUserDetail = async () => {
        try {
          setLoading(true);
          const user = await getUserDetailQuery(String(user_id));
          if (user) {
            setInsertData({
              firstname: user.firstname || "",
              lastname: user.lastname || "",
              email: user.email || "",
              role_id: user.role_id || "",
            });
          }
        } catch (error) {
          setIsNoUserModal(true);
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetail();
    } else {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    const fetchRoleSelection = async () => {
      try {
        const role = await getAllRoleQuery();
        const fileredRole = role.filter((r: any) => r.role !== "TESTER");
        const formatRole = fileredRole.map((r: any) => {
          if (r.role === "ADMIN") {
            return { ...r, name: "Admin", desc: "Manage overall system." };
          }
          if (r.role === "QUESTION_CREATOR") {
            return {
              ...r,
              name: "Question Creator",
              desc: "Manage question system.",
            };
          }
          return r;
        });
        setRole(formatRole);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoleSelection();
  }, []);

  //----------------
  // FUNCTIONS
  //----------------

  const onSetFields = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    setIsChange(true);
    setInsertData((prev) => ({
      ...prev,
      [`${fieldName}`]: e.target.value?.trim(),
    }));
    validate();
  };

  const onSetDOB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;

    setIsChange(true);
    setInsertData((prev) => ({
      ...prev,
      dob: date,
    }));
  };

  const onSelectRole = (role_id: any) => {
    setIsChange(true);
    setInsertData((prev) => ({
      ...prev,
      role_id: role_id,
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      firstname: "",
      lastname: "",
      email: "",
      dob: "",
    };

    if (!insertData.firstname.trim()) {
      newErrors.firstname = "First name is required.";
      isValid = false;
    } else if (insertData.firstname.length > 30) {
      newErrors.firstname = "First name should not exceed 30 characters.";
      isValid = false;
    }

    if (!insertData.lastname.trim()) {
      newErrors.lastname = "Last name is required.";
      isValid = false;
    } else if (insertData.lastname.length > 30) {
      newErrors.lastname = "Last name should not exceed 30 characters.";
      isValid = false;
    }

    if (!insertData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (insertData.email.length > 50) {
      newErrors.email = "Email should not exceed 50 characters.";
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(insertData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    if (!insertData.role_id) {
      newErrors.dob = "Role is required.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (validate()) {
      setIsCreating(true);
      if (user_id && !isCreating) {
        const response = await editUserQuery(user_id, insertData);
        if (response?.success) {
          setIsCreating(false);
          toast.success(`Edit user complete`);
          router.push("/users");
        } else {
          toast.error(`Failed to edit user: ${response?.data?.error}`);
        }
      } else if (!isCreating) {
        const response = await createUserQuery(insertData);
        if (response?.success) {
          setIsCreating(false);
          toast.success(`Create user complete`);
          router.push("/users");
        } else {
          toast.error(`Failed to create user: ${response?.data?.error}`);
        }
      }
    }
  };

  const onBack = () => {
    if (isChange) {
      setIsOpenModal(true); // เปิด modal เมื่อมีการเปลี่ยนแปลงข้อมูล
    } else if (!isChange && user_id) {
      router.push(`/users/${user_id}`);
    } else {
      router.push(`/users`);
    }
  };
  //----------------
  // RENDER
  //----------------

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ml-[250px]">
        <p>Loading...</p>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <Toaster position="top-right" />
      <Modal
        isOpen={openUnauthorizeModal}
        onClose={() => router.push("/profile")}
        onConfirmFetch={() => router.push("/profile")}
        icon={faXmark}
        title="Unauthorized Access"
        message="You do not have permission to access this resource."
        confirmText="Confirm"
      />
      <Modal
        isOpen={isOpenModal}
        title={`Do you want to cancel ${
          user_id ? "editing" : "creating"
        } user?`}
        message="You have unsaved changes"
        onClose={() => setIsOpenModal(false)}
        onConfirmFetch={() =>
          user_id ? router.push(`/users/${user_id}`) : router.push(`/users`)
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <Modal
        isOpen={isNoUserModal}
        title={`No data found for user`}
        message="The user data could not be fetched. Please try again later."
        onClose={onBack}
        onConfirmFetch={() => router.push(`/users`)}
        confirmText="Confirm"
      />
      {isAllowed && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[1000px] ml-[250px]">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {`${user_id ? "Edit" : "Create"} user`}
          </h2>
          <form className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-600"
                >
                  First Name <span className="text-red-3">*</span>
                </label>
                <input
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onSetFields(e, "firstname")}
                  value={insertData.firstname}
                  placeholder="Enter first name"
                  maxLength={30}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm">{errors.firstname}</p>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-600"
                >
                  Last Name <span className="text-red-3">*</span>
                </label>
                <input
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onSetFields(e, "lastname")}
                  value={insertData.lastname}
                  placeholder="Enter last name"
                  maxLength={30}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email <span className="text-red-3">*</span>
              </label>
              <input
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSetFields(e, "email")}
                value={insertData.email}
                placeholder="Enter email address"
                maxLength={50}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="w-[400px]">
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-600"
              >
                Role <span className="text-red-3">*</span>
              </label>
              <div className="pt-[10px]">
                <RadioGroup
                  color="success"
                  onValueChange={onSelectRole}
                  value={String(insertData.role_id)}
                >
                  {role?.map((r: any) => (
                    <Radio
                      key={r.role_id}
                      value={String(r.role_id)}
                      description={r.desc}
                    >
                      {r.name}
                    </Radio>
                  ))}
                </RadioGroup>
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-[10px]">
              <div
                onClick={onBack}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </div>
              <div
                onClick={onSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative flex items-center justify-center"
              >
                {isCreating ? (
                  <>
                    {user_id ? "Editing" : "Creating"} &nbsp;
                    <FaSpinner className="animate-spin text-white mr-2" />
                  </>
                ) : user_id ? (
                  "Edit user"
                ) : (
                  "Create user"
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
