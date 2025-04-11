"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import HintButton from "../../hint-button";
import { Button } from "@/components/ui/button";
import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
import useImageUpload from "@/hooks/use-image-upload";
import { ImgContent } from "../img-content";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { RatioSelectorValue } from "../img-content/ratio-selector";
import { useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import DownloadButton from "../../download-button";
import AvatarEditor from "react-avatar-editor";
import { mainContext } from "@/stores/main-context";
import SKChaseLoading from "@/components/ui/sk-chase-loading";
import { emitter } from "@/utils/mitt";
import { AvatarMaker } from "../avatar-maker/avatar-maker";

const PhotoUploadTab = (props: {
  onClickPrev: () => void;
  onClickNext: (newAudioUrl: string) => void;
}) => {
  const { onClickNext, onClickPrev } = props;
  const { loading: contextLoading, setLoading: setContextLoading } =
    useContext(mainContext);
  const { t } = useClientTranslation();
  const hintStr = `
<p>${t("home:photo_tab.upload.hint_text_1")}</p>
<p>${t("home:photo_tab.upload.hint_text_2")}</p>
<p>${t("home:photo_tab.upload.hint_text_3")}</p>
<p>${t("home:photo_tab.upload.hint_text_4")}</p>
<p>${t("home:photo_tab.upload.hint_text_5")}</p>
<p>${t("home:photo_tab.upload.hint_text_6")}</p>
`;

  const { loading, upload } = useImageUpload();

  const infoStoreState = useLipsyncInfoStore();

  const { imageUploadData, setImageUploadData, setVideoRatio } = infoStoreState;

  const [imageUrl, setImageUrl] = useState<string | null>(imageUploadData.url);

  const [ratio, setRatio] = useState<RatioSelectorValue>(
    (imageUploadData && (imageUploadData.ratio as RatioSelectorValue)) || "1:1"
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const result = await upload(file);
      if (!result) {
        emitter.emit("ToastError", {
          code: -1,
          message: t("home:audio_tab.upload.upload_error"),
        });
        return;
      }
      setImageUrl(result);
      setImageUploadData({
        ...imageUploadData,
        url: result,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onClickDelete = () => {
    setImageUrl(null);
    setImageUploadData({
      ...imageUploadData,
      url: null,
    });
  };

  const onChangeImage = async (file: File) => {
    const result = await upload(file);
    if (!result) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:audio_tab.upload.upload_error"),
      });
      return;
    }
    setImageUrl(result);
    setImageUploadData({
      ...imageUploadData,
      url: result,
    });
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
      setContextLoading(true);
      const url = await upload(file);
      setContextLoading(false);
      if (!url) return;
      onClickNext(url);
    });
  };

  return (
    <>
      <input
        className="hidden"
        {...getInputProps({
          accept: ".jpeg,.jpg,.png,.webp",
          multiple: false,
        })}
      />
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
        // useless
        onChangeImage={(file) => onChangeImage(file)}
      >
        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-300">
          <div
            className={cn(
              "text-md relative z-0 mx-auto mt-4 flex h-24 w-24 cursor-pointer flex-col justify-center rounded-full border border-dashed border-gray-300 text-center text-gray-400 hover:border-primary hover:text-primary md:h-52 md:w-52",
              isDragActive ? `border-primary text-primary` : null
            )}
            {...(loading ? {} : getRootProps())}
          >
            {loading ? (
              <Loader2 className="mx-auto my-0 h-2/4 w-2/4 animate-spin text-lg" />
            ) : (
              <MdAddPhotoAlternate className="mx-auto my-0 h-2/4 w-2/4 text-lg" />
            )}
          </div>
          <div className="my-4 flex flex-col px-2 text-center text-sm text-gray-400">
            <p>{t("home:photo_tab.upload.usage_text_1")}</p>
            <p>{t("home:photo_tab.upload.usage_text_2")}</p>
          </div>
        </div>
      </ImgContent>
      <div className="mb-2 mt-2 flex flex-row justify-between">
        <AvatarMaker
          imageSrc={imageUrl || ""}
          disabled={!imageUrl}
          onImageChange={(image) => {
            setImageUrl(image);
            setImageUploadData({
              ...imageUploadData,
              url: image,
            });
          }}
        />

        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            disabled={!imageUrl}
            onClick={() => onClickDelete()}
          >
            <MdDelete className="size-4" />
            {t("home:photo_tab.upload.delete_text")}
          </Button>
          <DownloadButton fileUrl={imageUrl} />
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
      <SKChaseLoading loading={contextLoading} />
    </>
  );
};
export default PhotoUploadTab;
