"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchProps {
  onChange: (search_word: string) => void;
}

export default function Search({ onChange }: SearchProps) {
  return (
    <div className="flex items-center space-x-2 relative ml-10">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="rounded-lg px-4 py-2 pr-8 border border-gray-300 shadow-md w-[300px] focus:outline-none focus:ring-2 focus:ring-primary-5 focus:shadow-md"
          onChange={(e) => onChange(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="1x"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>
  );
}
