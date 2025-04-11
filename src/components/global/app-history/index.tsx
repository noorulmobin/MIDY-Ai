import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useEffect, useState } from "react";

import { History } from "lucide-react";
import {
  getAll,
  HistoryItemType,
  remove,
} from "@/lib/video-generate-history-db";
import Masonry from "react-layout-masonry";
import HistoryItem from "@/components/main/history-item";

const AppHistory = () => {
  const { t } = useClientTranslation();

  const [open, setOpen] = useState(false);

  const [histories, setHistories] = useState<HistoryItemType[]>([]);

  const refreshHistories = async () => {
    const newHistories = await getAll();
    setHistories(newHistories.reverse());
  };

  const onClickDelete = async (id: string) => {
    await remove(id);
    refreshHistories();
  };

  useEffect(() => {
    if (open) {
      refreshHistories();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={true}>
        <Button
          aria-label={t("extras:history.trigger.label")}
          variant="icon"
          size="roundIconSm"
          onClick={() => setOpen(true)}
        >
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-full -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-black md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{t("extras:history.title")}</DialogTitle>
        </DialogHeader>
        {histories.length === 0 && (
          <div className="flex flex-col text-center">
            <p>{t("home:audio_tab.generate.history_none")}</p>
          </div>
        )}
        <div className="overflow-auto">
          <Masonry columns={{ 220: 1, 640: 2, 768: 3, 1024: 4 }} gap={16}>
            {histories.map((item, index) => (
              <HistoryItem
                createAt={item.createdAt}
                imgUrl={item.imgUrl}
                url={item.url}
                key={index}
                onClickItem={() => {}}
                onClickDeleteItem={() => onClickDelete(item.id)}
              />
            ))}
          </Masonry>
        </div>
        <div className="min-h-12 w-full md:min-h-0"></div>
      </DialogContent>
    </Dialog>
  );
};

export default AppHistory;
