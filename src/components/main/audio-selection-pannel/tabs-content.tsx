"use client";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { cn } from "@/lib/utils";
import { mainContext } from "@/stores/main-context";
import { Root, List, Trigger as RadixTabsTrigger } from "@radix-ui/react-tabs";
import { ReactNode, useContext } from "react";

declare type TabsValue = "generate" | "upload" | "record";
const Trigger = (props: {
  className?: string;
  value: string;
  children: ReactNode;
}) => {
  return (
    <RadixTabsTrigger
      {...props}
      className={cn(
        "mr-12 box-content block border-b-2 text-sm hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary md:text-base",
        props.className
      )}
    />
  );
};
const TabsContent = (props: {
  value: TabsValue;
  onChange: (newValue: TabsValue) => void;
}) => {
  const { value, onChange } = props;

  const { t } = useClientTranslation();

  const { loading } = useContext(mainContext);

  return (
    <Root
      value={value}
      onValueChange={(newValue) => !loading && onChange(newValue as TabsValue)}
    >
      <List
        className="inline-flex h-9 items-center justify-center p-1"
        color="crimson"
      >
        <Trigger value="generate">{t("home:audio_tab.generate.title")}</Trigger>
        <Trigger value="upload">{t("home:audio_tab.upload.title")}</Trigger>
        <Trigger value="record">{t("home:audio_tab.record.title")}</Trigger>
      </List>
    </Root>
  );
};
export type { TabsValue };
export default TabsContent;
