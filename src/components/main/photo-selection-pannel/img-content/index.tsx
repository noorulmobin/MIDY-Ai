"use client";
import {
  getFlulxSize,
  RatioSelector,
  RatioSelectorValue,
} from "./ratio-selector";
import { Slider } from "@/components/ui/slider";
import { forwardRef, ReactNode, useEffect, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { ZoomSelector } from "./zoom-selector";
import { cn } from "@/lib/utils";
import ky from "ky";
import SKChaseLoading from "@/components/ui/sk-chase-loading";

interface PropsType {
  imageUrl: string | null;
  ratio: RatioSelectorValue;
  onChangeRatio: (newRatio: RatioSelectorValue) => void;
  onChangeImage: (newImageUrl: File) => void;
  children: ReactNode;
}

const ImgContent = forwardRef<AvatarEditor, PropsType>((props, ref) => {
  const {
    imageUrl,
    children,
    ratio,
    onChangeRatio: onChangeRatioParent,
  } = props;

  const [scale, setScale] = useState(1);

  const [loading, setLoading] = useState(false);

  const [imageLoadedFile, setImageLoadedFile] = useState<File | null>(null);

  const size = getFlulxSize(ratio);

  const [renderSize, setRenderSize] = useState(size);

  const onChangeZoom = (newValue: number[]) => {
    const resultValue = newValue[0];
    setScale(resultValue);
    return;
  };

  const onChangeRatio = (newRatio: RatioSelectorValue) => {
    // setRatio(newRatio);
    onChangeRatioParent(newRatio);
    const newSize = getFlulxSize(newRatio);
    updateEditorZoom(newSize);
  };

  const updateEditorZoom = async (newSize = size) => {
    let innerWidth = document.body.clientWidth;

    if (innerWidth > 1024) {
      innerWidth = 1024;
    }

    const width = innerWidth - 40;

    const zoom = width / newSize.width;

    const newHeight = newSize.height * zoom;

    const result = {
      width: width,
      height: newHeight,
    };

    setRenderSize(result);
  };

  const resize = () => {
    updateEditorZoom();
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    updateEditorZoom();
    return () => {
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ajaxDownloadImg = async (url: string) => {
    const urlObject = new URL(url);
    const pathName = urlObject.pathname;
    const filename = pathName.split("/").pop() || "";
    const fileSuffix = filename.split(".")[1];

    setImageLoadedFile(null);
    setLoading(true);
    const response = await ky.get(url);
    const blob = await response.blob();
    const file = new File([blob], `myCanvasImage.${fileSuffix}`, {
      type: `image/${fileSuffix}`,
    });
    setImageLoadedFile(file);
    setLoading(false);
  };
  useEffect(() => {
    if (!imageUrl) {
      return;
    }
    ajaxDownloadImg(imageUrl);
  }, [imageUrl]);

  return (
    <>
      <div className="mt-3 flex flex-row flex-wrap justify-between gap-4">
        <ZoomSelector
          value={scale + ""}
          onChange={(newValue) => onChangeZoom([Number(newValue)])}
        />
        <Slider
          value={[scale]}
          max={2.5}
          step={0.1}
          min={1}
          onValueChange={(newValue: number[]) => onChangeZoom(newValue)}
          className="max-w-full flex-1"
        />
        {/* <Button variant="secondary">1:1</Button> */}
        <RatioSelector
          value={ratio}
          onChange={(newValue) => onChangeRatio(newValue)}
        />
      </div>
      <div className="box-border flex flex-1 flex-col justify-center pt-4">
        <div
          className={cn(
            "relative box-border flex w-full flex-col justify-center rounded-2xl",
            !imageUrl || !imageLoadedFile ? "border border-gray-300" : ""
          )}
        >
          {imageUrl && imageLoadedFile ? (
            <div
              className="relative flex w-full flex-row justify-center overflow-hidden rounded-2xl bg-gray-300 shadow-md dark:bg-black"
              // style={{
              //   aspectRatio: size.width / size.height
              // }}
            >
              <AvatarEditor
                ref={ref}
                image={imageLoadedFile}
                width={renderSize.width}
                height={renderSize.height}
                border={0}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
              />
            </div>
          ) : (
            <>{children}</>
          )}
          <SKChaseLoading loading={loading} />
        </div>
      </div>
    </>
  );
});
ImgContent.displayName = "ImgContent";
export { ImgContent };
