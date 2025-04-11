import { TabsValue } from "@/components/main/audio-selection-pannel/tabs-content";
import { useClientTranslation } from "./global/use-client-translation";

const useAudioHint = (activeTab: TabsValue) => {
  const { t } = useClientTranslation();

  if (activeTab === "record" || activeTab === "upload") {
    return `
<p>${t("home:audio_tab.user_upload.hint_text_1")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_2")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_3")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_4")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_5")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_6")}</p>
<p>${t("home:audio_tab.user_upload.hint_text_7")}</p>
    `;
  } else if (activeTab === "generate") {
    return `
<p>${t("home:audio_tab.generate.hint_text_1")}</p>
<p>${t("home:audio_tab.generate.hint_text_2")}</p>
<p>${t("home:audio_tab.generate.hint_text_3")}</p>
<p>${t("home:audio_tab.generate.hint_text_4")}</p>
`;
  } else {
    return "";
  }
};
export default useAudioHint;
