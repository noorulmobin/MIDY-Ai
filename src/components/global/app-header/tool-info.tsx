"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useToolInfo } from "@/hooks/global/use-tool-info";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface Props {
  className?: string;
}
function ToolInfo({ className }: Props) {
  const { t } = useClientTranslation();

  const { info } = useToolInfo();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild={true}>
          <Button
            aria-label={t("global:header.tool_info.trigger.label")}
            variant="icon"
            size="roundIconSm"
            className={cn(className)}
          >
            <Info className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("global:header.tool_info.title")}</DialogTitle>
            <DialogDescription>
              {t("global:header.tool_info.description")}
            </DialogDescription>
          </DialogHeader>

          <div
            // @ts-expect-error info is a string
            dangerouslySetInnerHTML={{ __html: info }}
            className="prose dark:prose-invert"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ToolInfo };
