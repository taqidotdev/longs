import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({children, title, hidden = true}: {children: React.ReactNode; title: string, hidden?: boolean}) {

  useEffect(() => {
    if (hidden) {}
  })

  return (
    <div className={`${hidden ? "is-invisible" : "is-visible"} top-0 w-screen h-screen bg-black/50 transition-opacity duration-200 z-50`}>
      <div className="h-full w-full flex justify-center items-center">
        <div className="bg-background outline-primary outline-3 rounded-md justify-between gap-3" id="mainModal">
          <div className="w-full relative top-3"><X className="link absolute right-3" id="closeModal"/></div>
          <div className="pt-1 px-16"><h4>{title}</h4></div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
