import { createClient } from "@/lib/supabase/server";
import UserOptions from "./components/UserOptions";
import Recordings, { recordingsSchema } from "./components/Recordings";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const recordings = (await supabase.from("recordings").select().order("when", { ascending: false})).data;

  return (
    <div className="w-full h-screen">
      <UserOptions claims={data?.claims} />
      <div className="flex flex-col w-full h-screen justify-around items-center">
        <div className="">
          <h2>Recordings.</h2>
        </div>
        <Recordings recordings={recordings as unknown as recordingsSchema[]} userId={data?.claims.sub ?? ""} />
      </div>
    </div>
  );
}