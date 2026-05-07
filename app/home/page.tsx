"use client";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const supabase = createClient();

  return (
    <div className="flex flex-col h-screen justify-between py-12 items-center">
      <h1>Record.</h1>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
}
