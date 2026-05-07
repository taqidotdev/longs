import { createClient } from "@/lib/supabase/server";
import UserOptions from "./components/UserOptions";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  return (
    <div className="flex flex-col w-full h-screen justify-between items-center">
      <UserOptions claims={data?.claims} />
      <div className="flex flex-col h-full justify-center pb-20">
        <h2>Recordings.</h2>
      </div>
    </div>
  );
}
