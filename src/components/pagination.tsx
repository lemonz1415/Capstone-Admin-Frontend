"use client";

import {
  faCircleLeft,
  faCircleRight,
} from "@fortawesome/free-regular-svg-icons";
import Button from "./button/button";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  //---------------------
  //   CONST
  //---------------------
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  //---------------------
  //   HANDLE
  //---------------------
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  //---------------------
  //   RENDER
  //---------------------
  return (
    <div className="flex flex-row items-center space-x-4 bg-primary-4 rounded-full px-7 py-2 mt-4 text-white">
      <span className="body-boldS">
        {startItem} - {endItem} of {totalItems}
      </span>

      <span className="body-boldS">
        Page:
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="bg-primary-4 rounded-md text-center"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </span>

      <span className="flex flex-row">
        <Button
          icon={faCircleLeft}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          bgColor="bg-primary-4"
          textColor="text-black"
          padding="px-1 py-1"
          fontSize="body-regularL"
          shadow="drop-shadow-none"
        />
        <Button
          icon={faCircleRight}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          bgColor="bg-primary-4"
          textColor="text-black"
          padding="px-1 py-1"
          fontSize="body-regularL"
          shadow="drop-shadow-none"
        />
      </span>
    </div>
  );
}
