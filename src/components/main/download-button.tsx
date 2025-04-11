"use client";
import { Download, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import useFileDownload from "@/hooks/use-file-download";
import { cn } from "@/lib/utils";

const DownloadButton = (props: {
  className?: string;
  disabled?: boolean;
  fileUrl: string | null | undefined;
}) => {
  const { fileUrl, disabled = false, className } = props;
  const { t } = useClientTranslation();
  const { download, downloading } = useFileDownload();
  return (
    <>
      <Button
        className={cn("gap-2", className)}
        disabled={!fileUrl || downloading || disabled}
        onClick={() => fileUrl && download(fileUrl)}
      >
        {downloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        {t("home:audio_tab.generate.download_button_text")}
      </Button>
    </>
  );
};
export default DownloadButton;
