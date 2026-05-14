"use client";
import { useWavesurfer } from "@wavesurfer/react";
import { MicIcon, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

function RecordNew() {
  const [recordingUrl, setRecordingUrl] = useState<string>();
  const [recordingPlugin, setRecordingPlugin] = useState<RecordPlugin>();

  const waveformRef = useRef(null);

  const { wavesurfer } = useWavesurfer({
    container: waveformRef,
    cursorWidth: 0,
    waveColor: "#e1ac9d",
    progressColor: "#e1ac9d",
    height: "auto",
    width: "auto",
    plugins: useMemo(
      () => [
        RecordPlugin.create({
          scrollingWaveform: true,
        }),
      ],
      [],
    ),
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
  }, [wavesurfer]);

  const handleRecord = () => {
    if (recordingPlugin?.isRecording()) {
      recordingPlugin.stopRecording();
      return;
    }

    recordingPlugin?.startRecording();
  };

  return (
    <div className="w-full flex items-end justify-between pb-1 h-20">
      {recordingPlugin?.isRecording() ? (
        <div>
          <div className="flex">
            <div className="flex flex-col justify-center items-center gap-1">
              <span>00:47</span>
              <div
                className="bg-secondary size-12 flex justify-center items-center rounded-3xl hover:cursor-pointer hover:text-primary hover:rounded-xl duration-250"
                onClick={handleRecord}
              >
                <Square className="fill-current size-5" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between">
          <div>
            <div
              className="bg-secondary size-12 flex justify-center items-center rounded-lg hover:cursor-pointer hover:text-primary hover:rounded-xl duration-150"
              onClick={handleRecord}
            >
              <MicIcon className="duration-150" />
            </div>
          </div>
        </div>
      )}
      <div
        ref={waveformRef}
        className={`h-12 px-3 w-full ${recordingPlugin?.isRecording() ? "" : "hidden"}`}
      />
    </div>
  );
}

export default RecordNew;
