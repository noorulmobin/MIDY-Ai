"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import HintButton from "../../hint-button";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { IoCameraSharp } from "react-icons/io5";

const PhotoCaptureTab = () => {
  const { t } = useClientTranslation();
  const hintStr = `
<p>${t("home:photo_tab.upload.hint_text_1")}</p>
<p>${t("home:photo_tab.upload.hint_text_2")}</p>
<p>${t("home:photo_tab.upload.hint_text_3")}</p>
<p>${t("home:photo_tab.upload.hint_text_4")}</p>
<p>${t("home:photo_tab.upload.hint_text_5")}</p>
<p>${t("home:photo_tab.upload.hint_text_6")}</p>
`;

  return (
    <>
      <div className="flex flex-row justify-end">
        <div className="flex h-9 flex-col justify-center">
          <HintButton htmlStr={hintStr} />
        </div>
      </div>
      <div className="mt-3 flex flex-row justify-between gap-4">
        <Button variant="secondary">100%</Button>
        <Slider />
        <Button variant="secondary">1:1</Button>
      </div>
      <div className="box-border flex flex-1 flex-col justify-center pt-4">
        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-300">
          <div className="text-md relative z-0 mx-auto my-0 flex h-24 w-24 cursor-pointer flex-col justify-center rounded-full border border-dashed border-gray-300 text-center text-gray-400 hover:border-primary hover:text-primary md:h-52 md:w-52">
            empty
          </div>
          <div className="mt-4 flex flex-col px-2 text-center text-sm text-gray-400"></div>
        </div>
      </div>
      <div className="mb-2 mt-2 flex flex-row justify-center gap-3">
        <Button variant="secondary">
          <IoCameraSharp className="mx-auto my-0 h-2/4 w-2/4 text-lg" />
          {t("home:photo_tab.record.capture_text")}
        </Button>
      </div>
    </>
  );
};
export default PhotoCaptureTab;
