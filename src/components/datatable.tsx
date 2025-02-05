"use client";

import { useRouter } from "next/navigation";
import Pagination, { PaginationProps } from "./pagination";

export interface DataTableProps extends PaginationProps {
  columns: {
    header: string;
    cell: (v: any, i: number) => React.ReactElement;
    colSpan: number;
    accessor: string;
  }[];
  data: any[];
  pagination?: boolean;
}

export default function DataTable(props: DataTableProps) {
  //---------------------
  //   UTIL
  //---------------------

  const router = useRouter();

  //---------------------
  //   CONST
  //---------------------
  const per_page = 5;

  //---------------------
  //   RENDER
  //---------------------
  return (
    <div className="bg-red-0 w-full rounded-xl">
      <div className="h-[90px] bg-primary-3 rounded-t-xl grid grid-cols-12 pt-[25px] pl-[25px]">
        {props.columns?.map((item) => (
          <p
            key={`header_${item.accessor}`}
            className="body-boldM pt-[16px]"
            style={{
              gridColumn: `span ${item.colSpan} / span ${item.colSpan}`,
            }}
          >
            {item.header}
          </p>
        ))}
      </div>
      <div className=" bg-primary-1 rounded-b-xl h-[410px]">
        <div>
          {props.data?.slice(0, per_page).map((data, i) => (
            <div
              key={`data_row_${i}`}
              className="grid grid-cols-12 last:border-none"
            >
              {props.columns.map((column) => (
                <div
                  key={`data_row_${i}_${column.accessor}`}
                  style={{
                    gridColumn: `span ${column.colSpan} / span ${column.colSpan}`,
                  }}
                >
                  {column.cell(data, i)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {props.pagination && (
        <div className="flex justify-end mb-10">
          <Pagination {...props} />
        </div>
      )}
    </div>
  );
}
