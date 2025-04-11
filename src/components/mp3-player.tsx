"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getAudioDuration } from "@/lib/audio";

interface MP3PlayerProps {
  audioSrc: string;
  initialVolume?: number;
  initialSpeed?: number;
}

export default function MP3Player({
  audioSrc,
  initialVolume = 1,
  initialSpeed = 1,
}: MP3PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const speed = initialSpeed;
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioSrc) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(async () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const blobUrl = audio.src;

      // Fetch the Blob from the Blob URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const duration = await getAudioDuration(blob);
      setDuration(duration);

      audio.volume = volume;
      audio.playbackRate = speed;
    }
  }, [volume, speed]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // const handleSpeedChange = (value: number[]) => {
  //   const newSpeed = value[0];
  //   setSpeed(newSpeed);
  //   if (audioRef.current) {
  //     audioRef.current.playbackRate = newSpeed;
  //   }
  // };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [handleTimeUpdate, handleLoadedMetadata, audioSrc]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="flex w-full flex-row rounded-lg border bg-background p-2">
      <audio className="hidden" ref={audioRef} src={audioSrc} />

      {/* play */}
      <Button
        onClick={togglePlay}
        variant="outline"
        size="icon"
        className="mr-2"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* slider */}
      <div className="flex flex-1 items-center space-x-2">
        <span className="mr-3 text-sm">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="flex-grow"
        />
        <span className="ml-2 text-sm">{formatTime(duration)}</span>
      </div>
      {/* volume */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="ml-2 mr-2"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="w-40 rounded-md border border-input bg-white p-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex flex-1 items-center space-x-2">
                  {volume > 0 ? (
                    <Volume2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <VolumeX className="h-4 w-4 shrink-0" />
                  )}
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="max-w-24 flex-1"
                  />
                </div>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
