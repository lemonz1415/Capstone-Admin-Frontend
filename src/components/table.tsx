"use client";

import { useRouter } from "next/navigation";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Button from "./button/button";
import classNames from "classnames";

interface TableProps {
  data: {
    id: number;
    title: string;
    numofQuestion: number;
  }[];
  onRowClick: (id: number) => void;
}

export default function Table({
  data,
  onRowClick,
}: TableProps) {
  //---------------------
  //   UTIL
  //---------------------
  
  const router = useRouter();

  //---------------------
  //   CONST
  //---------------------

  const columns = [
    { header: "#", accessor: "id" },
    { header: "TITLE", accessor: "title" },
    { header: "QUESTIONS", accessor: "numOfQuestion" },
    { header: "", accessor: "actions" },
  ];

  //---------------------
  //   RENDER
  //---------------------
  return (
    <div className="overflow-x-auto rounded-xl shadow-xl w-full">
      <table className="w-full bg-primary-1 text-black rounded-xl">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`py-6 border-b bg-primary-3 text-black body-boldS text-center pl-10 ${
                  column.accessor === "actions" ? "w-[200px]" : ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-primary-2">
              <td
                className={classNames("pl-10 border-b text-center body-boldS")}
                onClick={() => onRowClick(row.id)}
              >
                {row.id}
              </td>
              <td
                className={classNames("pl-10 border-b text-center body-boldS")}
                onClick={() => onRowClick(row.id)}
              >
                {row.title}
              </td>
              <td
                className={classNames("pl-10 border-b text-center body-boldS")}
                onClick={() => onRowClick(row.id)}
              >
                {row.numofQuestion}
              </td>
              <td className="py-3 border-b items-center justify-center flex space-x-3 ">
                <Button
                  icon={faPenToSquare}
                  onClick={() => router.push("/exams")}
                  bgColor="bg-primary-5"
                  textColor="text-black"
                  padding="px-4 py-4"
                  fontSize="body-boldL"
                />
                <Button
                  icon={faTrashCan}
                  onClick={() => router.push("/exams")}
                  bgColor="bg-primary-5"
                  textColor="text-black"
                  padding="px-4 py-4"
                  fontSize="body-boldL"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
