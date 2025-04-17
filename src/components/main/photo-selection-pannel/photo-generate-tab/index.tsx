"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import HintButton from "../../hint-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useRef, useState } from "react";
import { apiKy } from "@/api";
import SKChaseLoading from "@/components/ui/sk-chase-loading";
import { createScopedLogger } from "@/utils";
import HistoryButton from "./history-button/index";
import {
  getMaxId,
  HistoryItemType,
  save,
} from "@/lib/photo-generate-history-db";
import dayjs from "dayjs";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { mainContext } from "@/stores/main-context";
import { useAppStore } from "@/stores";
import { env } from "@/env";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getFlulxSize,
  RatioSelectorValue,
} from "../img-content/ratio-selector";
import { ImgContent } from "../img-content";
import { AiFillPicture } from "react-icons/ai";
import DownloadButton from "../../download-button";
import AvatarEditor from "react-avatar-editor";
import useImageUpload from "@/hooks/use-image-upload";
import { emitter } from "@/utils/mitt";
import useAjaxPost from "@/hooks/use-ajax-post";
import { useSearchParams } from "next/navigation";


const getPrompt = (content: string) => `
Your task is to optimize and enhance the user's image description to ensure it is suitable for generating a high-quality image using Midjourney or other Diffusion models.
- Translate the input into accurate and natural-sounding English, regardless of the original language.
- Based on the user’s description, enrich it with additional details where necessary, especially if the original input is too simple.
- Use well-known IP names if appropriate, and ensure the description is detailed and precise.
- Assign higher weight to the main subject of the image.
- Avoid using introductory phrases such as "This image shows" or "In the scene." Steer clear of terms that describe cultural values or spirituality, like "creating a xxx atmosphere" or "enhancing the xxx of the scene."
- Avoid ambiguous expressions, and focus solely on describing the scene with clear, concrete terms.Refrain from over-explaining abstract or indescribable elements.
- Ensure that the image represents a clear, frontal portrait whenever possible, with a style that leans towards realism, making it suitable for high-quality AI generation.
<text>
${content}
</text>
-Always return the result in plain text format, with no additional content.
`;

