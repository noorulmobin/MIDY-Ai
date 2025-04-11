import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useAvatarFormStore } from "@/stores/slices/use-avatar-form-store";
import { IoTabletPortraitOutline } from "react-icons/io5";
import { IoTabletLandscapeOutline } from "react-icons/io5";
import { IoSquareOutline } from "react-icons/io5";

const sizeList = [
  {
    value: "default",
    width: 768,
    height: 1365,
    icon: ({ className }: { className: string }) => (
      <IoTabletPortraitOutline className={className} />
    ),
    ratio: "9:16",
  },
  {
    value: "square",
    width: 1024,
    height: 1024,
    icon: ({ className }: { className: string }) => (
      <IoSquareOutline className={className} />
    ),
    ratio: "1:1",
  },
  {
    value: "wideShape",
    width: 1365,
    height: 768,
    icon: ({ className }: { className: string }) => (
      <IoTabletLandscapeOutline className={className} />
    ),
    ratio: "16:9",
  },
];

export function SizeSelect() {
  const { t } = useClientTranslation();

  const updateField = useAvatarFormStore((state) => state.updateField);
  const size = useAvatarFormStore((state) => state.size);

  return (
    <div className="flex flex-col">
      <div className="mb-1 text-sm">{t("home:photo_tab.size")}</div>
      <div className="flex flex-wrap items-center justify-between">
        {sizeList.map(({ value, width, height, icon: Icon, ratio }) => (
          <div
            key={value}
            className="group cursor-pointer"
            onClick={() => {
              updateField("size", { value, width, height });
            }}
          >
            <div
              className={`flex justify-center rounded-sm border-2 p-1 transition-all group-hover:border-[hsl(var(--primary))] group-hover:bg-[#e8d0f3] ${size.value === value && "border-[hsl(var(--primary))] bg-[#e8d0f3]"}`}
            >
              <Icon
                className={`h-9 w-9 group-hover:text-[#a960ef] ${size.value === value && "text-[#a960ef]"} `}
              />
            </div>
            <div
              className={`mt-1 text-sm group-hover:text-[hsl(var(--primary))] ${size.value === value && "text-[hsl(var(--primary))]"}`}
            >
              {width} × {height}
            </div>
            <div
              className={`text-center text-xs group-hover:text-[hsl(var(--primary))] ${size.value === value && "text-[hsl(var(--primary))]"}`}
            >
              {`(${ratio})`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
