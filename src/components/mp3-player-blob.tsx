"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getAudioDuration } from "@/lib/audio";

interface MP3PlayerProps {
  audioBlob: Blob;
  initialVolume?: number;
  initialSpeed?: number;
}

export default function MP3PlayerBlob({
  audioBlob,
  initialVolume = 1,
  initialSpeed = 1,
}: MP3PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const speed = initialSpeed;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioSrc, setAudioSrc] = useState(URL.createObjectURL(audioBlob));

  const togglePlay = () => {
    if (!audioBlob) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying((prev) => !prev);
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

      const duration = await getAudioDuration(audioBlob);
      setDuration(duration);

      audio.volume = volume;
      audio.playbackRate = speed;
    }
  }, [volume, speed, audioBlob]);

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
  }, [handleTimeUpdate, handleLoadedMetadata, audioBlob]);

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
      URL.revokeObjectURL(audioSrc);
    };
  }, [audioSrc]);

  useEffect(() => {
    setAudioSrc(URL.createObjectURL(audioBlob));
  }, [audioBlob]);

  return (
    <div className="flex w-full flex-row rounded-lg border bg-background p-2">
      <audio className="block" ref={audioRef} src={audioSrc} />

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
