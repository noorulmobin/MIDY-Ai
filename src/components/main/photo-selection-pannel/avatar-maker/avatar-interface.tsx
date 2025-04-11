/* eslint-disable @next/next/no-img-element */
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { StyleInterface } from "./style-interface";
import { CharacterTypeSelect } from "./character-type-select";
import { SizeSelect } from "./size-select";
import { useAvatarFormStore } from "@/stores/slices/use-avatar-form-store";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createScopedLogger, isMobile } from "@/utils";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { addData, getData, IAiAvatarMaker } from "@/db";
import { emitter } from "@/utils/mitt";
import { useAppStore } from "@/stores";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import HistoryRecordPanel from "./history-record-panel";
import ky from "ky";

interface AvatarInterfaceProps {
  imageSrc: string;
  onClose: () => void;
  onImageChange: (image: string) => void;
}

const logger = createScopedLogger("AvatarInterface");

export function AvatarInterface({
  imageSrc,
  onClose,
  onImageChange,
}: AvatarInterfaceProps) {
  const { t } = useClientTranslation();

  const { apiKey, modelName: model } = useAppStore.getState();

  const updateField = useAvatarFormStore((state) => state.updateField);
  const tab = useAvatarFormStore((state) => state.tab);
  const characterType = useAvatarFormStore((state) => state.characterType);
  const size = useAvatarFormStore((state) => state.size);
  const presetStyle = useAvatarFormStore((state) => state.presetStyle);
  const url = useAvatarFormStore((state) => state.url);

  const taskId = useLipsyncInfoStore((state) => state.taskId);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [dataSource, setDataSource] = useState<IAiAvatarMaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [desktopCss, setDesktopCss] = useState(false);

  const handleImageLoaded = () => {
    updateField("url", imageSrc);
    setIsImageLoaded(true);
  };

  const handleGenerate = async () => {
    if (isMobile()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (!url) {
      toast(t("home:photo_tab.avatar_maker_tips"));
      return;
    }

    let params = {};
    const content = localStorage.getItem("avatar_maker_custom_prompt");
    if (tab === 2 && !content) {
      toast(t("home:photo_tab.custom_style.tab_custom_tips"));
      return;
    }
    if (tab === 2) {
      params = { content };
    }
    params = {
      ...params,
      characterType,
      width: size.width,
      height: size.height,
      main_face_image: url,
      presetStyle: presetStyle.value,
      apiKey,
      model,
    };

    try {
      setIsGenerate(true);

      const response = await ky("/api/generate", {
        method: "post",
        body: JSON.stringify(params),
        timeout: false,
      });
      const result: any = await response.json();
      if (result?.output) {
        const url = JSON.parse(result.output)[0];
        const data = await addData({
          url,
          original_url: imageSrc,
          task_id: taskId,
          created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        });
        setDataSource((v) => [{ ...data }, ...v]);
        toast(
          result?.message ||
            t("home:photo_tab.avatar_maker_generate_status.success")
        );
      }
      if (result?.error || !result?.output) {
        if (result?.error?.err_code) {
          emitter.emit("ToastError", result?.error?.err_code || "");
        } else {
          toast(
            result?.message ||
              t("home:photo_tab.avatar_maker_generate_status.error")
          );
        }
      }
    } catch (error: any) {
      toast(
        error?.message || t("home:photo_tab.avatar_maker_generate_status.error")
      );
    } finally {
      setIsGenerate(false);
    }
  };

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getData(taskId);
      setDataSource([...data]);

      setIsLoading(false);
    } catch (error) {
      logger.error(error);
    }
  }, [taskId]);

  const handleScroll = useCallback(() => {
    setDesktopCss(window.scrollY >= 200);
    if (
      window.innerHeight + 200 + window.scrollY >=
        document.documentElement.scrollHeight &&
      !isLoading
    ) {
      handleGetData();
    }
  }, [isLoading, handleGetData]);

  const handleSelect = useCallback(
    (item: IAiAvatarMaker) => {
      onImageChange(item.url);
      onClose();
    },
    [onClose, onImageChange]
  );

  useEffect(() => {
    if (isMobile()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    handleGetData();
  }, [handleGetData]);

  useEffect(() => {
    if (isMobile()) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [dataSource.length, handleScroll, isLoading]);

  return (
    <div className="flex max-h-[80vh] w-full flex-col overflow-y-auto md:flex-row">
      <div
        className={`mx-auto mb-5 flex w-full flex-col gap-5 md:mb-0 md:w-[300px] md:pr-5 ${desktopCss && isMobile() && "md:sticky md:top-5 md:h-screen md:overflow-y-auto md:pb-10"}`}
      >
        <div
          className={`relative h-[240px] overflow-hidden rounded-xl border border-primary`}
        >
          {!isImageLoaded && (
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
          )}
          <img
            src={imageSrc}
            alt="image"
            className="h-full w-full object-contain"
            onLoad={handleImageLoaded}
          />
        </div>

        <StyleInterface />

        <CharacterTypeSelect />

        <SizeSelect />

        <Button
          className="w-full"
          disabled={isGenerate}
          onClick={handleGenerate}
        >
          {t("home:photo_tab.avatar_maker_generate")}
          {isGenerate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>

      <div className="hidden w-[1px] bg-primary md:block" />

      <HistoryRecordPanel
        dataSource={dataSource}
        onGetData={handleGetData}
        onSelect={handleSelect}
      />
    </div>
  );
}
