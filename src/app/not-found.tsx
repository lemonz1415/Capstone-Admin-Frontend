"use client";

import Button from "@/components/button/button";
import Image from "next/image";
import NotFoundImg from "../../public/images/404-status-img.png";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen ml-[250px]">
      <div>
        <Image
          src={NotFoundImg}
          alt="404 Not Found Image"
          width={500}
          height={300}
          unoptimized
        />
      </div>
      <div className="heading-boldS text-gray-800 pt-8">
        404 - Page Not Found
      </div>
      <div className="body-regularM text-gray-2 mt-4 pb-6">
        The page you are looking for does not exist or has been moved.
      </div>
      <div className="w-[400px] h-[60px]">
        <Button
          title="Go to Homepage"
          onClick={() => router.push("/questions")}
          bgColor="bg-primary-5"
          padding="px-16 py-3"
          fontSize="body-boldM"
        />
      </div>
    </div>
  );
}
