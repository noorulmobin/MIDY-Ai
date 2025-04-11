"use client";
import MP3Player from "@/components/mp3-player";
import { Button } from "@/components/ui/button";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import useFileDownload from "@/hooks/use-file-download";
import { HistoryItemType } from "@/lib/audio-generate-history-db";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { HiDownload } from "react-icons/hi";
import { RiDeleteBin6Fill } from "react-icons/ri";

const HistoryItemButton = (props: {
  item: HistoryItemType;
  onClickUseItem: () => void;
  onClickDelete: () => void;
}) => {
  const { item, onClickUseItem, onClickDelete } = props;

  const { t } = useClientTranslation();

  const { download, downloading } = useFileDownload();
  return (
    <div className="mt-2 flex flex-col md:flex-row">
      <div className="flex flex-1 flex-col">
        <div className="block text-sm leading-4 dark:text-white">
          {dayjs(item.createdAt).format("YYYY/MM/DD HH:mm")}
        </div>
        <MP3Player audioSrc={item.audioUrl} />
      </div>
      <div className="flex flex-col justify-end">
        <div className="my-2 flex flex-row justify-end gap-3 md:my-0 md:ml-3">
          <Button
            variant="secondary"
            className="md:h-16"
            onClick={() => onClickUseItem()}
          >
            {t("home:audio_tab.generate.history.use")}
          </Button>
          <Button
            variant="secondary"
            className="md:h-16"
            onClick={() => onClickDelete()}
          >
            <RiDeleteBin6Fill />
          </Button>
          <Button
            variant="secondary"
            className="md:h-16"
            onClick={() => download(item.audioUrl)}
          >
            {downloading ? <Loader2 /> : <HiDownload />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default HistoryItemButton;
