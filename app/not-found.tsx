import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2>Error 404.</h2>
      <p>Page not found</p>

      <Link href="/" className="mt-3">
        <button>
          <p>Go Home</p>
        </button>
      </Link>
    </div>
  );
}
