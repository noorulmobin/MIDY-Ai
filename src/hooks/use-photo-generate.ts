import { apiKy } from "@/api";
import { createScopedLogger } from "@/utils";
import { useState } from "react";

interface SizeType {
  width: number;
  height: number;
}

export const photoGenerateConfigs = [
  {
    id: "flux-pro-v1.1",
  },
  {
    id: "flux-pro",
  },
  {
    id: "flux-dev",
  },
  {
    id: "flux-schnell",
  },
  {
    id: "flux-realism",
  },
  {
    id: "ideogram-generate",
  },
  {
    id: "recraft-v3",
  },
  {
    id: "302-sd-3.5-large",
  },
  {
    id: "302-sd-3.5-large-turbo",
  },
  {
    id: "302-sd-3.5-medium",
  },
  {
    id: "stability-sd3-large",
  },
  {
    id: "stability-sd3-medium",
  },
] as const;

export type TestIdType = (typeof photoGenerateConfigs)[number]["id"];

const ajaxFluxProV1_1 = async (prompt: string, size: SizeType) => {
  const url = "302/submit/flux-pro-v1.1";
  let result: string | null = null;
  const res = await apiKy
    .post(url, {
      json: {
        prompt: prompt,
        image_size: size,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
    })
    .json<{ images: { url: string }[] }>();
  result = res.images[0].url;
  return result;
};

const usePhotoGenderate = () => {
  const [loading, setLoading] = useState(false);
  const [] = useState();

  const logger = createScopedLogger("Home");

  const ajaxGenerateImageUrl = async (prompt: string, size: SizeType) => {
    setLoading(true);
    let result: string | null = null;
    try {
      result = await ajaxFluxProV1_1(prompt, size);
    } catch (error) {
      logger.error(error);
    }
    setLoading(false);
    return result;
  };
  return {
    loading,
    ajaxGenerateImageUrl,
  };
};
export { usePhotoGenderate };
