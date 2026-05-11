import RecordingPlayer from "./RecordingPlayer";

export interface recordingsSchema {
  id: number;
  user_id: string;
  title: string | null;
  notes: string | null;
  duration: number | null;
  peaks: number[][];
}

function Recordings({ recordings, userId }: { recordings: recordingsSchema[] | null; userId: string }) {
  console.log(recordings);
  return (
    <div className="bg-primary/15 outline-primary outline-3 w-3/4 xl:max-w-7/12 h-1/2 overflow-auto scrollbar flex flex-col px-5 py-4 overflow-x-clip scroll-m-4">
      {recordings?.length ? (
        <div className="flex flex-col gap-4">
          {recordings.map((recording, index) => (
            <RecordingPlayer
              key={index}
              id={recording.id}
              recordingDuration={recording.duration ?? 0}
              title={recording.title ?? "Untitled Recording"}
              notes={recording.notes ?? ""} userId={userId} peaks={recording.peaks}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <h4>No recordings.</h4>
        </div>
      )}
    </div>
  );
}

export default Recordings;
