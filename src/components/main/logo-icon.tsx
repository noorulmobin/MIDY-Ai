"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const AppLogo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is available after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent rendering during SSR
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/MidyAI Design Logo.png"   
      : "/images/midy-logo.png"; 

  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src={logoSrc}
        alt="MidyAI Logo"
        width={95}
        height={55}
        style={{ maxWidth: "100%", height: "140px", marginLeft: "270px", marginTop: "100px"}}
        priority
      />
    </Link>
  );
};

export default AppLogo;
// <AppLogo />