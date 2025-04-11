"use client";

import { env } from "@/env";
import { useAppStore } from "@/stores";
import { langToCountry } from "@/utils/302";
import { emitter } from "@/utils/mitt";
import ky from "ky";

// Error response type for 302 endpoints
export type ErrorResponse = {
  error: {
    err_code: number;
    [key: `message${string}`]: string;
    type: string;
  };
};

interface ErrorData {
  detail?: {
    code?: number;
    message?: string;
  };
}

export const apiKy = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
  hooks: {
    beforeRequest: [
      (request) => {
        const { apiKey, uiLanguage } = useAppStore.getState();

        request.headers.set(
          "Authorization",
          `Bearer ${apiKey ?? env.NEXT_PUBLIC_302_API_KEY}`
        );

        // Some 302 endpoints require the language to be set, so we set it here
        if (uiLanguage) {
          request.headers.set("Lang", langToCountry(uiLanguage));
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const res = await response.json<ErrorResponse>();
          // Emit a toast error if there is an error code
          const { uiLanguage } = useAppStore.getState();
          if (res.error && uiLanguage) {
            const countryCode =
              langToCountry(uiLanguage) === "en"
                ? null
                : langToCountry(uiLanguage);

            const message =
              res.error[
                `message${countryCode && countryCode !== "en" ? `_${countryCode}` : ""}`
              ];
            emitter.emit("ToastError", {
              code: res.error.err_code,
              message,
            });
          }
        }
      },
    ],
  },
});

export const hedraKy = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
  hooks: {
    beforeRequest: [
      (request) => {
        const { apiKey, uiLanguage } = useAppStore.getState();

        if (apiKey) {
          request.headers.set("Authorization", `Bearer ${apiKey}`);
        }

        // Some 302 endpoints require the language to be set, so we set it here
        if (uiLanguage) {
          request.headers.set("Lang", langToCountry(uiLanguage));
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const res = await response.json<ErrorResponse | ErrorData>();
          // Emit a toast error if there is an error code
          const { uiLanguage } = useAppStore.getState();
          if ("error" in res && res.error && uiLanguage) {
            const countryCode =
              langToCountry(uiLanguage) === "en"
                ? null
                : langToCountry(uiLanguage);

            const message =
              res.error[`message${countryCode ? `_${countryCode}` : ""}`];
            emitter.emit("ToastError", {
              code: res.error.err_code,
              message,
            });
          } else if (
            "detail" in res &&
            res.detail &&
            typeof res.detail.code !== "undefined"
          ) {
            emitter.emit("ToastHedraError", {
              message: res.detail.message,
            });
          }
        }
      },
    ],
  },
});

export const fileKy = ky.create({
  prefixUrl: env.NEXT_PUBLIC_FILE_API_URL,
  timeout: 60000,
  hooks: {
    beforeRequest: [
      (request) => {
        const { apiKey, uiLanguage } = useAppStore.getState();

        if (apiKey) {
          request.headers.set("Authorization", `Bearer ${apiKey}`);
        }

        // Some 302 endpoints require the language to be set, so we set it here
        if (uiLanguage) {
          request.headers.set("Lang", langToCountry(uiLanguage));
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const res = await response.json<ErrorResponse>();

          // Emit a toast error if there is an error code
          const { uiLanguage } = useAppStore.getState();
          if (res.error && uiLanguage) {
            const countryCode =
              langToCountry(uiLanguage) === "en"
                ? null
                : langToCountry(uiLanguage);

            const message =
              res.error[`message${countryCode ? `_${countryCode}` : ""}`];
            emitter.emit("ToastError", {
              code: res.error.err_code,
              message,
            });
          }
        }
      },
    ],
  },
});

export const dialogueKy = ky.create({
  prefixUrl: env.NEXT_PUBLIC_DIALOGUE_API_URL,
  timeout: false,
  hooks: {
    beforeRequest: [
      (request) => {
        const { apiKey } = useAppStore.getState();

        if (apiKey) {
          request.headers.set("Authorization", `Bearer ${apiKey}`);
        }
        const lang = useAppStore.getState().uiLanguage;
        if (lang) {
          request.headers.set("Lang", langToCountry(lang));
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const res = await response.json<ErrorResponse>();

          // Emit a toast error if there is an error code
          const { uiLanguage } = useAppStore.getState();
          if (res.error && uiLanguage) {
            const countryCode =
              langToCountry(uiLanguage) === "en"
                ? null
                : langToCountry(uiLanguage);

            const message =
              res.error[`message${countryCode ? `_${countryCode}` : ""}`];
            emitter.emit("ToastError", {
              code: res.error.err_code,
              message,
            });
          }
        } else if (response.ok) {
          const res = await response.json<{} | { result: ErrorResponse }>();
          // Emit a toast error if there is an error code
          const { uiLanguage } = useAppStore.getState();
          if ("result" in res && res.result && res.result.error && uiLanguage) {
            const resultRes = res.result;
            const countryCode =
              langToCountry(uiLanguage) === "en"
                ? null
                : langToCountry(uiLanguage);

            const message =
              resultRes.error[`message${countryCode ? `_${countryCode}` : ""}`];
            emitter.emit("ToastError", {
              code: resultRes.error.err_code,
              message,
            });
          }
        }
      },
    ],
  },
});
