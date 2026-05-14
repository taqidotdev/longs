"use client";
import { useWavesurfer } from "@wavesurfer/react";
import {
  Check,
  LoaderCircle,
  MicIcon,
  Pause,
  Play,
  Sparkles,
  Square,
  Trash,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { formatDuration } from "./RecordingPlayer";
import IconButton from "./IconButton";
import Modal from "./Modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function RecordNew({userId}: {userId: string}) {

  const supabase = createClient();
  const router = useRouter()

  const [recordingUrl, setRecordingUrl] = useState<string>();
  const [recordingPlugin, setRecordingPlugin] = useState<RecordPlugin>();
  const [duration, setDuration] = useState(0);

  const [isModifying, setIsModifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [modalHidden, setModalHidden] = useState(true);
  const [modalAction, setModalAction] = useState("Delete");

  const waveformRef = useRef(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: waveformRef,
    waveColor: "#e1ac9d",
    progressColor: "#823a26",
    height: "auto",
    width: "auto",
    normalize: true,
    sampleRate: 48000,
    plugins: useMemo(
      () => [
        RecordPlugin.create({
          scrollingWaveform: true,
          audioBitsPerSecond: 192000,
        }),
      ],
      [],
    ),
  });

  wavesurfer?.on("finish", () => {
    wavesurfer.setTime(0);
  });

  useEffect(() => {
    console.log(`wavesurfer: ${wavesurfer}`);
    const recording = wavesurfer
      ?.getActivePlugins()
      .filter((p) => p instanceof RecordPlugin)[0] as RecordPlugin | undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecordingPlugin(recording);

    recording?.on("record-end", (blob) => {
      setRecordingUrl(URL.createObjectURL(blob));
    });

    recording?.on("record-progress", (time) => {
      setDuration(Math.floor(time / 1000));
    });
  }, [wavesurfer]);

  const handleRecord = () => {
    if (recordingPlugin?.isRecording()) {
      console.log("stopping recording");
      console.log(recordingPlugin);
      recordingPlugin.stopRecording();
      setIsModifying(true);
      return;
    }

    recordingPlugin?.startRecording({
      echoCancellation: false,
      noiseSuppression: false,
      sampleRate: 48000,
      autoGainControl: false,
    });
  };

  return (
    <>
      <div className="w-full flex items-end justify-between pb-1 h-20">
        {isModifying ? (
          <div className="flex flex-col items-center gap-1">
            <span>{formatDuration(duration)}</span>
            <IconButton
              onClick={() => {
                wavesurfer?.playPause();
              }}
            >
              {isPlaying ? (
                <Pause className="duration-150 stroke-none fill-current" />
              ) : (
                <Play className="duration-150 stroke-none fill-current" />
              )}
            </IconButton>
          </div>
        ) : (
          <div>
            <div className="flex">
              <div className="flex flex-col justify-center items-center gap-1">
                {recordingPlugin?.isRecording() ? (
                  <span>{formatDuration(duration)}</span>
                ) : (
                  <div />
                )}
                <IconButton onClick={handleRecord}>
                  {recordingPlugin?.isRecording() ? (
                    <Square className="fill-current size-5" />
                  ) : (
                    <MicIcon />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
        )}
        <div
          ref={waveformRef}
          className={`h-12 px-3 w-full ${recordingPlugin?.isRecording() || isModifying ? "" : "hidden"}`}
        />
        {isModifying ? (
          isUploading ? (
            <div className="md:min-w-40 flex gap-2 items-center justify-center h-12">
              <h4>Uploading</h4>
              <LoaderCircle className="animate-spin stroke-primary size-7 mt-1" />
            </div>
          ) : (
            <div className="flex gap-2">
              <IconButton
                onClick={() => {
                  setModalAction("Effects");
                  setModalHidden(false);
                }}
              >
                <Sparkles />
              </IconButton>
              <IconButton
                onClick={async () => {

                  console.log(recordingUrl)

                  const recordingData = await (await fetch(recordingUrl ?? "")).blob();

                  if (!recordingData) return;

                  setIsUploading(true);

                  const id = await supabase.from("recordings").insert({
                    title: null,
                    notes: null,
                    user_id: userId,
                    duration,
                    peaks: wavesurfer?.exportPeaks()
                  }).select("id")

                  await supabase.storage.from("audios").upload(`${userId}/${id}.mp3`, recordingData);

                  setIsModifying(false);
                  setIsUploading(false);
                  router.refresh();
                }}
              >
                <Check className="size-8 mt-1 stroke-[1.5]" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setModalAction("Delete");
                  setModalHidden(false);
                }}
              >
                <Trash />
              </IconButton>
            </div>
          )
        ) : (
          <div />
        )}
      </div>
      <Modal
        title={modalAction}
        hidden={modalHidden}
        setHidden={setModalHidden}
      >
        {modalAction === "Effects" ? (
          <div>HELLO</div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-3">
            <p>Are you sure you want to delete this recording?</p>
            <button
              className="grow-0 m-auto my-1"
              onClick={() => {
                URL.revokeObjectURL(recordingUrl ?? "");
                setIsModifying(false);
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

export default RecordNew;
