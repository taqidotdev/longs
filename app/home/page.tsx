import { createClient } from "@/lib/supabase/server";
import UserOptions from "./components/UserOptions";
import Recordings from "./components/Recordings";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  return (
    <div className="w-full h-screen">
      <UserOptions claims={data?.claims} />
      <div className="flex flex-col w-full h-screen justify-around items-center">
        <div className="">
          <h2>Recordings.</h2>
        </div>
        <Recordings />
      </div>
    </div>
  );
}