const PhotoGenerateTab = (props: {
  onClickPrev: () => void;
  onClickNext: (newAudioUrl: string) => void;
}) => {
  const { onClickNext, onClickPrev } = props;
  const { t } = useClientTranslation();
  const searchParams = useSearchParams();
  const initialText = searchParams?.get("input") || "";

  const hintStr = `
<p>${t("home:photo_tab.upload.hint_text_1")}</p>
<p>${t("home:photo_tab.upload.hint_text_2")}</p>
<p>${t("home:photo_tab.upload.hint_text_3")}</p>
<p>${t("home:photo_tab.upload.hint_text_4")}</p>
<p>${t("home:photo_tab.upload.hint_text_5")}</p>
<p>${t("home:photo_tab.upload.hint_text_6")}</p>
`;
  const generateHintStr = `
<p>${t("home:photo_tab.upload.generate_hint_1")}</p>
<p>${t("home:photo_tab.upload.generate_hint_2")}</p>
<p>${t("home:photo_tab.upload.generate_hint_3")}</p>
<p>${t("home:photo_tab.upload.generate_hint_4")}</p>
<p>${t("home:photo_tab.upload.generate_hint_5")}</p>
<p>${t("home:photo_tab.upload.generate_hint_6")}</p>
<p>${t("home:photo_tab.upload.generate_hint_8")}</p>
<p>${t("home:photo_tab.upload.generate_hint_8")}</p>
<p>${t("home:photo_tab.upload.generate_hint_9")}</p>
`;
  const maxInputLength = 500;
  const logger = createScopedLogger("Home");

  const { loading, setLoading } = useContext(mainContext);

  const modelName = useAppStore().modelName;

  const infoStoreState = useLipsyncInfoStore();

  const { imageGenerateData, setImageGenerateData, setVideoRatio } =
    infoStoreState;

  const [imageUrl, setImageUrl] = useState<string | null>(
    imageGenerateData.url
  );

  const [inputValue, setInputValue] = useState<string>(
    imageGenerateData.inputText
  );

  const [ratio, setRatio] = useState<RatioSelectorValue>(
    (imageGenerateData.ratio as RatioSelectorValue) || "1:1"
  );

  const { upload } = useImageUpload();

  const size = getFlulxSize(ratio);

  const textareaLimitText = `${inputValue.length} / ${maxInputLength}`;

  const { doAjax: ajaxGetTranslatedPromptNew } = useAjaxPost(
    apiKy,
    `chat/completions`
  );

  const ajaxGetTranslatedPrompt = async (originPrompt: string) => {
    const paramPrompt = getPrompt(originPrompt);

    const { result: resultRaw, errorHint } = await ajaxGetTranslatedPromptNew<{
      output: string;
    }>({
      json: {
        // model:  "claude-3-5-sonnet-20241022" || modelName || env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
        model: modelName || env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
        message: paramPrompt,
      },
    });

    const result: string | null = resultRaw
      ? resultRaw.output.replace(/\\'/g, "'")
      : null;
    return {
      result: result,
      errorHint: errorHint,
    };
  };

  const ajaxGenerateImageUrl = async (
    prompt: string,
    size: { width: number; height: number }
  ) => {
    const url = "302/submit/flux-pro-v1.1";
    let result: string | null = null;
    try {
      const res = await apiKy
        .post(url, {
          json: {
            prompt: prompt,
            image_size: size,
            num_inference_steps: 28,
            guidance_scale: 3.5,
          },
        })
        .json<{ images: { url: string }[] }>();
      result = res.images[0].url;
    } catch (error) {
      logger.error(error);
    }
    return result;
  };

  const onClickGenerate = async () => {
    setLoading(true);
    const inputValueResult = inputValue || "Regal princess with a tiara";
    const { result: resultPrompt, errorHint } =
      await ajaxGetTranslatedPrompt(inputValueResult);
    if (!resultPrompt) {
      if (errorHint) {
        emitter.emit("ToastError", {
          code: -1,
          message: t("home:photo_tab.generate.prompt_error_text"),
        });
      }
      setLoading(false);
      return;
    }
    const imageUrl = await ajaxGenerateImageUrl(resultPrompt, size);
    if (!imageUrl) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:photo_tab.generate.generate_error_text"),
      });
      setLoading(false);
      return;
    } else {
      emitter.emit("ToastSuccess", {
        code: -1,
        message: t("home:photo_tab.generate.generate_success_text"),
      });
    }
    const historyItem: HistoryItemType = {
      id: (await getMaxId()) + 1 + "",
      url: imageUrl,
      inputText: inputValue,
      ratio: ratio,
      createdAt: dayjs().valueOf(),
      updatedAt: dayjs().valueOf(),
    };
    await save(historyItem);
    setVideoRatio(ratio);
    setImageGenerateData(historyItem);
    setImageUrl(imageUrl);
    setLoading(false);
  };

  const onClickHistoryItem = (historyItem: HistoryItemType) => {
    setVideoRatio(historyItem.ratio);
    setImageUrl(historyItem.url);
    setInputValue(historyItem.inputText);
    setImageGenerateData(historyItem);
  };

  const editor = useRef<AvatarEditor>(null);

  const onClickGenderateButton = async () => {
    if (!editor.current) return;
    const res = editor.current.getImageScaledToCanvas();
    res.toBlob(async (blob) => {
      if (!blob || !imageUrl) return;
      const urlObject = new URL(imageUrl);
      const pathName = urlObject.pathname;
      const filename = pathName.split("/").pop() || "";
      const fileSuffix = filename.split(".")[1];

      const file = new File([blob], `scale-${filename}`, {
        type: `image/${fileSuffix}`,
      });
      setLoading(true);
      const url = await upload(file);
      setLoading(false);
      if (!url) return;
      onClickNext(url);
    });
  };

  return (
    <>
      <div className="flex flex-row justify-end">
        <div className="flex h-9 flex-col justify-center">
          <HintButton htmlStr={hintStr} />
        </div>
      </div>
      <ImgContent
        ref={editor}
        ratio={ratio}
        onChangeRatio={(newRatio) => {
          setRatio(newRatio);
          setVideoRatio(newRatio);
        }}
        imageUrl={imageUrl}
        onChangeImage={() => {}}
      >
        <div className="text-md relative z-0 mx-auto my-0 mt-3 flex h-24 w-24 flex-col justify-center rounded-full border border-dashed border-gray-300 text-center text-gray-400 md:h-48 md:w-48">
          <AiFillPicture className="mx-auto my-0 h-2/4 w-2/4 text-lg" />
        </div>
        <div className="mb-3 mt-4 flex flex-col text-center text-sm text-gray-400 ">
          <p>{t("home:photo_tab.generate.usage_text_1")}</p>
        </div>
      </ImgContent>
      <div className="mb-2 mt-2 flex flex-row justify-end gap-3">
        <HintButton htmlStr={generateHintStr} />
        <a
          href={imageUrl || ""}
          target="_blank"
          onClick={(e) => {
            if (!imageUrl) return;
            e.preventDefault();
          }}
        >
          <DownloadButton fileUrl={imageUrl} />
        </a>
      </div>
      <div className="mb-2 mt-2 flex min-h-40 flex-row justify-end gap-3 border gray-red-600">

        <div className="relative flex flex-1 flex-col">

          <div className="md:text-md  bottom-2 right-3 text-sm">
          <div className="mt-4 w-full max-w-md">
            <div className="h-[130px] w-[30rem] ml-[0px] rounded  px-4 py-2">
              {initialText}
            </div>
          </div>
            {textareaLimitText}
          </div>
          <Textarea
            className="flex-1 resize-none pb-8"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={maxInputLength}
            // placeholder={t("home:photo_tab.generate.textarea_placeholder")}

          />
        </div>
      </div>
      <div className="mb-2 mt-2 flex flex-row flex-wrap justify-between gap-2">
        <HistoryButton
          onClickHistoryItem={(newHistoryItem) =>
            onClickHistoryItem(newHistoryItem)
          }
        />
        <div className="flex flex-1 flex-row flex-wrap justify-end gap-3">
          <Button className="gap-2" onClick={() => onClickGenerate()}>
            <ArrowRight className="h-4 w-4" />
            {t("home:photo_tab.generate.generate_text")}
          </Button>
        </div>
      </div>
      <div className="mt-2 flex flex-row flex-wrap justify-center gap-4">
        <Button
          className="gap-2"
          variant="secondary"
          onClick={() => onClickPrev()}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("home:photo_tab.prev_step_button_text")}
        </Button>
        <Button
          className="gap-2"
          disabled={!imageUrl}
          onClick={() => imageUrl && onClickGenderateButton()}
        >
          {t("home:photo_tab.next_step_button_text")}
          <ArrowRight className="size-4" />
        </Button>
      </div>
      <SKChaseLoading loading={loading} />
    </>
  );
};
export default PhotoGenerateTab;
