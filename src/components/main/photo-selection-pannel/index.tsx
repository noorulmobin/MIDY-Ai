"use client";

import { useState } from "react";
import TabsContent, { TabsValue } from "./tabs-content";
import PhotoGenerateTab from "./photo-generate-tab";
import PhotoUploadTab from "./photo-upload-tab";
import PhotoCaptureTab from "./photo-capture-tab";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";

const PhotoSelectionPannel = (props: {
  onClickPrev: () => void;
  onClickNext: (newImageUrl: string) => void;
}) => {
  const { onClickNext, onClickPrev } = props;

  const infoStoreState = useLipsyncInfoStore();
  const { nowImageTab, setNowImageTab } = infoStoreState;
  const [ativeTab, setActiveTab] = useState<TabsValue>(nowImageTab);

  return (
    <>
      {
        <div className="relative mx-3 flex flex-1 flex-col">
          <div className="absolute left-0 top-0 z-10">
            <TabsContent
              value={ativeTab}
              onChange={(newValue) => {
                setActiveTab(newValue);
                setNowImageTab(newValue);
              }}
            />
          </div>
          <div className="relative z-0 flex flex-col">
            <div
              className={`flex flex-1 flex-col ${ativeTab !== "upload" && "hidden"}`}
            >
              <PhotoUploadTab
                onClickPrev={() => onClickPrev()}
                onClickNext={(newImageUrl) => onClickNext(newImageUrl)}
              />
            </div>
            <div
              className={`flex flex-1 flex-col ${ativeTab !== "generate" && "hidden"}`}
            >
              <PhotoGenerateTab
                onClickPrev={() => onClickPrev()}
                onClickNext={(newImageUrl) => onClickNext(newImageUrl)}
              />
            </div>
            <div
              className={`flex flex-1 flex-col ${ativeTab !== "record" && "hidden"}`}
            >
              <PhotoCaptureTab />
            </div>
          </div>
        </div>
      }
    </>
  );
};
export default PhotoSelectionPannel;
