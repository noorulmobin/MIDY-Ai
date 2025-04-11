import { defineStepper } from "@stepperize/react";

export const { useStepper, steps } = defineStepper(
  {
    id: "audio-selection",
    i18n: "home:stepper.audio_selection",
    description: "Select your audio",
  },
  {
    id: "photo-selection",
    i18n: "home:stepper.photo_selection",
    description: "Set your person photo",
  },
  {
    id: "video-generation",
    i18n: "home:stepper.video_generation",
    description: "Generate your video",
  }
);

export type Stepper = ReturnType<typeof useStepper>;
export type Step = ReturnType<typeof useStepper>["all"][number]["id"];
