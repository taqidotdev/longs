"use client";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";

interface Claims {
  claims?: { user_metadata?: { name?: string }; email?: string };
}
function UserOptions(data: Claims) {
  const claims = data.claims;
  const supabase = createClient();

  const [modalHidden, setModalHidden] = useState(true);

  useEffect(() => {
    const userOptions = document.getElementById("userOptions");
    const handleMouseUp = (e: Event) => {
      console.log(e.target);
      if (
        e.target !== userOptions &&
        e.target !== document.getElementById("name")
      ) {
        console.log("removing");
        userOptions?.classList.add("opacity-0");
        setTimeout(
          () => userOptions?.classList.replace("absolute", "hidden"),
          150,
        );
      }

      if (!modalHidden && e.target !== document.getElementById("mainModal")) {
        setModalHidden(true);
      }
    };

    document.addEventListener("mouseup", (e) => {
      handleMouseUp(e);
    });

    return () => document.removeEventListener("mouseup", handleMouseUp);
  });

  return (
    <div className="w-full">
      <div className="flex flex-col w-full items-end pr-10 pt-5">
        <p
          className="link"
          id="name"
          onClick={() => {
            const userOptions = document.getElementById("userOptions");
            userOptions?.classList.replace("hidden", "absolute");
            setTimeout(() => userOptions?.classList.remove("opacity-0"), 50);
          }}
        >
          {claims?.user_metadata?.name ?? claims?.email ?? "Unknown User"}
        </p>
        <div
          id="userOptions"
          className="bg-secondary rounded-lg rounded-tr-none p-2 px-4 hidden opacity-0 top-14 text-center duration-150"
        >
          <p
            className="white-link"
            onClick={() => {
              setModalHidden(false);
            }}
          >
            Set Name
          </p>
          <p
            className="white-link flex justify-center"
            onClick={() => {
              supabase.auth.signOut();
              redirect("/");
            }}
          >
            Sign Out
          </p>
        </div>
      </div>
      <Modal hidden={modalHidden} />
    </div>
  );
}

export default UserOptions;
