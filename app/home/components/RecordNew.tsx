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
import Slider from "./Slider";
import * as Tone from "tone";

function RecordNew({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const [recordingUrl, setRecordingUrl] = useState<string>();
  const [effectsRecordingUrl, setEffectsRecordingUrl] = useState<string>();
  const [recordingPlugin, setRecordingPlugin] = useState<RecordPlugin>();
  const [duration, setDuration] = useState(0);

  const [isModifying, setIsModifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [modalHidden, setModalHidden] = useState(true);
  const [modalAction, setModalAction] = useState("Effects");

  const [reverb, setReverb] = useState("0");
  const [pingPongDelay, setPingPongDelay] = useState("0");
  const [pitch, setPitch] = useState("36");
  const [distortion, setDistortion] = useState("0");
  const [gain, setGain] = useState("100");

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const waveformRef = useRef(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: waveformRef,
    waveColor: "#e1ac9d",
    progressColor: "#823a26",
    cursorWidth: 0,
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
      <div className="flex flex-col gap-3 w-full">
        <div
          className={`flex flex-col gap-1 w-full ${isModifying && !isUploading ? "" : "hidden"}`}
        >
          <div className="w-full flex gap-3 flex-col md:flex-row">
            <input
              type="text"
              value={title}
              placeholder="Untitled Recording"
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-72"
            />
            <div className="flex gap-2 items-center w-full">
              <p>Notes:</p>
              <input
                type="text"
                value={notes}
                placeholder="notes"
                onChange={(e) => setNotes(e.target.value)}
                className="small w-full"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex items-end justify-between pb-1">
          {isModifying ? (
            <div className="flex flex-col items-center gap-1">
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
          <div className="flex flex-col w-full">
            <div className="w-full flex justify-center items-center pr-3">
              <div
                ref={waveformRef}
                className={`h-12 px-3 w-full ${recordingPlugin?.isRecording() || isModifying ? "" : "hidden"}`}
              />
              <div
                className={`bg-primary text-secondary text-md px-2 rounded-lg cursor-default h-6 w-13 flex justify-center items-center overflow-clip ${isModifying ? "" : "hidden"}`}
              >
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          </div>
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
                    console.log(recordingUrl);

                    const recordingData = await (
                      await fetch(effectsRecordingUrl ?? recordingUrl ?? "")
                    ).blob();

                    if (!recordingData) return;

                    setIsUploading(true);

                    const id = (
                      await supabase
                        .from("recordings")
                        .insert({
                          title: title.trim() === "" ? null : title.trim(),
                          notes: notes.trim() === "" ? null : notes.trim(),
                          duration,
                          user_id: userId,
                          peaks: wavesurfer?.exportPeaks(),
                        })
                        .select("id")
                    ).data?.at(0)?.id;

                    console.log(`${userId}/${id}.wav`);

                    await supabase.storage
                      .from("audios")
                      .upload(`${userId}/${id}.wav`, recordingData);

                    setIsModifying(false);
                    setIsUploading(false);
                    window.location.reload() // i dont know why router.refresh doesnt do the trick anymore and im too tired to figure it out its currently 1 am.
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
      </div>
      <Modal
        title={modalAction}
        hidden={modalHidden}
        setHidden={setModalHidden}
      >
        {modalAction === "Effects" ? (
          <div className="flex flex-col justify-center items-center gap-4">
            <div>
              <Slider
                label="Reverb"
                formatValue={(value) => `${value}ms`}
                rangeValue={reverb}
                setRangeValue={setReverb}
                max={2000}
              />
              <Slider
                label="PingPong Delay"
                formatValue={(value) => `${value}ms`}
                rangeValue={pingPongDelay}
                setRangeValue={setPingPongDelay}
                max={1000}
              />
              <Slider
                label="Pitch"
                defaultValue={"36"}
                formatValue={(value) => {
                  const numberValue = value - 36;
                  return `${numberValue > 0 ? "+" : ""}${numberValue} S`;
                }}
                rangeValue={pitch}
                setRangeValue={setPitch}
                max={72}
              />
              <Slider
                label="Distortion"
                defaultValue={"0"}
                formatValue={(value) => {
                  return `${value}%`;
                }}
                rangeValue={distortion}
                setRangeValue={setDistortion}
                max={100}
              /><Slider
                label="Gain"
                defaultValue={"100"}
                formatValue={(value) => {
                  return `${value}%`;
                }}
                rangeValue={gain}
                setRangeValue={setGain}
                max={300}
              />
            </div>
            <button
              className="grow-0 m-auto my-1"
              onClick={async () => {
                if (!recordingUrl) return;

                const renderingPromise = Tone.Offline(async ({ transport }) => {
                  // this part copy pasted ai cuz im js tryna random solutions atp
                  const arrayBuffer = await fetch(recordingUrl).then((r) =>
                    r.arrayBuffer(),
                  );
                  const mainCtx = new AudioContext();
                  const decoded = await mainCtx.decodeAudioData(arrayBuffer);
                  await mainCtx.close();

                  const player = new Tone.Player();
                  player.buffer.set(decoded);

                  // back to me


                  const effectsArray = [];

                  if (reverb !== "0") {
                    const reverbEffect = new Tone.Reverb({decay: parseInt(reverb) / 1000});

                    effectsArray.push(reverbEffect);
                  }

                  if (pingPongDelay !== "0") {
                    const pingPongDelayEffect = new Tone.PingPongDelay({delayTime: parseInt(pingPongDelay) / 1000});

                  effectsArray.push(pingPongDelayEffect)
                  }

                  if (pitch !== "36") {
                    const pitchEffect = new Tone.PitchShift(parseInt(pitch) - 36);

                    effectsArray.push(pitchEffect);
                  }

                  if (distortion !== "0") {
                    const distortionEffect = new Tone.Distortion(parseInt(distortion) / 100);

                    effectsArray.push(distortionEffect)
                  }

                  if (gain !== "100") {
                    const gainEffect = new Tone.Gain(parseInt(gain) / 100)

                    effectsArray.push(gainEffect);
                  }

                  player.chain(
                    ...effectsArray,
                    Tone.getDestination(),
                  );

                  await Tone.loaded();
                  player.start(0);

                  transport.start();
                }, wavesurfer?.getDuration() ?? duration);

                const buffer = (await renderingPromise).get();
                if (!buffer) return;

                console.log(buffer);

                // following function converts Float32Array to Int16Array, modernized a version I found on github issues for lamejs
                const convertArray = (
                  bufferData: Float32Array<ArrayBuffer>,
                ): Int16Array<ArrayBuffer> => {
                  const len = bufferData.length;
                  const dataAsInt16Array = new Int16Array(len);

                  const convert = (n: number) => {
                    const v = n < 0 ? n * 32768 : n * 32767; // convert in range [-32768, 32767]
                    return Math.max(-32768, Math.min(32768, v)); // clamp
                  };

                  for (let i = 0; i < len; i++) {
                    dataAsInt16Array[i] = convert(bufferData[i]);
                  }

                  return dataAsInt16Array;
                };

                const leftChannel = convertArray(buffer.getChannelData(0));
                const rightChannel = convertArray(buffer.getChannelData(1));

                const audioBlob = encodeWavFromChannels(
                  leftChannel,
                  rightChannel,
                  48000,
                );

                const newRecordingUrl = URL.createObjectURL(audioBlob);

                console.log(newRecordingUrl);

                setEffectsRecordingUrl(newRecordingUrl);

                wavesurfer?.load(newRecordingUrl);

                setModalHidden(true);
              }}
            >
              Apply
            </button>
          </div>
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

// shoving this down here cuz the following is gemini

function encodeWavFromChannels(
  leftChannel: Int16Array,
  rightChannel: Int16Array,
  sampleRate: number = 48000,
): Blob {
  // Ensure both channels have matching sample counts
  const sampleCount = Math.min(leftChannel.length, rightChannel.length);

  // Stereo means 2 channels, and Int16 means 2 bytes per sample
  const bytesPerSample = 2;
  const channels = 2;

  // Allocate an ArrayBuffer for the full file: 44 bytes header + PCM Data
  const pcmDataByteLength = sampleCount * channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + pcmDataByteLength);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* file length minus RIFF identifier length */
  view.setUint32(4, 36 + pcmDataByteLength, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw uncompressed PCM = 1) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, channels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate = (sampleRate * blockAlign) */
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  /* block align = (channels * bytesPerSample) */
  view.setUint16(32, channels * bytesPerSample, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* chunk length */
  view.setUint32(40, pcmDataByteLength, true);

  // Write Interleaved PCM Audio Samples
  let offset = 44;
  for (let i = 0; i < sampleCount; i++) {
    // Write Left Sample
    view.setInt16(offset, leftChannel[i], true);
    offset += 2;
    // Write Right Sample
    view.setInt16(offset, rightChannel[i], true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

// Helper function to write ASCII characters into the DataView
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
