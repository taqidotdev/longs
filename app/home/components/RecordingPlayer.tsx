"use client";
import {
  Pencil,
  ArrowDownToLine,
  LoaderCircle,
  ArrowBigDownDash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { createClient } from "@/lib/supabase/client";
import { useWavesurfer } from "@wavesurfer/react";

function RecordingPlayer({
  recordingDuration,
  title,
  notes,
  id,
  userId,
  peaks,
  refresh,
}: {
  recordingDuration: number;
  title: string;
  notes: string;
  id: number;
  userId: string;
  peaks: number[][];
  refresh: () => void;
}) {
  const supabase = createClient();

  supabase.from("recordings").select().eq("id", id).then();

  const [modalHidden, setModalHidden] = useState(true);
  const [modalAction, setModalAction] = useState("");
  const [newTitle, setNewTitle] = useState(title);
  const [newNotes, setNewNotes] = useState(notes);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(formatDuration(recordingDuration));
  const [recordingUrl, setRecordingUrl] = useState("");

  const waveformRef = useRef(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: waveformRef,
    waveColor: "#f6e8e4",
    progressColor: "#e1ac9d",
    cursorWidth: 0,
    barWidth: 2.5,
    barRadius: 2,
    barGap: 2,
    height: "auto",
    url: recordingUrl,
    peaks,
    duration: 36,
  });

  const handleTimeUpdate = () => {
    const dur = Math.floor(currentTime ?? recordingDuration);
    console.log(dur);
    setDuration(formatDuration(dur));
  };

  useEffect(() => {
    console.log(isPlaying);
    wavesurfer?.on("timeupdate", handleTimeUpdate);
    wavesurfer?.on("finish", () => {
      setDuration(
        `${zeroPadding(Math.floor(recordingDuration / 60))}:${zeroPadding(recordingDuration % 60)}`,
      );
    });
    return () => {};
  });

  const fetchAudio = async () => {
    setIsLoading(true);
    const recording = await fetch(
      (
        await supabase.storage
          .from("audios")
          .createSignedUrl(`${userId}/${id}.wav`, 120)
      ).data?.signedUrl ?? "",
    );

    setRecordingUrl(URL.createObjectURL(await recording.blob()));
    setIsLoading(false);
  };

  const handlePlay = async () => {
    if (recordingUrl && wavesurfer) {
      await wavesurfer.playPause();

      return;
    }
    console.log("hello");

    await fetchAudio();
  };

  return (
    <>
      <div
        className={`bg-primary/15 outline-primary outline-2 ${isPlaying ? "" : "opacity-60"} hover:opacity-100 duration-100 rounded-sm hover:rounded-2xl flex flex-col md:flex-row items-center overflow-x-hidden`}
      >
        <div className="md:min-w-90 p-2 px-3 flex items-center gap-2 overflow-clip">
          <div
            className="size-12 flex shrink-0 justify-center items-center"
            onClick={() => {
              handlePlay();
            }}
          >
            {recordingUrl ? (
              isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-pause-icon lucide-circle-pause fill-none stroke-0 size-11 hover:size-12 hover:cursor-pointer hover:rotate-180 duration-300"
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
                  className="lucide lucide-circle-play-icon lucide-circle-play fill-none stroke-0 size-11 hover:size-12 hover:cursor-pointer hover:rotate-180 duration-300"
                >
                  <circle cx="12" cy="12" r="10" className="fill-primary" />
                  <path
                    className="fill-secondary"
                    d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"
                  />
                </svg>
              )
            ) : isLoading ? (
              <LoaderCircle className="animate-spin stroke-primary size-7" />
            ) : (
              <div className="bg-primary size-9 rounded-full flex justify-center items-center hover:cursor-pointer hover:size-10 hover:-rotate-90 duration-200 group">
                <ArrowBigDownDash className="stroke-secondary size-5 fill-secondary duration-200" />
              </div>
            )}
          </div>
          <div ref={waveformRef} className="w-56 h-16 hover:cursor-pointer" />
          <div className="bg-primary text-secondary text-md px-2 rounded-lg cursor-default w-13 flex justify-center overflow-clip">
            <span>{duration}</span>
          </div>
        </div>
        <div className="w-full md:h-full md:w-0 p-[0.05rem] bg-primary" />
        <div className="flex w-full px-3 py-2 md:py-0 justify-between overflow-hidden">
          <div className="flex flex-col h-full justify-center overflow-auto scrollbar-thin">
            <h5>{title}</h5>
            <div className="w-full overflow-y-clip overflow-x-auto scrollbar-thin">
              <span className="text-nowrap">{notes}</span>
            </div>
          </div>
          <div className="flex justify-center items-center pl-3">
            <Pencil
              className="stroke-primary active:stroke-secondary hover:cursor-pointer hover:-rotate-15 duration-200"
              onClick={() => {
                setModalAction("Edit");
                setModalHidden(false);
              }}
            />
            <ArrowDownToLine
              className="stroke-primary active:stroke-secondary hover:cursor-pointer duration-300 hover:-mb-1"
              onClick={async () => {
                if (!recordingUrl) {
                  await fetchAudio();
                }

                const a = document.createElement("a");
                a.href = recordingUrl;
                a.download = `${title}.wav`;
                a.click();
                a.remove();
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-icon lucide-trash stroke-primary active:stroke-secondary hover:cursor-pointer duration-200 group size-6 overflow-visible hover:-mb-1"
              onClick={() => {
                setModalAction("Delete");
                setModalHidden(false);
              }}
            >
              <path d="M19 7v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
              <g className="group-hover:-translate-y-1 duration-100">
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <Modal
        hidden={modalHidden}
        setHidden={setModalHidden}
        title={modalAction}
      >
        {modalAction === "Edit" ? (
          <div className="flex flex-col justify-center items-start gap-3">
            <div className="flex flex-col-reverse">
              <input
                type="text"
                className="peer"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <p className="pb-1 peer-focus:pl-2 duration-200">Title</p>
            </div>
            <div className="flex flex-col-reverse w-full">
              <textarea
                rows={3}
                className="peer scrollbar-thin"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              ></textarea>
              <p className="pb-1 peer-focus:pl-2 duration-200">Notes</p>
            </div>
            <button
              className="grow-0 m-auto my-1"
              onClick={() => {
                console.log(`${newTitle}, ${newNotes}`);
                supabase
                  .from("recordings")
                  .update({ title: newTitle, notes: newNotes })
                  .eq("id", id)
                  .then(() => {
                    refresh();
                  });
                setModalHidden(true);
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-3">
            <p>Are you sure you want to delete {title}?</p>
            <button
              className="grow-0 m-auto my-1"
              onClick={() => {
                console.log(`${newTitle}, ${newNotes}`);
                supabase
                  .from("recordings")
                  .delete()
                  .eq("id", id)
                  .then(() => {
                    refresh();
                  });
                supabase.storage.from("audios").remove([`${userId}/${id}.wav`]);
                setModalHidden(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

function zeroPadding(duration: number) {
  const durationString = duration.toString();
  if (durationString.length === 2) {
    return durationString;
  }

  return `0${durationString}`;
}

export function formatDuration(duration: number) {
  return `${zeroPadding(Math.floor(duration / 60))}:${zeroPadding(duration % 60)}`;
}

export default RecordingPlayer;
