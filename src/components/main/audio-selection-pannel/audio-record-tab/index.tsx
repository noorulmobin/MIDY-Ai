"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { Button } from "@/components/ui/button";
import { ImVolumeIncrease } from "react-icons/im";
import { FaRegDotCircle } from "react-icons/fa";
import { ArrowRight, Loader } from "lucide-react";
import { Mic } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useAudioRecord from "@/hooks/use-audio-record";
import { emitter } from "@/utils/mitt";
import useImageUpload from "@/hooks/use-image-upload";
import DownloadButton from "../../download-button";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { MdDelete } from "react-icons/md";
import MP3PlayerBlob from "@/components/mp3-player-blob";

const maxDuration = 30;
const minDuration = 1;

const AudioRecordTab = (props: {
  onClickNext: (newAudioUrl: string) => void;
}) => {
  const { onClickNext } = props;
  const { t } = useClientTranslation();

  const { upload, loading: uploadLoading } = useImageUpload();

  const infoStoreState = useLipsyncInfoStore();

  const { audioRecordData, setAudioRecordData } = infoStoreState;

  const [fileUrl, setFileUrl] = useState<string | null>(audioRecordData.url);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const afterRecording = async (audioFile: File) => {
    const url = await upload(audioFile);
    if (!url) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:use_audio_record.error_upload_failed"),
      });
      return;
    }
    setFileUrl(url);
    setAudioRecordData({ url });
    setAudioBlob(audioFile);
  };

  const { startRecording, stopRecording, isRecording, recordingDuration } =
    useAudioRecord({
      maxDuration,
      minDuration,
      afterRecording,
    });

  const onClickDelete = () => {
    setFileUrl(null);
    setAudioBlob(null);
    setAudioRecordData({
      ...audioRecordData,
      url: null,
    });
  };

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    if (fileUrl) {
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setAudioBlob(blob);
        });
    }
  }, [fileUrl]);

  return (
    <>
      <div className="z-10 box-border flex flex-1 flex-col justify-center pt-4 md:max-h-96">
        <div className="relative flex flex-1 flex-col items-center justify-center rounded-2xl border border-gray-300">
          <div className="text-md relative z-0 mx-auto my-0 flex h-24 w-24 flex-col justify-center rounded-full border border-dashed border-gray-300 text-center text-gray-400 md:h-52 md:w-52">
            <ImVolumeIncrease className="mx-auto my-0 h-1/4 w-1/4 text-lg" />
          </div>
          <div className="absolute bottom-3 left-0 right-0 z-10 mx-auto flex flex-row justify-center">
            <Button size="default" onClick={handleToggleRecording}>
              {isRecording || uploadLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {uploadLoading
                ? t("home:audio_tab.record.uploading_text")
                : t("home:audio_tab.record.start_record")}
            </Button>
          </div>
          <div className="absolute left-3 top-2 z-10 flex flex-row">
            <div className="flex flex-col justify-center">
              <FaRegDotCircle className="mr-3 block h-4 w-4" />
            </div>
            <div>
              00:{`${recordingDuration / 1000}`.padStart(2, "0")}/00:
              {maxDuration}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        {audioBlob && <MP3PlayerBlob audioBlob={audioBlob} />}
      </div>
      {/* <div className="mt-2 flex flex-col">
        wtf
        {audioSrc && <audio className="block w-full h-20" controls src={audioSrc} />}
      </div> */}
      <div className="mt-2 flex flex-row justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!fileUrl}
          onClick={() => onClickDelete()}
        >
          <MdDelete className="size-4" />
          {t("home:audio_tab.upload.delete_text")}
        </Button>
        <DownloadButton fileUrl={fileUrl} disabled={!fileUrl} />
      </div>
      <div className="mt-2 flex flex-row justify-center">
        <Button
          className="gap-2"
          disabled={!fileUrl}
          onClick={() => fileUrl && onClickNext(fileUrl)}
        >
          <ArrowRight className="h-4 w-4" />
          {t("home:audio_tab.next_step_button_text")}
        </Button>
      </div>
    </>
  );
};
export default AudioRecordTab;
