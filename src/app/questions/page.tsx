"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DateRangePicker,
  Input,
} from "@heroui/react";

import { Pagination } from "@heroui/pagination";

import { getAllSkillQuery } from "@/query/skill.query";
import { getAllQuestionQuery } from "@/query/question.query";
import { convertDateToEN } from "@/util/util.function";
import { debounce } from "lodash";
import { useAuth } from "@/contexts/auth.context";
import Modal from "@/components/modal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { isPermissioned } from "@/util/auth";
import { fetchMe } from "@/query/user.query";

export default function ManageQuestion() {
  const router = useRouter();

  const [dataFilter, setDataFilter] = useState({
    skill_id: [],
    start_date: "",
    end_date: "",
    page: 1,
    per_page: 10,
    search_filter: "",
  });

  //GET SKILLS
  const [skills, setSkills] = useState<
    { skill_id: number; skill_name: string }[]
  >([]);

  useEffect(() => {
    const getAllSkill = async () => {
      const skills = await getAllSkillQuery();
      setSkills(skills);
    };

    getAllSkill();
  }, []);

  //GET QUESTIONS
  const [questions, setQuestions] = useState<{
    totalPages: number;
    totalItems: number;
    page: number;
    per_page: number;
    data: [];
  }>();

  useEffect(() => {
    const getAllQuestion = async () => {
      const questions = await getAllQuestionQuery(dataFilter);
      setQuestions(questions);
    };

    getAllQuestion();
  }, [dataFilter]);

  const rows =
    questions?.data?.map((question: any) => ({
      ...(question || {}),
      key: question?.question_id,
      question_text: question?.question_text?.replace(/<[^>]*>/g, "").trim(),
      create_at: convertDateToEN(question?.create_at),
      is_available:
        question?.is_available === 1 ? (
          <p className="text-green-3 font-semibold">Available</p>
        ) : (
          <p className="text-red-3 font-semibold">Not available</p>
        ),
    })) || [];

  const columns = [
    {
      key: "question_text",
      label: "QUESTION",
    },
    {
      key: "skill_name",
      label: "SKILL",
    },
    {
      key: "create_by",
      label: "CREATED BY",
    },
    {
      key: "create_at",
      label: "UPDATED AT",
    },
    {
      key: "is_available",
      label: "AVAILABLE STATUS",
    },
  ];

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([""]));

  const onSetDate = (date: any) => {
    const dateRange = {
      start_date: new Date(date?.start).toISOString().split("T")[0],
      end_date: new Date(date?.end).toISOString().split("T")[0],
    };

    setDataFilter((prevState: any) => ({
      ...prevState,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    }));
  };

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const onSelectSkill = (skill: any) => {
    setSelectedSkills((prevSkills) => {
      // เช็คว่าค่ามีอยู่ใน array แล้วหรือไม่
      let newSkills;
      if (prevSkills.includes(skill)) {
        // ถ้ามีอยู่แล้วให้ลบ
        newSkills = prevSkills.filter((item) => item !== skill);
      } else {
        // ถ้ายังไม่มีให้เพิ่มเข้าไป
        newSkills = [...prevSkills, skill];
      }

      // เมื่อมีการเลือกหรือยกเลิกเลือก skill, อัพเดต dataFilter ด้วย skill_id ใหม่
      setDataFilter((prevState: any) => ({
        ...prevState,
        skill_id: newSkills, // อัพเดต skill_id เป็น selectedSkills ใหม่
        page: 1,
      }));

      return newSkills; // ส่งค่ากลับเพื่อให้ setSelectedSkills อัพเดต
    });
  };

  const onChangePage = (page: number) => {
    setDataFilter((prev: any) => ({
      ...prev,
      page: page,
    }));
  };

  const onPreview = (keys: any) => {
    const questionID = new Set(keys);
    return router.push(`/questions/${[...questionID][0]}`);
  };

  const onDebounceSearch = debounce((value) => {
    setDataFilter((prev: any) => ({
      ...prev,
      search_filter: value,
      page: 1,
    }));
  }, 500);

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

  const isAllowed = isPermissioned(user, "READ_QUESTION") && !isFetching;
  useEffect(() => {
    if (isFetching) return;

    if (!isAllowed) {
      setOpenUnauthorizeModal(true);
    }
  }, [isPermissioned, isFetching, router]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">
      {!isFetching && (
        <Modal
          isOpen={openUnauthorizeModal}
          onClose={() => router.push("/profile")}
          onConfirmFetch={() => router.push("/profile")}
          icon={faXmark}
          title="Unauthorized Access"
          message="You do not have permission to access this resource."
          confirmText="Confirm"
        />
      )}
      {isAllowed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Question Management
          </h1>

          <div className="bg-white rounded-lg shadow-2xl p-[30px] flex flex-wrap items-center">
            <div className="w-[350px]">
              <Input
                label="Search"
                placeholder="Search for what you're looking for"
                type="search"
                variant="underlined"
                onValueChange={onDebounceSearch}
              />
            </div>
            {/* Date Range Picker */}
            <div className="mt-0 pl-[50px]">
              <DateRangePicker
                className="max-w-xs"
                label="Create date"
                variant="flat"
                onChange={onSetDate}
              />
            </div>

            {/* Skills Dropdown */}
            <div className="pl-[50px]">
              <Dropdown>
                <DropdownTrigger>
                  <Button className="capitalize" variant="flat">
                    Select skills
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Multiple selection example"
                  closeOnSelect={false}
                  selectedKeys={selectedKeys}
                  selectionMode="multiple"
                  variant="shadow"
                  onSelectionChange={(keys) => setSelectedKeys(keys)}
                  onAction={(key) => onSelectSkill(key)}
                >
                  {skills?.map((skill) => (
                    <DropdownItem key={skill.skill_id}>
                      {skill.skill_name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="ml-auto">
              <Button
                color="success"
                variant="flat"
                onPress={() => router.push("/questions/create")}
              >
                Create New +
              </Button>
            </div>
          </div>

          {questions?.data && (
            <div className="flex flex-col mt-[30px]">
              {/* Table */}
              <div className="flex justify-center">
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
                  {questions?.data?.length === 0 ? (
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  ) : (
                    <TableBody items={rows}>
                      {(item) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell>
                              {getKeyValue(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>

              {/* Pagination */}
              {questions?.data?.length > 0 && (
                <div className="pt-[25px] flex justify-center left-auto">
                  <Pagination
                    initialPage={1}
                    page={questions?.page}
                    total={Number(questions?.totalPages)}
                    onChange={onChangePage}
                    variant="faded"
                    color="default"
                    size="lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
