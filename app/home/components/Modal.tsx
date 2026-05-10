import { useEffect, useRef } from "react";
import { X } from "lucide-react";

function Modal({
  children,
  title,
  hidden = true,
  setHidden,
}: {
  children: React.ReactNode;
  title: string;
  hidden?: boolean;
  setHidden: (value: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userOptions = document.getElementById("userOptions");
    const handleMouseUp = (e: MouseEvent) => {
      if (e.target !== userOptions) {
        userOptions?.classList.replace("absolute", "hidden");
      }

      if (
        !hidden &&
        (!modalRef.current?.contains(e.target as Node) ||
          (e.target as HTMLElement)?.id === "closeModal" ||
          (e.target as HTMLElement).parentElement?.id === "closeModal")
      ) {
        setHidden(true);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hidden, setHidden]);

  return (
    <div
      className={`${hidden ? "is-invisible" : "is-visible"} top-0 right-0 w-screen h-screen bg-black/50 transition-opacity duration-200 z-50`}
    >
      <div className="h-full w-full flex justify-center items-center">
        <div
          ref={modalRef}
          className="bg-background outline-primary outline-3 rounded-md justify-between"
          id="mainModal"
        >
          <div className="w-full relative top-3">
            <X className="link absolute right-3" id="closeModal" size={20} />
          </div>
          <div className="pt-1 pb-3 px-16 text-center">
            <h4>{title}</h4>
          </div>
          <div className="px-5 pb-3 flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
