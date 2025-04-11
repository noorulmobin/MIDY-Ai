"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const AppLogo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix hydration mismatch by rendering only on client
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/MidyAI Design Logo.png"
      : "/images/midy-logo.png";

  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src={logoSrc}
        alt="MidyAI Logo"
        width={120}
        height={40}
        style={{ maxWidth: "100%", height: "auto" }}
        priority
      />
    </Link>
  );
};

export default AppLogo;
