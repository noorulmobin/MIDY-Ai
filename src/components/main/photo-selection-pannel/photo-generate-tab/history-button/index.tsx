"use client";
import { Button } from "@/components/ui/button";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  getAll,
  HistoryItemType,
  remove,
} from "@/lib/photo-generate-history-db";
import { Cross2Icon } from "@radix-ui/react-icons";
import Masonry from "react-layout-masonry";
import HistoryItem from "../../../history-item";
import { History } from "lucide-react";

const HistoryButton = (props: {
  onClickHistoryItem: (historyItem: HistoryItemType) => void;
}) => {
  const { onClickHistoryItem: onClickHistoryItemParent } = props;
  const { t } = useClientTranslation();

  const [open, setOpen] = useState(false);

  const [histories, setHistories] = useState<HistoryItemType[]>([]);

  const refreshHistories = async () => {
    const newHistories = await getAll();
    setHistories(newHistories.reverse());
  };

  const onClickHistoryItem = (historyItem: HistoryItemType) => {
    onClickHistoryItemParent(historyItem);
    setOpen(false);
  };

  const onClickDelete = async (id: string) => {
    await remove(id);
    refreshHistories();
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(newFlag) => setOpen(newFlag)}>
        <Dialog.Trigger asChild>
          <Button
            className="gap-2"
            variant="secondary"
            onClick={() => refreshHistories()}
          >
            <History className="size-4" />
            {t("home:audio_tab.generate.history_button_text")}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-slate-400 opacity-55 dark:bg-slate-400" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-full -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-black md:max-w-screen-md">
            <Dialog.Title>
              {t("home:audio_tab.generate.history_button_text")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full border border-gray-400 outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
            {histories.length === 0 && (
              <div className="flex flex-col text-center">
                <p>{t("home:audio_tab.generate.history_none")}</p>
              </div>
            )}
            <div className="overflow-auto">
              <Masonry columns={{ 220: 1, 640: 2, 768: 3, 1024: 4 }} gap={16}>
                {histories.map((item, index) => (
                  <HistoryItem
                    imgUrl={item.url}
                    createAt={item.createdAt}
                    url={item.url}
                    key={index}
                    onClickItem={() => onClickHistoryItem(item)}
                    onClickDeleteItem={() => onClickDelete(item.id)}
                  />
                ))}
              </Masonry>
            </div>
            <div className="min-h-12 w-full md:min-h-0"></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
export default HistoryButton;
