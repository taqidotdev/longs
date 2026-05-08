function Modal({hidden = true}: {hidden?: boolean}) {
  return (
    <div className={`${hidden ? "hidden" : "absolute"} top-0 w-screen h-screen bg-black/50 z-50`}>
      <div className="h-full w-full flex justify-center items-center">
        <div className="bg-background outline-primary outline-3 p-8 rounded-lg" id="mainModal">
          <h1>HEllo</h1>
        </div>
      </div>
    </div>
  );
}

export default Modal;
