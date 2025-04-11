import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AvatarInterface } from "./avatar-interface";
import { useState } from "react";

interface AvatarMakerProps {
  imageSrc: string;
  disabled?: boolean;
  onImageChange: (image: string) => void;
}

export function AvatarMaker({
  imageSrc,
  disabled,
  onImageChange,
}: AvatarMakerProps) {
  const { t } = useClientTranslation();

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={disabled}>
          <CircleUserRound className="h-4 w-4" />
          {t("home:photo_tab.avatar_maker.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>{t("home:photo_tab.avatar_maker.title")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <AvatarInterface
          imageSrc={imageSrc}
          onClose={() => setOpen(false)}
          onImageChange={onImageChange}
        />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
