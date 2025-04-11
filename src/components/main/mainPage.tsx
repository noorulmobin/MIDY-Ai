"use client";

import { useStepper, steps, Step } from "@/hooks/use-stepper";
import Header from "./header";
import { useState, useEffect } from "react";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import AudioSelectionPannel from "./audio-selection-pannel";
import PhotoSelectionPannel from "./photo-selection-pannel";
import VideoGennerationPannel from "./video-genneration-pannel";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { mainContext } from "@/stores/main-context";
import useAsyncStoreLanguage from "@/hooks/use-async-store-language";
import { useRouter } from "next/navigation"; // ✅ redirect hook

const MainPage = () => {
  useAsyncStoreLanguage();

  const { t } = useClientTranslation();
  const [loading, setLoading] = useState(false);
  const [generateVideo, setGenerateVideo] = useState(false);
  const infoStoreState = useLipsyncInfoStore();
  const [resetFlag, setResetFlag] = useState(0);

  const {
    nowMainTab,
    setNowMainTab,
    audioUrl,
    setAudioUrl,
    imageUrl,
    setImageUrl,
    setVideoUrl,
    reset,
    videoRatio,
  } = infoStoreState;

  const stepper = useStepper(nowMainTab);

  const onAudioPannelClickNext = (newAudioUrl: string) => {
    if (loading) return;
    setAudioUrl(newAudioUrl);
    stepper.goTo("photo-selection");
    setNowMainTab("photo-selection");
  };

  const onPhotoPannelClickNext = (newImageUrl: string) => {
    if (loading) return;
    setGenerateVideo(true);
    setVideoUrl(null);
    setImageUrl(newImageUrl);
    stepper.goTo("video-generation");
    setNowMainTab("video-generation");
  };

  const onClickStepper = (newId: Step) => {
    if (loading) return;
    if (newId !== "audio-selection" && audioUrl === null) {
      return;
    }
    stepper.goTo(newId);
    setNowMainTab(newId);
  };

  const onClickReset = () => {
    reset();
    stepper.goTo("audio-selection");
    setResetFlag(resetFlag + 1);
  };

  const [inputText, setInputText] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

    console.log("Current word count:", wordCount);

    if (wordCount >= 10) {
      console.log("Redirecting... Word count >= 10"); 
      router.push("/main"); 
    }
  }, [inputText, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-2xl">
      <Header />
      <mainContext.Provider
        value={{
          loading: loading,
          setLoading: (newFlag) => setLoading(newFlag),
          generateVideo: generateVideo,
          setGenerateVideo: (newFlag) => setGenerateVideo(newFlag),
          reset: () => onClickReset(),
        }}
      >
        <div
          className="container mx-auto flex h-full min-h-[500px] w-full max-w-[1024px] flex-1 flex-col items-center px-2 py-6"
          key={resetFlag + ""}
        >
          <div className="flex w-full flex-1 flex-col">
            <div
              className={`flex flex-1 flex-col ${
                stepper.current.id !== "audio-selection" && "hidden"
              }`}
            >
              <AudioSelectionPannel
                onClickNext={(newAudioUrl) =>
                  !loading && onAudioPannelClickNext(newAudioUrl)
                }
              />
            </div>

            <div
              className={`flex flex-1 flex-col ${
                stepper.current.id !== "photo-selection" && "hidden"
              }`}
            >
              <PhotoSelectionPannel
                onClickPrev={() =>
                  !loading && stepper.goTo("audio-selection")
                }
                onClickNext={(newImageUrl) =>
                  onPhotoPannelClickNext(newImageUrl)
                }
              />
            </div>

            <div
              className={`flex flex-1 flex-col ${
                stepper.current.id !== "video-generation" && "hidden"
              }`}
            >
              <VideoGennerationPannel
                imageUrl={imageUrl}
                audioUrl={audioUrl}
                videoRatio={videoRatio}
                onClickBack={() =>
                  !loading && stepper.goTo("photo-selection")
                }
              />
            </div>
          </div>
        </div>
      </mainContext.Provider>
    </div>
  );
};

export default MainPage;
