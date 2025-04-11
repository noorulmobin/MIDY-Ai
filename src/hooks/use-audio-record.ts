import { getAudioDuration } from "@/lib/audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { createScopedLogger } from "@/utils/logger";
import { emitter } from "@/utils/mitt";
import { convertToMp3 } from "@/utils/audio";

const logger = createScopedLogger("useAudioRecord");

const useAudioRecord = (config: {
  maxDuration: number;
  minDuration: number;
  afterRecording: (file: File) => void;
}) => {
  const { maxDuration, minDuration, afterRecording } = config;

  const [recordingDuration, setRecordingDuration] = useState(0);

  const [isRecording, setIsRecording] = useState(false);

  const chunks = useRef<Blob[]>([]);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [audioData, setAudioData] = useState<Blob>();

  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  }>();

  const { t } = useClientTranslation();

  const getSupportedMimeType = () => {
    const types = ["audio/webm", "video/mp4"];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    throw new Error("No supported audio format found");
  };

  const startRecording = async () => {
    setIsRecording(true);

    try {
      const mimeType = getSupportedMimeType();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mimeType === "video/mp4",
      });
      const recorder = new MediaRecorder(stream, {
        mimeType,
      });

      chunks.current = [];
      recorder.ondataavailable = (e) => chunks.current.push(e.data);

      recorder.onstop = async () => {
        try {
          const webmBlob = new Blob(chunks.current, { type: mimeType });
          const duration = await getAudioDuration(webmBlob);
          if (duration < minDuration) {
            emitter.emit("ToastError", {
              code: -1,
              message: t("home:use_audio_record.error_too_short"),
            });
            return;
          }
          if (duration > maxDuration) {
            emitter.emit("ToastError", {
              code: -1,
              message: t("home:use_audio_record.error_too_long"),
            });
            return;
          }

          // 转换为 MP3
          const mp3Blob = await convertToMp3(webmBlob);

          setAudioData(mp3Blob);
          setFileInfo({
            name: "recording.mp3",
            size: mp3Blob.size,
            type: "audio/mp3",
          });

          emitter.emit("ToastSuccess", {
            code: 0,
            message: t("home:use_audio_record.success_recording_ended"),
          });

          const audioFile = new File([mp3Blob], "recording.mp3", {
            type: "audio/mp3",
          });
          setAudioData(audioFile);
          afterRecording(audioFile);
        } catch (error) {
          logger.error(error);
          emitter.emit("ToastError", {
            code: -1,
            message: t(
              "home:use_audio_record.error_duration_calculation_failed"
            ),
          });
        }
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      logger.error(err);
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:use_audio_record.error_start_recording") + err,
      });
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setRecordingDuration(0);
    }
  }, [mediaRecorder]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= (maxDuration - 0) * 1000) {
            stopRecording();
            return 0;
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration, stopRecording]);

  return {
    recordingDuration,
    audioData,
    fileInfo,
    mediaRecorder,
    isRecording,
    startRecording,
    stopRecording,
    setAudioData,
    setFileInfo,
  };
};

export default useAudioRecord;
