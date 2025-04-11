"use client";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { DialogTitle } from "@radix-ui/react-dialog";

const HintButton = (props: { htmlStr?: string }) => {
  const { htmlStr = "" } = props;
  const { t } = useClientTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <div>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  aria-label={t("home:audio_tab.generate.hint_button_text")}
                  variant="icon"
                  size="roundIconSm"
                >
                  <BsFillQuestionCircleFill className="size-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="text-violet11 data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  {t("home:audio_tab.generate.hint_text_hover")}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <div
          dangerouslySetInnerHTML={{ __html: htmlStr }}
          className="prose dark:prose-invert"
        />
      </DialogContent>
    </Dialog>
  );
};
export default HintButton;
