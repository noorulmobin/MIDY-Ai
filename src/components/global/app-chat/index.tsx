"use client";

import { useAppStore } from "@/stores";
import { isMobile } from "@/utils";
import Script from "next/script";

const AppChat = () => {
  const { hideBrand } = useAppStore();
  if (isMobile() || hideBrand) return null;
  return (
    <Script src="https://assets.salesmartly.com/js/project_177_61_1649762323.js" />
  );
};

export default AppChat;
