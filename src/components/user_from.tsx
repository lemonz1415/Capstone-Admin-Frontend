"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatePicker } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "@/util/util.function";
import {
  createUserQuery,
  editUserQuery,
  getUserDetail,
} from "@/query/user.query";
import { parseDate } from "@internationalized/date";
import Modal from "./modal";

interface insertDataType {
  firstname: string;
  lastname: string;
  email: string;
  dob: string | null;
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
    dob: null,
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
  });

  const [isChange, setIsChange] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);

  //----------------
  // FETCH DATA
  //----------------

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) {
      const fetchUserDetail = async () => {
        try {
          const user = await getUserDetail(user_id);
          if (user) {
            setInsertData({
              firstname: user.firstname || "",
              lastname: user.lastname || "",
              email: user.email || "",
              dob: formatDate(new Date(user.DOB)) || null,
            });
          }
        } catch (error) {
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

  const onSetDOB = (date: any) => {
    const dob = new Date(date);
    const formattedDOB = formatDate(dob);

    setIsChange(true);
    setInsertData((prev) => ({
      ...prev,
      dob: formattedDOB,
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

    // Validate Firstname (Required and Max Length)
    if (!insertData.firstname.trim()) {
      newErrors.firstname = "First name is required.";
      isValid = false;
    } else if (insertData.firstname.length > 30) {
      newErrors.firstname = "First name should not exceed 30 characters.";
      isValid = false;
    }

    // Validate Lastname (Required and Max Length)
    if (!insertData.lastname.trim()) {
      newErrors.lastname = "Last name is required.";
      isValid = false;
    } else if (insertData.lastname.length > 30) {
      newErrors.lastname = "Last name should not exceed 30 characters.";
      isValid = false;
    }

    // Validate Email (Required and Max Length)
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

    // Validate Date of Birth (DOB should not be in the future)
    if (!insertData.dob) {
      newErrors.dob = "Date of birth is required.";
      isValid = false;
    } else {
      const dobDate = new Date(insertData.dob);
      if (dobDate > new Date()) {
        newErrors.dob = "Date of birth cannot be in the future.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      if (user_id) {
        const response = await editUserQuery(user_id, insertData);
        if (response?.success) {
          toast.success(`Edit user complete`);
          // router.push("")
        } else {
          toast.error(`Failed to edit user: ${response?.data?.error}`);
        }
      } else {
        const response = await createUserQuery(insertData);
        if (response?.success) {
          toast.success(`Create user complete`);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          // router.push("")
        } else {
          toast.error(`Failed to create user: ${response?.data?.error}`);
        }
      }
    }
  };

  const onBack = () => {
    if (isChange) {
      setIsOpenModal(true); // เปิด modal เมื่อมีการเปลี่ยนแปลงข้อมูล
    } else {
      console.log("back");
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
        isOpen={isOpenModal}
        title={`Do you want to cancel ${
          user_id ? "editing" : "creating"
        } user?`}
        message="You have unsaved changes"
        onClose={() => setIsOpenModal(false)}
        onConfirmFetch={() => console.log("back")}
        confirmText="Confirm"
        cancelText="Cancel"
      />
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

          {/* Birthdate */}
          <div className="w-[400px]">
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-600"
            >
              Date of Birth <span className="text-red-3">*</span>
            </label>
            <div className="pt-[10px]">
              <DatePicker
                showMonthAndYearPickers
                onChange={onSetDOB}
                value={user_id && parseDate(String(insertData.dob))}
                color="success"
                variant="bordered"
                size="lg"
              />
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
              className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {user_id ? "Edit User" : "Create User"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
