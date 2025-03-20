"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth.context"; // ดึง Context API สำหรับ Auth
import { useEffect, useState } from "react";
import { fetchMe } from "@/query/user.query";
import { isPermissioned } from "@/util/auth";

export default function withAuth(
  Component: React.ComponentType,
  redirectIfLoggedIn?: string
) {
  return function AuthenticatedComponent(props: any) {
    return <Component {...props} />;
  };
}
