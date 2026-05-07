/* eslint-disable react-hooks/refs */
"use client";
import { useEffect, useRef, useState } from "react";
import { MoveLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {

  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(30);
  const countdownRef = useRef(countdown);
  
  useEffect(() => {
    countdownRef.current = countdown;
  });

  const emailRef = useRef(email);

  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-7 mb-7">
      <div
        onClick={() => redirect("/")}
        className="relative right-28 top-6 link"
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
      <div
        className="hidden justify-center items-center flex-col -mt-3"
        id="magicConfirmation"
      >
        <p>Sent a magic link to {emailRef.current ?? email}</p>
        <div className="text-sm flex gap-1">
          <span className="opacity-60">didn&#39;t receive it? </span>
          <div className="hidden" id="resend">
            <span
              className="link"
              onClick={() => {
                supabase.auth.signInWithOtp({ email });
                emailRef.current = email;
                const magicConfirmation =
                  document.getElementById("magicConfirmation");
                if (magicConfirmation)
                  magicConfirmation.innerHTML = `<p>Resent link to ${emailRef.current}</p>`;
              }}
            >
              resend
            </span>
          </div>
          <span className="opacity-60" id="countdown">
            resend in {countdown} seconds
          </span>
        </div>
      </div>
      <button
        onClick={() =>
          supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: "http://localhost:3000/auth/callback" },
          })
        }
        className="peer-focus:hidden peer-not-placeholder-shown:hidden"
        id="google"
      >
        <p>Login with Google</p>
      </button>
      <button
        onClick={() => {
          supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: "http://localhost:3000/auth/confirm" },
          });

          document
            .getElementById("magicConfirmation")
            ?.classList.replace("hidden", "flex");
          document
            .getElementById("magicLink")
            ?.classList.remove(
              "peer-focus:block",
              "peer-not-placeholder-shown:block",
            );
          document.getElementById("google")?.classList.add("hidden");
          emailRef.current = email;
          const countdownInterval = setInterval(() => {
            if (countdownRef.current <= 1) {
              document.getElementById("countdown")?.classList.add("hidden");
              document.getElementById("resend")?.classList.remove("hidden");
              clearInterval(countdownInterval);
            } else {
              setCountdown((prev) => prev - 1);
            }
          }, 1000);
        }}
        className="hidden peer-focus:block peer-not-placeholder-shown:block"
        id="magicLink"
      >
        <p>Send Magic Link</p>
      </button>
    </div>
  );
}
