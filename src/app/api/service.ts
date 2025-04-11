import ky from "ky";

interface IPrams {
  main_face_image: string;
  prompt?: string;
  width?: number;
  height?: number;
  num_steps?: number;
  start_step?: number;
  guidance_scale?: number;
  id_weight?: number;
  num_outputs?: number;
  negative_prompt?: string;
  seed?: number;
  true_cfg?: number;
  max_sequence_length?: number;
  output_format?: number;
  output_quality?: number;
}

export const generate = async (apiKey: string, params: IPrams) => {
  return ky(`${process.env.NEXT_PUBLIC_API_URL}/302/submit/flux-selfie`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    },
    body: JSON.stringify(params),
    timeout: false,
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(async (error) => {
      if (error.response) {
        try {
          const errorData = await error.response.json();
          return errorData;
        } catch (parseError) {
          return { error: parseError };
        }
      } else {
        return { error: error.message || "Unknown error" };
      }
    });
};

export const getFetch = (id: string, apiKey: string): Promise<any> => {
  return ky(`${process.env.NEXT_PUBLIC_API_URL}/302/task/${id}/fetch`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    },
    timeout: false,
  })
    .then((res) => res.json())
    .then(async (res: any) => {
      if (res?.status === "starting") {
        await delay(5000);
        return getFetch(id, apiKey); // 递归调用自身
      } else {
        return res;
      }
    })
    .catch(async (error) => {
      if (error.response) {
        try {
          const errorData = await error.response.json();
          return errorData;
        } catch (parseError) {
          return { error: parseError };
        }
      } else {
        return { error: error.message || "Unknown error" };
      }
    });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
