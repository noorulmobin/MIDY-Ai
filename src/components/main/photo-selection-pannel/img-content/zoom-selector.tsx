"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const ratioValues = ["1", "1.25", "1.5", "1.75", "2", "2.25", "2.5"] as const;

export type ZoomSelectorValue = (typeof ratioValues)[number];

const getRenderText = (zoomValue: number) => {
  return Number(zoomValue * 100).toFixed(0) + "%";
};

const ZoomSelector = (props: {
  value: string;
  onChange: (newValue: ZoomSelectorValue) => void;
}) => {
  const { value: value, onChange } = props;

  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as ZoomSelectorValue)}
    >
      <SelectTrigger className="w-24">
        {getRenderText(Number(value))}
      </SelectTrigger>
      <SelectContent>
        {ratioValues.map((item, index) => (
          <SelectItem value={item} key={index}>
            {getRenderText(Number(item))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { ZoomSelector };
