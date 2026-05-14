"use client";
import { useWavesurfer } from "@wavesurfer/react";
import { MicIcon, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

function RecordNew() {
  const [microphone, setMicrophone] = useState<string>();
  const [microphoneOptions, setMicrophoneOptions] = useState<MediaDeviceInfo[]>(
    [],
  );
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

  useEffect(() => {
    RecordPlugin.getAvailableAudioDevices().then((devices) => {
      console.log(
        `devices: ${devices.map((d) => `${d.label}: ${d.deviceId}`)}`,
      );
      if (devices?.length)
        setMicrophoneOptions(devices.filter((device) => device.deviceId));
    });
  }, []);

  const handleRecord = () => {
    console.log(`microphone: ${microphone}`);
    if (recordingPlugin?.isRecording()) {
      recordingPlugin.stopRecording();
      return;
    }
    if (!microphone) {
      RecordPlugin.getAvailableAudioDevices().then((devices) => {
        console.log(`deeeeevices: ${JSON.stringify(devices)}`);
        if (devices.length)
          setMicrophone(devices.filter((d) => d.deviceId)[0]?.deviceId);
      });
    }

    console.log(`mikrofone: ${microphone}`);
    recordingPlugin?.startRecording({ deviceId: microphone });
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
          <div className="flex flex-col justify-end">
            <label htmlFor="mic" className="text-end">
              Select Microphone
            </label>

            {(microphoneOptions?.length ?? 0) > 1 ? (
              <select
                id="mic"
                value={microphone}
                onChange={(e) => setMicrophone(e.target.value)}
              >
                {microphoneOptions.map((device, index) => {
                  if (device.deviceId) {
                    return (
                      <option value={device.deviceId} key={index}>
                        {device.label ?? device.deviceId}
                      </option>
                    );
                  }
                })}
              </select>
            ) : (
              <select disabled id="mic">
                <option>Enable microphones permission</option>
              </select>
            )}
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
