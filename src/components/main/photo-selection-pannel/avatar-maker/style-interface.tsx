/* eslint-disable @next/next/no-img-element */
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useAvatarFormStore } from "@/stores/slices/use-avatar-form-store";
import { PresetStyle, Tabs } from "@/constants";
import { useCompletion } from "ai/react";
import { emitter } from "@/utils/mitt";
import toast from "react-hot-toast";
import { createScopedLogger } from "@/utils";
import { useAppStore } from "@/stores";

const logger = createScopedLogger("StyleInterface");

export function StyleInterface() {
  const { t } = useClientTranslation();

  const { apiKey, modelName: model } = useAppStore.getState();

  const presetStyle = useAvatarFormStore((state) => state.presetStyle);
  const tab = useAvatarFormStore((state) => state.tab);
  const updateAll = useAvatarFormStore((state) => state.updateAll);

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [tabIndex, setTabIndex] = useState(1);
  const [selectStyle, setSelectStyle] = useState({
    label: "comic_style",
    value: "Comic Style",
    image: "/images/Comic Style.png",
  });

  const onSelectBlock = (item: {
    value: string;
    image: string;
    label: string;
  }) => {
    updateAll({ presetStyle: { ...item }, tab: tabIndex });
    window.localStorage.setItem("preset_style", JSON.stringify(item));
    setOpen(false);
  };

  const { complete, isLoading } = useCompletion({
    id: "generateCustomStyle",
    api: "/api/generateCustomStyle",
    onResponse: async (response) => {
      logger.info(response);
      if (!response.ok) {
        try {
          const errorData = await response.json();
          emitter.emit("ToastError", errorData.err_code || "");
        } catch (parseError) {
          logger.error(parseError);
          toast(t("home:photo_tab.custom_style.optimize_error"));
        }
      } else {
        const result = await response.json();
        window.localStorage.setItem("avatar_maker_custom_prompt", result.data);
        toast(t("home:photo_tab.custom_style.optimize_success"));
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    const data = window.localStorage.getItem("avatar_maker_custom_content");
    if (data) {
      setContent(data);
    }
  }, []);

  useEffect(() => {
    if (open) {
      if (presetStyle.value === "custom") {
        setSelectStyle({
          label: "comic_style",
          value: "Comic Style",
          image: "/images/Comic Style.png",
        });
      } else {
        setSelectStyle(presetStyle);
      }
      setTabIndex(tab);
    }
  }, [open, presetStyle, tab]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (isLoading) return;
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-[65px] w-full gap-5 bg-[hsl(var(--background))]"
        >
          <img
            className="absolute left-2 h-[80%]"
            src={presetStyle.image}
            alt={presetStyle.label}
          />
          <span className="text-lg font-bold">
            {t(`home:photo_tab.preset_style.image_styles.${presetStyle.label}`)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{t("home:photo_tab.preset_style.title")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex w-full items-center gap-5">
          {Tabs.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                if (isLoading) return;
                if (item.value === 2) {
                  updateAll({
                    presetStyle: {
                      value: "custom",
                      label: "custom",
                      image: "/images/custom.jpg",
                    },
                    tab: item.value,
                  });
                }
                setTabIndex(item.value);
              }}
              className={`cursor-pointer border-b-2 px-5 pb-1 border-[${tabIndex === item.value ? "hsl(var(--primary))" : "#fff"}] ${tabIndex === item.value && "text-[hsl(var(--primary))]"} `}
            >
              {t(`home:photo_tab.tabs.${item.label}`)}
            </div>
          ))}
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <div
            className={`${tabIndex == 1 ? "grid" : "hidden"} mm:grid-cols-2 grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`}
          >
            {PresetStyle.map((item) => (
              <div
                key={item.value}
                className={`hover:shadow-custom-purple group cursor-pointer overflow-hidden rounded-lg border transition-all hover:border-[hsl(var(--primary))] ${selectStyle.value === item.value && "shadow-custom-purple border-[hsl(var(--primary))]"} `}
                onClick={() => {
                  onSelectBlock(item);
                }}
              >
                <img src={`/images/${item.value}.png`} alt={item.label} />
                <div
                  className={`border-t p-2 text-sm group-hover:border-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary))] ${selectStyle.value === item.value && "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"} `}
                >
                  {t(`home:photo_tab.preset_style.image_styles.${item.label}`)}
                </div>
              </div>
            ))}
          </div>
          <div className={`${tabIndex == 2 ? "block" : "hidden"}`}>
            <div className="pb-4 text-sm text-[hsl(var(--primary))]">
              {t("home:photo_tab.custom_style.tab_custom_tips")}
            </div>
            <Textarea
              placeholder={t(
                "home:photo_tab.custom_style.custom_input_placeholder"
              )}
              rows={20}
              value={content}
              disabled={isLoading}
              onChange={(e) => {
                window.localStorage.setItem(
                  "avatar_maker_custom_content",
                  e.target.value
                );
                setContent(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          {tabIndex == 2 && (
            <Button
              disabled={tabIndex == 2 && (!content.trim() || isLoading)}
              onClick={() =>
                complete(content, {
                  body: {
                    apiKey,
                    model,
                  },
                })
              }
            >
              {!isLoading
                ? t("home:photo_tab.custom_style.submit")
                : t("home:photo_tab.custom_style.optimizing")}
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
