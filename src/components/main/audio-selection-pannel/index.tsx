"use client";
import TabsContent, { TabsValue } from "./tabs-content";
import { useEffect, useState } from "react";
import GenerateTab from "./generate-tab";
import UserUploadTab from "./user-upload-tab";
import AudioRecordTab from "./audio-record-tab";
import useAudioHint from "@/hooks/use-audio-hint";
import HintButton from "../hint-button";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";

const AudioSelectionPannel = (props: {
  onClickNext: (newAudioUrl: string) => void;
  prefillText?: string; // <- added this prop
}) => {
  const { onClickNext: onClickNextParent, prefillText } = props;

  const infoStoreState = useLipsyncInfoStore();
  const { nowAudioTab, setNowAudioTab } = infoStoreState;

  const [ativeTab, setActiveTab] = useState<TabsValue>(
    prefillText ? "generate" : nowAudioTab
  );

  useEffect(() => {
    if (prefillText) {
      setActiveTab("generate");
      setNowAudioTab("generate");
    }
  }, [prefillText, setNowAudioTab]);

  const hintStr = useAudioHint(ativeTab);

  const onClickNext = (newAudioUrl: string) => {
    onClickNextParent(newAudioUrl);
  };

  return (
    <div className="relative mx-3 flex flex-1 flex-col">
      <div className="absolute left-0 top-0 z-10">
        <TabsContent
          value={ativeTab}
          onChange={(newValue) => {
            setActiveTab(newValue);
            setNowAudioTab(newValue);
          }}
        />
      </div>
      <div className="relative z-0 flex w-auto flex-row justify-end">
        <div className="flex h-9 flex-col justify-center">
          <HintButton htmlStr={hintStr} />
        </div>
      </div>
      <div className="relative z-20 flex flex-1 flex-col">
        <div
          className={`flex flex-1 flex-col ${ativeTab !== "generate" ? "hidden" : ""}`}
        >
          <GenerateTab
            onClickNext={(newAudioUrl) => onClickNext(newAudioUrl)}
            prefillText={prefillText} // <- pass down to GenerateTab
          />
        </div>
        <div
          className={`flex flex-1 flex-col ${ativeTab !== "upload" ? "hidden" : ""}`}
        >
          <UserUploadTab
            onClickNext={(newAudioUrl) => onClickNext(newAudioUrl)}
          />
        </div>
        <div
          className={`flex flex-1 flex-col ${ativeTab !== "record" ? "hidden" : ""}`}
        >
          <AudioRecordTab
            onClickNext={(newAudioUrl) => onClickNext(newAudioUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioSelectionPannel;
