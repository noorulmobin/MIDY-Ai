import { produce } from "immer";
import { create } from "zustand";
import { TabsValue as AudioTabsValue } from "@/components/main/audio-selection-pannel/tabs-content";
import { TabsValue as ImageTabsValue } from "@/components/main/photo-selection-pannel/tabs-content";
import { Step } from "@/hooks/use-stepper";
import { HistoryItemType as AudioGenerateHistoryItem } from "@/lib/audio-generate-history-db";
import { HistoryItemType as ImageGenerateHistoryItem } from "@/lib/photo-generate-history-db";
import { storeMiddleware } from "./middleware/default";
import { v4 as uuidv4 } from "uuid";

interface AudioUploadData {
  url: string | null;
}

interface AudioRecordData {
  url: string | null;
}

interface ImageUploadData {
  url: string | null;
  ratio: "";
}

interface MainDataType {
  taskId: string;
  audioUrl: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  videoRatio: string;
  nowMainTab: Step;
  nowAudioTab: AudioTabsValue;
  nowImageTab: ImageTabsValue;

  audioGenerateData: AudioGenerateHistoryItem;
  audioUploadData: AudioUploadData;
  audioRecordData: AudioRecordData;

  imageGenerateData: ImageGenerateHistoryItem;
  imageUploadData: ImageUploadData;
}

interface MainDataActions {
  setAudioUrl: (newUrl: string | null) => void;
  setImageUrl: (newUrl: string | null) => void;
  setVideoUrl: (newUrl: string | null) => void;
  setVideoRatio: (newRatio: string) => void;
  setNowMainTab: (newValue: Step) => void;
  setNowAudioTab: (newValue: AudioTabsValue) => void;
  setNowImageTab: (newValue: ImageTabsValue) => void;

  setAudioGenerateData: (newData: AudioGenerateHistoryItem) => void;
  setAudioUploadData: (newData: AudioUploadData) => void;
  setAudioRecordData: (newData: AudioRecordData) => void;

  setImageGenerateData: (newData: ImageGenerateHistoryItem) => void;
  setImageUploadData: (newData: ImageUploadData) => void;

  setHasHydrated: (value: boolean) => void;
  setTaskId: (value: string) => void;

  reset: () => void;
}

type UseLipsyncInfoStoreType = MainDataType & MainDataActions;

export type { MainDataType, MainDataActions };

export const initialState: Omit<MainDataType, "_hasHydrated"> = {
  taskId: uuidv4(),
  audioUrl: null,
  imageUrl: null,
  videoUrl: null,
  videoRatio: "1:1",
  nowMainTab: "audio-selection",
  nowAudioTab: "generate",
  nowImageTab: "upload",
  audioGenerateData: {
    id: "",
    audioUrl: "",
    inputText: "",
    provider: "",
    lang: "",
    speaker: "",
    createdAt: 0,
    updatedAt: 0,
  },
  audioUploadData: {
    url: null,
  },
  audioRecordData: {
    url: null,
  },
  imageGenerateData: {
    id: "",
    url: "",
    inputText: "",
    createdAt: 0,
    updatedAt: 0,
    ratio: "",
  },
  imageUploadData: {
    url: null,
    ratio: "",
  },
};

export const useLipsyncInfoStore = create<UseLipsyncInfoStoreType>()(
  storeMiddleware<MainDataType & MainDataActions>(
    (set) => ({
      ...initialState,
      _hasHydrated: false,
      reset: () => {
        set(() => ({
          ...initialState,
          taskId: uuidv4(),
        }));
      },
      setHasHydrated: (value) =>
        set(
          produce((state) => {
            state._hasHydrated = value;
          })
        ),
      setNowMainTab: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.nowMainTab = value;
          })
        ),
      setAudioUrl: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.audioUrl = value;
          })
        ),
      setVideoRatio: (value: string) =>
        set(
          produce<MainDataType>((state) => {
            state.videoRatio = value;
          })
        ),
      setImageUrl: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.imageUrl = value;
          })
        ),
      setNowAudioTab: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.nowAudioTab = value;
          })
        ),
      setNowImageTab: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.nowImageTab = value;
          })
        ),

      setAudioGenerateData: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.audioGenerateData = value;
          })
        ),
      setAudioUploadData: (value) => {
        set(
          produce<MainDataType>((state) => {
            state.audioUploadData = value;
          })
        );
      },
      setAudioRecordData: (value) => {
        set(
          produce<MainDataType>((state) => {
            state.audioRecordData = value;
          })
        );
      },
      setImageGenerateData: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.imageGenerateData = value;
          })
        ),
      setImageUploadData: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.imageUploadData = value;
          })
        ),
      setVideoUrl: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.videoUrl = value;
          })
        ),
      setTaskId: (value) =>
        set(
          produce<MainDataType>((state) => {
            state.taskId = value;
          })
        ),
    }),
    "lipsync_info_store"
  )
);
