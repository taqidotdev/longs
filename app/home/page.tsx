"use client";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        redirect("/");
      }

      return () => data.subscription.unsubscribe();
    });
  }, [supabase]);

  return (
    <div className="flex flex-col h-screen justify-between py-12 items-center">
      <h1>Record.</h1>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
}
