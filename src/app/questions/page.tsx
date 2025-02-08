"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";

import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@heroui/pagination";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { DateRangePicker } from "@heroui/react";

import { Input } from "@heroui/react";
import { getAllSkillQuery } from "@/query/skill.query";
import { getAllQuestionQuery } from "@/query/question.query";
import { convertDateToTH } from "@/util/util.function";

export default function ManageQuestion() {
  const router = useRouter();

  const [dataFilter, setDataFilter] = useState({
    skill_id: [],
    start_date: "",
    end_date: "",
    page: 1,
    per_page: 10,
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
      create_at: convertDateToTH(question?.create_at),
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
      label: "CREATED AT",
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
      }));

      return newSkills; // ส่งค่ากลับเพื่อให้ setSelectedSkills อัพเดต
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 ml-[250px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Question Management
        </h1>

        <div className="bg-white rounded-lg shadow-2xl p-[30px] flex flex-wrap items-center">
          <div className="w-[350px]">
            <Input
              label="Search"
              placeholder="Enter your search"
              type="search"
              variant="underlined"
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
                {skills.map((skill) => (
                  <DropdownItem key={skill.skill_id}>
                    {skill.skill_name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                onSelectionChange={() => console.log("sss")}
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
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </div>

            {/* Pagination */}
            {questions?.data?.length > 0 && (
              <div className="pt-[25px] flex justify-center">
                <Pagination
                  initialPage={1}
                  total={Number(questions?.totalPages)}
                  color="success"
                  size="lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
