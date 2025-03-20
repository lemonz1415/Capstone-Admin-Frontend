"use client";

import { useAuth } from "@/contexts/auth.context";
import withAuth from "@/middleware/withAuth";
import { useEffect } from "react";

function ProfilePage() {
  return <div className="ml-[800px] mt-[400px]">Profile Page...</div>;
}

export default withAuth(ProfilePage);
