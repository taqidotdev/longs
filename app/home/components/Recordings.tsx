import RecordingPlayer from "./RecordingPlayer";

function Recordings() {
  return (
    <div className="bg-primary/15 outline-primary outline-3 w-3/4 md:w-1/2 h-1/2 overflow-auto flex flex-col px-5 py-4 overflow-x-clip">
      {/* <div className="h-full flex justify-center items-center">
        <h4>No Recordings</h4>
      </div> */}
      <RecordingPlayer recordingDuration={1232} title="rickroll" notes="12312312321ashigklaskhgiuash21321321ihadsughahg" />
    </div>
  );
}

export default Recordings;
