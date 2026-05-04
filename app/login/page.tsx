"use client";
import { useState } from "react";
import { MoveLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col justify-center items-center gap-7 mb-7">
      <div
        onClick={() => redirect("/")}
        className="relative right-28 top-6 fill-secondary flex items-center gap-1 text-primary hover:text-secondary hover:fill-secondary hover:cursor-pointer duration-100"
      >
        <MoveLeft size={16} className="inline" />
        Back
      </div>

      <h2 className="mb-3">Logins.</h2>
      <input
        type="text"
        name="email"
        className="peer"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="peer-focus:hidden peer-not-placeholder-shown:hidden">
        <p>Login with Google</p>
      </button>
      <button className="hidden peer-focus:block peer-not-placeholder-shown:block">
        <p>Send Magic Link</p>
      </button>
    </div>
  );
}
