import { useRouter } from "next/navigation";
import Button from "../button/button";
import DataTable, { DataTableProps } from "../datatable";
import { PaginationProps } from "../pagination";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

export default function Examtable(
  props: Omit<DataTableProps, "columns"> & PaginationProps
) {
  //---------------------
  //   UTIL
  //---------------------
  const router = useRouter();

  //---------------------
  //   COLUMNS
  //---------------------
  const columns: DataTableProps["columns"] = [
    {
      header: "Title",
      cell: (v) => (
        <div
          className="py-[28px] pl-[24px] body-regularM hover:text-primary-5 cursor-pointer"
          onClick={() => router.push(`/exams/${v.id}`)}
        >
          {v.title}
        </div>
      ),
      accessor: "title",
      colSpan: 3,
    },
    {
      header: "Questions",
      cell: (v) => (
        <div className="py-[28px] pl-[48px] body-regularM">
          {v.numberOfQuestion}
        </div>
      ),
      accessor: "questions",
      colSpan: 7,
    },
    {
      header: "",
      cell: (v) => (
        <div className="pl-[16px] pt-[16px] flex gap-[12px] justify-center items-center">
          <div className="w-[50px] h-[50px]">
            <Button
              bgColor="bg-primary-5"
              textColor="black"
              fontSize="body-regularL"
              onClick={() => console.log("edit")}
              icon={faPenToSquare}
            />
          </div>
          <div className="w-[50px] h-[50px]">
            <Button
              bgColor="bg-primary-5"
              textColor="black"
              fontSize="body-regularL"
              onClick={() => console.log("delete")}
              icon={faTrashCan}
            />
          </div>
        </div>
      ),
      accessor: "action",
      colSpan: 2,
    },
  ];

  return (
    <DataTable {...props} columns={columns} data={props.data} pagination />
  );
}
