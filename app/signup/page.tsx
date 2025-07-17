"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupModal from "./SignupModal";

export default function SignupPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
  };

  return <SignupModal isOpen={isOpen} onClose={handleClose} />;
}
