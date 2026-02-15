"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Handshake } from "lucide-react";

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md", ...props }: LogoProps) {
 const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)} {...props}>
      <div className={cn(sizeClasses[size], "rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30")}>
        <Handshake className="text-white w-2/3 h-2/3 drop-shadow-md" />
      </div>
      <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-300% animate-gradient-x">
        FreelancePro
      </span>
    </Link>
  );
}
