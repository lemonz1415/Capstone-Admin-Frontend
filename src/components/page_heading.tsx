"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface PageHeadingProps {
  title: string;
  subtitle: string;
  showBackButton: boolean;
}

export default function PageHeading({
  title,
  subtitle,
  showBackButton = true,
}: PageHeadingProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 shadow-md mb-8">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-200 transition transform hover:scale-105 focus:outline-none"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-lg text-gray-200 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
