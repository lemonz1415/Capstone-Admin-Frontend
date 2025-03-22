"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getAllPermissionsQuery,
  grantPermissionsToUserQuery,
} from "@/query/permission.query";
import {
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faClipboardList,
  faUsers,
  faKey,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function ManagePermissionsPage() {
  const router = useRouter();
  const { userID } = useParams();
  const [permissions, setPermissions] = useState<
    { permission_id: number; permission: string }[]
  >([]); // เก็บค่า permission ทั้งหมดที่ได้มาจาก backend ซึ่งจะมีอยู่ 17 permission
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allPermissionIds, setAllPermissionIds] = useState<number[]>([]); // แต่ state นี้จะเก็บแค่ permission
  // ที่เกี่ยวข้องกับผู้ใช้ใน section ของ admin ทำให้มีแค่ 11 permission เท่านั้น

  const userIDString = userID && typeof userID === "string" ? userID : null;

  const groupedPermissions = [
    {
      category: "Profile Management",
      icon: faUserCircle,
      subHeaders: [
        { title: "View User Profile", permissions: ["READ_PROFILE_WEB_ADMIN"] },
      ],
    },
    {
      category: "Question Management",
      icon: faClipboardList,
      subHeaders: [
        {
          title: "View Question (All/Detail)",
          permissions: ["READ_QUESTION", "READ_SKILL"],
        },
        {
          title: "Create/Update Question",
          permissions: ["CREATE_QUESTION", "UPDATE_QUESTION"],
        },
      ],
    },
    {
      category: "User Management",
      icon: faUsers,
      subHeaders: [
        { title: "View User (All/Detail)", permissions: ["READ_USER"] },
        {
          title: "Create/Update User",
          permissions: ["CREATE_USER", "UPDATE_USER"],
        },
      ],
    },
    {
      category: "Permission Management",
      icon: faKey,
      subHeaders: [
        { title: "View Permission", permissions: ["READ_PERMISSION"] },
        {
          title: "Manage Permission",
          permissions: ["GRANT_PERMISSION", "REVOKE_PERMISSION"],
        },
      ],
    },
  ];

  // Fetch Permissions ทั้งหมดเมื่อ Component ถูก mount
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      try {
        const permissionsData = await getAllPermissionsQuery();
        setPermissions(permissionsData);

        const allIds = Array.from(
          new Set(
            groupedPermissions.flatMap((category) =>
              category.subHeaders.flatMap((subHeader) =>
                permissionsData
                  .filter((perm: any) =>
                    subHeader.permissions.includes(perm.permission)
                  )
                  .map((perm: any) => perm.permission_id)
              )
            )
          )
        );
        setAllPermissionIds(allIds);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to load permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // หา permission_id จาก permission name
  const getPermissionIdsByNames = (names: string[]) => {
    return permissions
      .filter((perm) => names.includes(perm.permission))
      .map((perm) => perm.permission_id);
  };

  // ตรวจสอบว่า Permission ถูก Disabled หรือไม่
  const isPermissionDisabled = (category: any, permissionName: any) => {
    // ค้นหา Sub Header ที่ title เป็น View ใน Category เดียวกัน
    const viewSubHeader = category.subHeaders.find((subHeader: any) =>
      subHeader.title.toLowerCase().includes("view")
    );

    if (!viewSubHeader) return false; // หากไม่มี View Sub Header, ไม่ต้อง Disabled

    // หาก Permission เป็น View (READ), ตรวจสอบว่า Create/Update/Manage ถูกเลือกอยู่หรือไม่
    if (permissionName.startsWith("READ")) {
      // ค้นหา Sub Header ที่เป็น Create/Update/Manage และไม่ได้มีแต่ READ permissions
      const createUpdateIds = category.subHeaders.flatMap((subHeader: any) => {
        // ตรวจสอบว่า title เป็น Create/Update/Manage
        const isModified = /^CREATE|UPDATE|MANAGE/.test(
          subHeader.title.toUpperCase()
        );

        // ตรวจสอบว่ามี permissions อื่นที่ไม่ใช่ READ
        const hasNonReadPermissions = subHeader.permissions.some(
          (perm: any) => !perm.startsWith("READ")
        );

        // เลือกเฉพาะ Sub Header ที่เป็น Create/Update/Manage และมี permissions อื่นที่ไม่ใช่ READ
        if (isModified && hasNonReadPermissions) {
          return getPermissionIdsByNames(subHeader.permissions);
        }
        return [];
      });

      return createUpdateIds.some((id: any) =>
        selectedPermissions.includes(id)
      );
    }

    return false; // อื่น ๆ ไม่ต้อง Disabled
  };

  // Toggle Sub Header
  const toggleSubHeader = (names: any, category: any) => {
    const ids = getPermissionIdsByNames(names);
    const allSelected = ids.every((id) => selectedPermissions.includes(id));

    let updatedPermissions;

    if (allSelected) {
      // Deselect all related permissions
      updatedPermissions = selectedPermissions.filter(
        (id) => !ids.includes(id)
      );
      setSelectedPermissions(updatedPermissions);
    } else {
      // Select all related permissions
      updatedPermissions = [...new Set([...selectedPermissions, ...ids])];
      setSelectedPermissions(updatedPermissions);

      // หากเลือก Create/Update ให้เลือก View ด้วย
      if (
        names.some(
          (name: any) =>
            name.startsWith("CREATE") ||
            name.startsWith("UPDATE") ||
            name.startsWith("GRANT") ||
            name.startsWith("REVOKE")
        )
      ) {
        const viewPermissionNames = category.subHeaders.find((subHeader: any) =>
          subHeader.title.toLowerCase().includes("view")
        )?.permissions;

        if (viewPermissionNames) {
          const viewPermissionIds =
            getPermissionIdsByNames(viewPermissionNames);
          updatedPermissions = [
            ...new Set([...updatedPermissions, ...viewPermissionIds]),
          ];
          setSelectedPermissions(updatedPermissions);
        }
      }
    }

    // อัปเดตสถานะ Select All
    updateSelectAllState(updatedPermissions);
  };

  const toggleCategory = (category: any) => {
    const ids = category.subHeaders.flatMap((subHeader: any) =>
      getPermissionIdsByNames(subHeader.permissions)
    );
    const allSelected = ids.every((id: any) =>
      selectedPermissions.includes(id)
    ); // ใช้ Array.includes()
    if (allSelected) {
      // Deselect all related permissions in category
      setSelectedPermissions((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      // Select all related permissions in category
      setSelectedPermissions((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  // Toggle Select All Permissions
  const toggleSelectAllPermissions = () => {
    if (isSelectAll) {
      // Deselect all permissions
      setSelectedPermissions([]);
    } else {
      // Select all permissions in groupedPermissions
      setSelectedPermissions(allPermissionIds);
    }

    setIsSelectAll(!isSelectAll); // Toggle State ของ Select All
  };

  // อัปเดตสถานะ Select All
  const updateSelectAllState = (currentSelectedPermissions: any) => {
    if (allPermissionIds.length > 0) {
      setIsSelectAll(
        allPermissionIds.every((id) => currentSelectedPermissions.includes(id))
      );
    } else {
      setIsSelectAll(false); // หากไม่มี Permission ใดใน groupedPermissions, ตั้งค่าเป็น false
    }
  };

  // ใช้ useEffect เพื่อตรวจสอบและอัปเดตสถานะ Select All
  useEffect(() => {
    updateSelectAllState(selectedPermissions);
  }, [selectedPermissions]);

  // บันทึกการเปลี่ยนแปลง Permissions
  const saveChanges = async () => {
    if (!userIDString) {
      toast.error("Invalid user ID");
      return;
    }
    try {
      await grantPermissionsToUserQuery(userIDString, selectedPermissions);
      toast.success("Permissions updated successfully!");
      router.push(`/users/${userID}`);
    } catch (error) {
      console.error("Error granting permissions:", error);
      toast.error("Failed to update permissions");
    }
  };

  const columns = [
    { key: "permission", label: "Permission Name" },
    { key: "status", label: "Status" },
  ];

  if (isLoading) {
    return <div className="text-center py-10">Loading permissions...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-10 ml-[250px]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Permissions
      </h1>

      {/* ตารางสิทธิ์ */}
      <Table aria-label="Manage User Permissions Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="font-semibold text-gray-600"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          <>
            <TableRow key="all-permissions">
              <TableCell className="bg-gray-200 font-bold text-gray-900 rounded-l-lg">
                <FontAwesomeIcon
                  icon={faCheckSquare}
                  className="mr-2 text-blue-500"
                  size="1x"
                />
                All Permissions
              </TableCell>
              <TableCell className="bg-gray-200 text-gray-900 rounded-r-lg">
                <Switch
                  isSelected={isSelectAll}
                  onChange={toggleSelectAllPermissions}
                  color="success"
                  size="md"
                />
              </TableCell>
            </TableRow>

            {groupedPermissions.map((group) => (
              <React.Fragment key={group.category}>
                {/* Sub Header */}
                <TableRow key={group.category}>
                  <TableCell className="bg-gray-100 font-semibold text-gray-600 rounded-l-lg">
                    <FontAwesomeIcon
                      icon={group.icon}
                      className="mr-2 text-blue-500"
                    />
                    {group.category}
                  </TableCell>
                  <TableCell className="bg-gray-100 font-semibold text-gray-600 rounded-r-lg">
                    <Switch
                      isSelected={group.subHeaders
                        .flatMap((subHeader) =>
                          getPermissionIdsByNames(subHeader.permissions)
                        )
                        .every((id) => selectedPermissions.includes(id))} // ใช้ Array.includes()
                      onChange={() => toggleCategory(group)}
                      color="success"
                    />
                  </TableCell>
                </TableRow>

                {/* Sub Headers */}
                {group.subHeaders.map((subHeader) => (
                  <React.Fragment key={subHeader.title}>
                    {/* Sub Header Row */}
                    <TableRow key={subHeader.title}>
                      <TableCell className="text-gray-500">
                        {subHeader.title}
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={getPermissionIdsByNames(
                            subHeader.permissions
                          ).every((id) => selectedPermissions.includes(id))}
                          onChange={() =>
                            toggleSubHeader(subHeader.permissions, group)
                          }
                          color="success"
                          isDisabled={subHeader.permissions.some(
                            (permission_name) =>
                              isPermissionDisabled(group, permission_name)
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </>
        </TableBody>
      </Table>

      {/* ปุ่มบันทึก */}
      <div className="flex flex-row justify-between mt-6">
        <button
          onClick={() => router.push(`/users/${userID}`)}
          className=" bg-gray-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-gray-600 transition-all"
        >
          Back
        </button>

        <button
          onClick={saveChanges}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
