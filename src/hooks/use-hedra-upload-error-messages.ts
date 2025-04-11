import { useClientTranslation } from "./global/use-client-translation";

const useHedraUploadErrorMessage = () => {
  const { t } = useClientTranslation();

  const hedraErrorMessages = [
    {
      code: "none",
      message: t("home:generation_tab.hedra_error.-1"),
    },
    {
      code: "underage",
      message: t("home:generation_tab.hedra_error.underage"),
    },
    {
      code: "celebrity",
      message: t("home:generation_tab.hedra_error.celebrity"),
    },
    // add more hedra error messages
  ];

  const getErrorMessage = (message: string) => {
    const resultItem =
      hedraErrorMessages.find((item) => message.includes(item.code)) ||
      hedraErrorMessages[0];
    return resultItem.message;
  };
  return {
    getErrorMessage,
  };
};
export default useHedraUploadErrorMessage;
