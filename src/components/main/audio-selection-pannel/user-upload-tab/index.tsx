"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import MP3Player from "@/components/mp3-player";

import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import useAudioUpload from "@/hooks/use-audio-upload";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { emitter } from "@/utils/mitt";

const UserUploadTab = (props: {
  onClickNext: (newAudioUrl: string) => void;
}) => {
  const { onClickNext } = props;

  const { t } = useClientTranslation();

  const { loading, upload } = useAudioUpload();

  const infoStoreState = useLipsyncInfoStore();

  const { audioUploadData, setAudioUploadData } = infoStoreState;

  const [audioUrl, setAudioUrl] = useState<string | null>(audioUploadData.url);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const { result, errorHint } = await upload(file);
      if (!result) {
        if (errorHint) {
          emitter.emit("ToastError", {
            code: -1,
            message: t("home:audio_tab.upload.upload_error"),
          });
        }
        return;
      }
      setAudioUrl(result);
      setAudioUploadData({
        ...audioUploadData,
        url: result,
      });
      emitter.emit("ToastSuccess", {
        code: -1,
        message: t("home:audio_tab.user_upload.upload_success"),
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <input
        className="hidden"
        {...getInputProps({
          accept: ".mp3,.mav,.mp4,.mov,wav",
          multiple: false,
        })}
      />
      <div className="z-10 box-border flex flex-1 flex-col justify-center pt-4 md:max-h-96">
        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-300">
          <div
            className={cn(
              "text-md mx-auto my-0 flex h-52 w-52 cursor-pointer flex-col justify-center rounded-full border border-dashed border-gray-300 text-center text-gray-400 hover:border-primary hover:text-primary",
              isDragActive ? `border-primary text-primary` : null
            )}
            {...(loading ? {} : getRootProps())}
          >
            {loading ? (
              <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
              </>
            ) : (
              <>
                <div className="text-sm">
                  {t("home:audio_tab.upload.text_drag")}
                </div>
                <div className="text-sm">
                  {t("home:audio_tab.upload.text_support")}
                </div>
                <div className="text-sm">mp3、mav、mp4、mov、wav</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        <MP3Player audioSrc={audioUrl || "##"} />
      </div>
      <div className="mt-2 flex flex-row justify-center">
        <Button
          className="gap-2"
          disabled={!audioUrl}
          onClick={() => audioUrl && onClickNext(audioUrl)}
        >
          <ArrowRight className="size-4" />
          {t("home:audio_tab.next_step_button_text")}
        </Button>
      </div>
    </>
  );
};
export default UserUploadTab;
