"use client";
import { Pencil, ArrowDownToLine } from "lucide-react";
import { useState } from "react";

function RecordingPlayer({ recordingDuration, title, notes }: { recordingDuration: number; title: string; notes: string; }) {
  const zeroPadding = (duration: number) => {
    const durationString = duration.toString();
    if (durationString.length === 2) {
      return durationString;
    }

    return `0${durationString}`;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(
    `${zeroPadding(Math.floor(recordingDuration / 60))}:${zeroPadding(recordingDuration % 60)}`,
  );

  return (
    <div
      className={`bg-primary/15 outline-primary outline-2 ${isPlaying ? "" : "opacity-75"} hover:opacity-100 duration-100 rounded-sm hover:rounded-2xl flex flex-col md:flex-row items-center overflow-x-hidden`}
    >
      <div className="md:max-w-[min(50%,24rem)] p-2 px-3 flex items-center gap-2 overflow-clip">
        <div
          className="size-12 flex shrink-0 justify-center items-center"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-pause-icon lucide-circle-pause fill-none stroke-0 size-11 hover:size-12 hover:cursor-pointer hover:rotate-360 duration-300"
            >
              <circle cx="12" cy="12" r="10" className="fill-primary" />
              <line
                x1="10"
                x2="10"
                y1="15"
                y2="9"
                className="stroke-secondary stroke-2"
              />
              <line
                x1="14"
                x2="14"
                y1="15"
                y2="9"
                className="stroke-secondary stroke-2"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-play-icon lucide-circle-play fill-none stroke-0 size-11 hover:size-12 hover:cursor-pointer hover:rotate-360 duration-300"
            >
              <circle cx="12" cy="12" r="10" className="fill-primary" />
              <path
                className="fill-secondary"
                d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"
              />
            </svg>
          )}
        </div>
        <img
          src="https://img.magnific.com/free-vector/minimal-sound-wave-banner-design-background_1048-21256.jpg?semt=ais_hybrid&w=740&q=80"
          className="max-h-18 max-w-72"
        />
        <div className="bg-primary text-secondary text-md px-2 rounded-lg cursor-default">
          <span>{duration}</span>
        </div>
      </div>
      <div className="w-full md:h-full md:w-0 p-[0.05rem] bg-primary" />
      <div className="flex w-full px-3 py-2 md:py-0 justify-between overflow-hidden">
        <div className="flex flex-col h-full justify-center overflow-auto scrollbar-thin">
          <h5>{title}</h5>
          <div className="w-full overflow-auto scrollbar-thin"><span className="text-md">{notes}</span></div>
        </div>
        <div className="flex justify-center items-center pl-3">
          <Pencil className="stroke-primary hover:stroke-secondary hover:cursor-pointer hover:-rotate-7 duration-100" />
          <ArrowDownToLine className="stroke-primary hover:stroke-secondary hover:cursor-pointer duration-100 hover:-mb-1" />
        </div>
      </div>
    </div>
  );
}

export default RecordingPlayer;
