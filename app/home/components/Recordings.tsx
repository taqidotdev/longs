import RecordingPlayer from "./RecordingPlayer";
import type { FileObject } from "@supabase/storage-js/";

function Recordings({ recordings }: { recordings: FileObject[] | null }) {
  console.log(recordings)
  return (
    <div className="bg-primary/15 outline-primary outline-3 w-3/4 xl:max-w-7/12 h-1/2 overflow-auto scrollbar flex flex-col px-5 py-4 overflow-x-clip scroll-m-4">
      <div className="flex flex-col gap-4">{/* {recordings?.length ? (
        <RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        />
      ) : (
        <div className="h-full flex justify-center items-center">
          <h4>No recordings.</h4>
        </div>
      )} */}
      <RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahgsadasdadsadsadasadsadadsadasdasdasdassa"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /><RecordingPlayer
          recordingDuration={1232}
          title="rickrollasdasdakdiasuhdashd"
          notes="12312312321ashigklaskhgiuash21321321ihadsughahg"
        /></div>
    </div>
  );
}

export default Recordings;
