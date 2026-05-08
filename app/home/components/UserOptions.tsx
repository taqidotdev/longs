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

  const [name, setName] = useState(`${claims?.user_metadata?.name ?? claims?.email}`)
  const [modalHidden, setModalHidden] = useState(true);

  useEffect(() => {
    const userOptions = document.getElementById("userOptions");
    const handleMouseUp = (e: MouseEvent) => {
      console.log(e.target);
      if (
        e.target !== userOptions &&
        e.target !== document.getElementById("name")
      ) {
        userOptions?.classList.replace("absolute", "hidden")
      }

      if (!modalHidden && (!document.getElementById("mainModal")?.contains(e.target as Node) || e.target === document.getElementById("closeModal"))) {
        setModalHidden(true);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {console.log("removing event listener"); document.removeEventListener("mouseup", handleMouseUp);}
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
          {name}
        </p>
        <div
          id="userOptions"
          className="bg-secondary rounded-lg rounded-tr-none p-2 px-4 hidden opacity-0 top-14 text-center duration-100"
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
      <Modal hidden={modalHidden} title="Set Name">
        <div className="flex flex-col gap-4">
          <input type="text" name="name" value={name} onChange={(e) => {setName(e.target.value); console.log(name)}}/>
          <button className="grow-0 m-auto" onClick={() => {
            supabase.auth.updateUser({
              data: {
                name
              }
            });
            supabase.auth.refreshSession();
            setModalHidden(true);
          }}>Save</button>
        </div>
      </Modal>
    </div>
  );
}

export default UserOptions;
