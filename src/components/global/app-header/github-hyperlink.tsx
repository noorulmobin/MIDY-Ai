import { env } from "@/env";
import githubMark from "@/public/svgs/github-mark.svg";
import githubMarkWhite from "@/public/svgs/github-mark-white.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/global/use-theme";
import { Button } from "@/components/ui/button";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useAppStore } from "@/stores";

export function GithubHyperlink() {
  const { t } = useClientTranslation();

  const githubRepoUrl = env.NEXT_PUBLIC_GITHUB_REPO_URL;

  const { theme } = useTheme();

  const { hideBrand } = useAppStore();

  return (
    <a
      href={githubRepoUrl}
      target="_blank"
      className={cn(githubRepoUrl && !hideBrand ? "block" : "hidden")}
    >
      <Button
        variant="icon"
        size="roundIconSm"
        aria-label={t("global:header.github_hyperlink.label")}
      >
        <Image
          className="size-4"
          src={theme === "dark" ? githubMarkWhite : githubMark}
          alt="GitHub"
          width={16}
          height={16}
        />
      </Button>
    </a>
  );
}
