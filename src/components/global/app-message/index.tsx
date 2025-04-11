"use client";

import HostRenderer from "@/components/common/host-renderer";
import { useIsDark } from "@/hooks/global/use-is-dark";
import useHedraUploadErrorMessage from "@/hooks/use-hedra-upload-error-messages";
import { emitter, ToastHedraErrorInfo, ToastInfo } from "@/utils/mitt";
import { useEffect } from "react";
import toast, { CheckmarkIcon, ErrorIcon, Toaster } from "react-hot-toast";
const AppMessage = () => {
  const { isDark } = useIsDark();

  const { getErrorMessage: getHedraErrorMessage } =
    useHedraUploadErrorMessage();
  useEffect(() => {
    // Handler for success messages
    const handleToastSuccess = (successInfo: ToastInfo) => {
      toast(
        () => (
          <div className="flex items-center gap-2">
            <div>
              <CheckmarkIcon />
            </div>
            <div>
              <HostRenderer content={successInfo.message} />
            </div>
          </div>
        ),
        {
          id: successInfo.code.toString(),
          style: {
            backgroundColor: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
          },
        }
      );
    };

    // Handler for error messages
    const handleToastError = (errorInfo: ToastInfo) => {
      toast(
        () => (
          <div className="flex items-center gap-2">
            <div>
              <ErrorIcon />
            </div>
            <div>
              <HostRenderer content={errorInfo.message} />
            </div>
          </div>
        ),
        {
          id: errorInfo.code.toString(),
          style: {
            backgroundColor: isDark ? "hsl(var(--muted))" : "",
            color: isDark ? "hsl(var(--muted-foreground))" : "",
          },
        }
      );
    };

    // Handler for hedra api error messages
    const handleToastHedraError = (errorInfo: ToastHedraErrorInfo) => {
      const message = errorInfo.message || "";
      toast(
        () => (
          <div className="flex items-center gap-2">
            <div>
              <ErrorIcon />
            </div>
            <div>
              <HostRenderer content={getHedraErrorMessage(message)} />
            </div>
          </div>
        ),
        {
          id: message.toString(),
          style: {
            backgroundColor: isDark ? "hsl(var(--muted))" : "",
            color: isDark ? "hsl(var(--muted-foreground))" : "",
          },
        }
      );
    };

    // Listen for success and error events
    emitter.on("ToastSuccess", handleToastSuccess);
    emitter.on("ToastError", handleToastError);
    emitter.on("ToastHedraError", handleToastHedraError);

    // Cleanup listeners on component unmount
    return () => {
      emitter.off("ToastSuccess", handleToastSuccess);
      emitter.off("ToastError", handleToastError);
      emitter.off("ToastHedraError", handleToastHedraError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, getHedraErrorMessage]); // Dependency array ensures the effect is set up again if toast changes

  return <Toaster />;
};

export default AppMessage;
