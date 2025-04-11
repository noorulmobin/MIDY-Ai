import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CharacterType } from "@/constants/values";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useAvatarFormStore } from "@/stores/slices/use-avatar-form-store";

export function CharacterTypeSelect() {
  const { t } = useClientTranslation();

  const characterType = useAvatarFormStore((state) => state.characterType);
  const updateField = useAvatarFormStore((state) => state.updateField);

  const handleChange = (value: string) => {
    updateField("characterType", value);
  };

  return (
    <div className="ml-[1px]">
      <div className="mb-1 text-sm">
        {t("home:photo_tab.character_type.tips")}
      </div>
      <Select value={characterType} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {CharacterType(t).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
