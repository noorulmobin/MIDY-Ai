// components/LandingInput.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingInput() {
  const [text, setText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 5) {
      router.push(`/main?input=${encodeURIComponent(text)}`);
    }
  }, [text, router]);

  return (
    <div className="ml-[700px] mt-[0px] flex h-[850px]">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <img  src="/images/midy-logo.png"  alt="Logo" className="mb-4  dark:hidden w-[200px] h-[200px]"/>
        <img src="/images/global/logo-mini.png"alt="Logo" className="mb-4 hidden w-24 dark:block w-[200px] h-[200px]" />
        <h1 className="text-4xl font-bold uppercase">MidyAI Text-To-Speech</h1>
        <h2 className="mt-2 text-xl text-gray-600">
          Convert text into natural-sounding speech instantly
        </h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing..."
          className="mt-6 w-full max-w-md rounded-3xl border border-gray-300 px-4 py-2"
        />
      </div>
    </div>
  );
}
