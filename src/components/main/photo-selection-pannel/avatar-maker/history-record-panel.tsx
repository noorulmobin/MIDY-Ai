/* eslint-disable @next/next/no-img-element */
import Masonry from "react-layout-masonry";
import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { IAiAvatarMaker, deleteData } from "@/db";
import ky from "ky";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { createScopedLogger } from "@/utils/logger";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { Check } from "lucide-react";
import { isMobile } from "@/utils";

const logger = createScopedLogger("HistoryRecordPanel");

interface HistoryRecordPanelProps {
  dataSource: IAiAvatarMaker[];
  onGetData: () => Promise<void>;
  onSelect: (item: IAiAvatarMaker) => void;
}

export default function HistoryRecordPanel({
  dataSource,
  onGetData,
  onSelect,
}: HistoryRecordPanelProps) {
  const { t } = useClientTranslation();

  const handleDownload = async (url: string) => {
    if (!url) {
      toast.error(t("home:photo_tab.avatar_maker_download_error"));
      return;
    }

    try {
      const filename = `avatar-${new Date().getTime()}.png`;

      const response = await ky.get(url);
      const blob = await response.blob();

      const pngBlob = new Blob([blob], { type: "image/png" });
      const downloadUrl = window.URL.createObjectURL(pngBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      logger.error("Download failed:", error);
      toast.error(t("home:photo_tab.avatar_maker_download_error"));
    }
  };

  const onDeleteDialog = (item: IAiAvatarMaker) => {
    const onDel = async (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      try {
        await deleteData(item.id || 0);
        await onGetData();
        toast(t("home:photo_tab.avatar_maker_delete.success"));
      } catch (error) {
        logger.error(error);
        toast(t("home:photo_tab.avatar_maker_delete.error"));
      }
    };
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="p-1">
            <MdDeleteOutline className="text-2xl text-red-600 md:text-xl" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("home:photo_tab.avatar_maker_delete.tips")}
            </AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("home:photo_tab.avatar_maker_delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDel}>
              {t("home:photo_tab.avatar_maker_delete.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const handleImageClick = (item: IAiAvatarMaker) => {
    if (isMobile()) {
      return;
    }

    onSelect(item);
  };

  return (
    <div
      className="h-full flex-1 md:pl-5"
      style={{ minHeight: "calc(100vh - 145px - 60px)" }}
    >
      {dataSource.length ? (
        <Masonry columns={{ 640: 1, 768: 2, 1024: 3, 1280: 4 }} gap={10}>
          {dataSource.map((item) => (
            <div
              className={`group relative cursor-pointer overflow-hidden`}
              key={item.id}
              onClick={() => handleImageClick(item)}
            >
              <div className="absolute left-0 top-[-28px] flex w-full items-center justify-between bg-[#ffffff8a] backdrop-blur-sm transition-all group-hover:top-0">
                <div
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(item.url);
                  }}
                >
                  <MdOutlineFileDownload className="text-2xl text-[#7c3aed] md:text-xl" />
                </div>
                {isMobile() && (
                  <div
                    className="p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                  >
                    <Check className="text-2xl text-[#1dff3b] md:text-xl" />
                  </div>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {onDeleteDialog(item)}
                </div>
              </div>
              <img
                src={item.url}
                className="w-full cursor-pointer rounded-sm border"
                alt={item.original_url}
              />
            </div>
          ))}
        </Masonry>
      ) : (
        <></>
      )}
      {!dataSource.length && (
        <div
          className="flex h-full flex-1 flex-col items-center justify-center gap-6"
          style={{ height: "calc(100vh - 145px - 60px)" }}
        >
          <img
            className="size-[150px] max-md:size-[100px]"
            src="/images/empty.png"
            alt="Placeholder Image"
          />
          <div className="text-2xl text-slate-400 md:text-3xl">
            {t("home:photo_tab.avatar_maker_empty_text")}
          </div>
        </div>
      )}
    </div>
  );
}
