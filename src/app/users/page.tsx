"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faKey,
  faUser,
  faUserCircle,
  faCheck,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "lodash";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Input,
  Pagination,
  Chip,
  User,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DateRangePicker,
  Select,
  SelectItem,
} from "@heroui/react";
import { convertDateToEN, convertRoleToReadable } from "@/util/util.function";
import { fetchMe, getAllUsersQuery } from "@/query/user.query";
import { parseDate } from "@internationalized/date";
import Modal from "@/components/modal";
import { useAuth } from "@/contexts/auth.context";
import { isPermissioned } from "@/util/auth";
import { roles } from "@/util/role";
import { getAllRoleQuery } from "@/query/role.query";

// กำหนด interface สำหรับข้อมูล User
interface User {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  update_at: string;
  is_verify: boolean;
  is_active: boolean;
  role_id: string;
  role: string;
}

interface DataFilterType {
  search_filter: string;
  is_active: string;
  is_verify: string;
  start_date: string;
  end_date: string;
  role_id: string | string[];
  page: number;
  per_page: number;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedRole, setSelectedRole] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFilter, setDataFilter] = useState<DataFilterType>({
    search_filter: "",
    is_active: "",
    is_verify: "",
    start_date: "",
    end_date: "",
    role_id: "",
    page: 1,
    per_page: 10,
  });

  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalItems: 0,
    per_page: dataFilter.per_page,
    page: dataFilter.page,
  });

  // Fetch users เมื่อ dataFilter เปลี่ยนแปลง
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // console.log("dataFilter",dataFilter)
        const response = await getAllUsersQuery(dataFilter);
        // console.log("API Response:", response);
        setUsers(response);
        setPaginationInfo({
          totalPages: response.totalItems === 0 ? 1 : response.totalPages,
          totalItems: response.totalItems || paginationInfo.totalItems,
          per_page: response.per_page || paginationInfo.per_page,
          page: response.page || paginationInfo.page,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [dataFilter]);

  //----------------
  // DATA FILTER
  //----------------
  const verificationStatuses = [
    { key: "true", label: "Verified" },
    { key: "false", label: "Unverified" },
  ];

  const activeStatuses = [
    { key: "true", label: "Enable" },
    { key: "false", label: "Disable" },
  ];

  const [filterRoles, setFilterRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getAllRoleQuery();
        const formatRole = roles.map((r: any) => ({
          key: r.role_id,
          label: convertRoleToReadable(r.role),
        }));
        setFilterRoles(formatRole);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleCreateUser = () => {
    router.push("/users/create");
  };

  // const onRoleChange = (role: "ALL" | "ADMIN" | "USER") => {
  //   setSelectedRole(role);
  //   setDataFilter((prev) => ({
  //     ...prev,
  //     role_id: role === "ALL" ? "" : role,
  //     page: 1,
  //   }));
  // };

  const onDateChange = (date: any) => {
    setDataFilter((prev) => ({
      ...prev,
      start_date: date.start
        ? new Date(date.start).toISOString().split("T")[0]
        : "",
      end_date: date.end ? new Date(date.end).toISOString().split("T")[0] : "",
      page: 1,
    }));
  };

  const onRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectRole = e.target.value ? e.target.value.split(",") : "";
    setDataFilter((prev) => ({
      ...prev,
      role_id: selectRole,
    }));
  };

  const onVerificationStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = e.target.value;
    setDataFilter((prev) => ({
      ...prev,
      is_verify: selectedStatus.length !== 0 ? selectedStatus : "",
      page: 1,
    }));
  };

  const onActiveStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setDataFilter((prev) => ({
      ...prev,
      is_active: selectedStatus.length !== 0 ? selectedStatus : "",
      page: 1,
    }));
  };

  const onPreview = (keys: any) => {
    const userID = new Set(keys);
    return router.push(`/users/${[...userID][0]}`);
  };

  const onDebounceSearch = debounce((value) => {
    setSearchTerm(value);
    setDataFilter((prev) => ({ ...prev, search_filter: value, page: 1 }));
  });

  const onChangePage = (newPage: number) => {
    setCurrentPage(newPage);
    setDataFilter((prev) => ({
      ...prev,
      page: newPage,
    }));
    // console.log(newPage)
  };

  const resetFilters = () => {
    setDataFilter({
      start_date: "",
      end_date: "",
      is_verify: "",
      is_active: "",
      role_id: "",
      page: 1,
      per_page: 10,
      search_filter: "",
    });
    setSearchTerm("");
  };

  const columns = [
    { key: "name", label: "NAME" },
    { key: "role", label: "ROLE" },
    { key: "is_verify", label: "VERIFIED" },
    { key: "status", label: "STATUS" },
    { key: "update_at", label: "UPDATE AT" },
    // { key: "actions", label: "ACTIONS" },
  ];

  // Map ข้อมูลเพื่อแสดงผลในตาราง
  const rows = users.map((user) => ({
    key: user.user_id,
    name: `${user.firstname} ${user.lastname}`,
    email: user.email,
    // role_id: user.role_id || "-",
    is_verify: user.is_verify ? "Yes" : "No",
    status: user.is_active,
    update_at: user.update_at ? convertDateToEN(user.update_at) : "N/A",
    role: convertRoleToReadable(user.role),
  }));

  const renderCell = (item: any, columnKey: any) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              icon: (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="2x"
                  className="text-white"
                />
              ),
              radius: "lg",
              // style: {
              //   backgroundColor: !item.status
              //     ? "#D3D3D3"
              //     : item.role_id === "ADMIN"
              //     ? "#4CAF50"
              //     : item.role_id === "USER"
              //     ? "#2196F3"
              //     : "#FFD700",
              // },
              style: {
                backgroundColor: !item.status ? "#D3D3D3" : "#2196F3",
              },
            }}
            description={item.email}
            name={item.name}
          />
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={item.status ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {item.status ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                Enable
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Disable
              </>
            )}
          </Chip>
        );
      //   case "actions":
      //     return (
      //       <div className="relative flex items-center gap-2">
      //         <Tooltip content="Edit user">
      //           <span
      //             className="text-lg text-default-400 cursor-pointer active:opacity-50"
      //             onClick={() => handleEditUser(item.user_id)}
      //           >
      //             <FontAwesomeIcon icon={faEdit} />
      //           </span>
      //         </Tooltip>
      //         <Tooltip color="danger" content="Delete user">
      //           <span
      //             className="text-lg text-danger cursor-pointer active:opacity-50"
      //             onClick={() => handleDeleteUser(item.user_id)}
      //           >
      //             <FontAwesomeIcon icon={faTrash} />
      //           </span>
      //         </Tooltip>
      //         <Tooltip content="Reset Password">
      //           <span
      //             className="text-lg text-warning cursor-pointer active:opacity-50"
      //             onClick={() => handleResetPassword(item.user_id)}
      //           >
      //             <FontAwesomeIcon icon={faKey} />
      //           </span>
      //         </Tooltip>
      //       </div>
      // );
      default:
        return getKeyValue(item, columnKey);
    }
  };

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

  const isAllowed = isPermissioned(user, [roles.ADMIN]) && !isFetching;

  useEffect(() => {
    if (isFetching) return;

    if (!isAllowed) {
      setOpenUnauthorizeModal(true);
    }
  }, [isPermissioned, isFetching, router]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">
      <Modal
        isOpen={openUnauthorizeModal}
        onClose={() => router.push("/profile")}
        onConfirmFetch={() => router.push("/profile")}
        icon={faXmark}
        title="Unauthorized Access"
        message="You do not have permission to access this resource."
        confirmText="Confirm"
      />
      {isAllowed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Toaster position="top-right" />

          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              User Management
            </h1>
          </div>

          {/* Sub Header - User Filter */}
          <div className="px-[10px] py-[10px] flex items-center justify-between border-b-2 border-gray-200 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Filter Users
            </h2>
            <Button
              color="success"
              variant="solid"
              onPress={handleCreateUser}
              className="text-white"
            >
              Create New +
            </Button>
          </div>

          {/* Filters Section*/}
          <div className="bg-white rounded-lg shadow-2xl p-[30px] flex flex-wrap items-center gap-4">
            <div className="flex">
              <div className="w-[250px] z-0">
                <Input
                  label="Search"
                  placeholder="Search for what you're looking for"
                  type="search"
                  variant="underlined"
                  value={searchTerm}
                  onValueChange={onDebounceSearch}
                />
              </div>
              <div className="ml-6">
                <DateRangePicker
                  className="max-w-xs"
                  label="Update date"
                  size="md"
                  variant="flat"
                  // value={{
                  //   start: dataFilter.start_date
                  //     ? parseDate(dataFilter.start_date)
                  //     : null,
                  //   end: dataFilter.end_date
                  //     ? parseDate(dataFilter.end_date)
                  //     : null,
                  // }}
                  onChange={(date) => onDateChange(date)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex">
              <div className="z-0">
                <Select
                  className="w-[200px]"
                  placeholder="Select a role"
                  label="Role"
                  size="sm"
                  selectionMode="multiple"
                  onChange={onRoleFilterChange}
                  selectedKeys={""}
                >
                  {filterRoles.map((role: any) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="z-0 ml-2">
                <Select
                  className="w-[150px]"
                  label="Verification Status"
                  placeholder="Select a status"
                  size="sm"
                  onChange={onVerificationStatusChange}
                >
                  {verificationStatuses.map((vs: any) => (
                    <SelectItem key={vs.key}>{vs.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="z-0 ml-2">
                <Select
                  className="w-[150px]"
                  label="Active Status"
                  placeholder="Select a status"
                  size="sm"
                  onChange={onActiveStatusChange}
                >
                  {activeStatuses.map((as: any) => (
                    <SelectItem key={as.key}>{as.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Verification status Filter */}
            {/* <div className="z-0">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    color="primary"
                    className="bg-blue-100 hover:bg-blue-50 text-blue-600"
                  >
                    Verification Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  selectedKeys={new Set([dataFilter.is_verify])} // ใช้ Set เพื่อรองรับ HeroUI
                  closeOnSelect={true}
                  selectionMode="single"
                  onSelectionChange={(keys) => onVerificationStatusChange(keys)}
                >
                  <DropdownItem key="true">Verified</DropdownItem>
                  <DropdownItem key="false">Unverified</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div> */}

            {/* Active status Filter */}
            {/* <div className="z-0">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" color="success">
                    Active Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  selectedKeys={new Set([dataFilter.is_active])} // ใช้ Set เพื่อรองรับ HeroUI
                  closeOnSelect={true}
                  selectionMode="single"
                  onSelectionChange={(keys) => onActiveStatusChange(keys)}
                >
                  <DropdownItem key="true">Active</DropdownItem>
                  <DropdownItem key="false">Inactive</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div> */}

            {/* Reset Filters */}
            {/* <div className="ml-auto">
              <Button color="warning" variant="flat" onPress={resetFilters}>
                Reset
              </Button>
            </div> */}
          </div>

          <div className="flex flex-col mt-[30px]">
            {/* Tabs และ Table ในคอนเทนเนอร์เดียวกัน */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* <div className="flex border-b border-gray-200">
              <button
                onClick={() => onRoleChange("ALL")}
                className={`px-6 py-3 font-medium ${
                  selectedRole === "ALL"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => onRoleChange("ADMIN")}
                className={`px-6 py-3 font-medium ${
                  selectedRole === "ADMIN"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" /> Admin
              </button>
              <button
                onClick={() => onRoleChange("USER")}
                className={`px-6 py-3 font-medium ${
                  selectedRole === "USER"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" /> Member
              </button>
            </div> */}

              <div>
                <Table
                  aria-label="Example table with dynamic content"
                  isStriped
                  selectionBehavior="replace"
                  selectionMode="single"
                  color="success"
                  onSelectionChange={onPreview}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  {rows.length === 0 ? (
                    <TableBody emptyContent={"No users found."}>{[]}</TableBody>
                  ) : (
                    <TableBody items={rows}>
                      {(item) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>

            {paginationInfo.totalPages > 1 && rows.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  initialPage={1}
                  page={paginationInfo.page}
                  total={paginationInfo.totalPages}
                  onChange={onChangePage}
                  variant="faded"
                  color="default"
                  size="lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
