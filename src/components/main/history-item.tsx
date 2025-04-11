"use client";
import Image from "next/image";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import dayjs from "dayjs";
import useFileDownload from "@/hooks/use-file-download";
import { Loader2 } from "lucide-react";

const HistoryItem = (props: {
  createAt: number;
  url: string;
  imgUrl: string;
  onClickItem: () => void;
  onClickDeleteItem: () => void;
}) => {
  const { url, createAt, onClickItem, onClickDeleteItem, imgUrl } = props;

  const { download, downloading } = useFileDownload();
  return (
    <div className="mt-2 flex w-full flex-row justify-center">
      <div className="flex h-44 w-40 flex-col justify-center gap-1 overflow-hidden rounded-md border border-gray-300 text-center text-sm">
        <div className="relative flex-1 cursor-pointer rounded-sm bg-gray-400">
          <Image
            fill={true}
            src={imgUrl}
            alt="image"
            onClick={() => onClickItem()}
          />
        </div>
        <div className="mx-1 mb-1 flex flex-row justify-between">
          <div className="flex flex-col leading-4">
            <p>{dayjs(createAt).format("YYYY/MM/DD")}</p>
            <p>{dayjs(createAt).format("hh:mm")}</p>
          </div>
          <div className="flex flex-row gap-1">
            <div className="flex h-8 w-8 cursor-pointer flex-col justify-center rounded-sm border border-solid border-gray-400 hover:border-red-500 hover:text-red-500">
              <RiDeleteBin6Fill
                className="mx-auto my-0 block size-4"
                onClick={() => onClickDeleteItem()}
              />
            </div>
            <div
              className="flex h-8 w-8 cursor-pointer flex-col justify-center rounded-sm border border-solid border-gray-400 hover:border-primary hover:text-primary"
              onClick={() => download(url)}
            >
              {downloading ? (
                <Loader2 className="mx-auto my-0 block size-4" />
              ) : (
                <HiDownload className="mx-auto my-0 block size-4" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryItem;
