import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-1 mb-7">
      <h4 className="text-primary -mb-2">
        <span>L</span>
        <span className="line-through text-secondary">og S</span>
        <span>ongs?</span>
      </h4>
      <h1>Longs.</h1>
      <p>Sing it. Store it.</p>
      <sub className="opacity-40">(so edgy right)</sub>

      <Link href="/login" className="mt-7">
        <button>
          <p>Get Started</p>
        </button>
      </Link>
    </div>
  );
}
