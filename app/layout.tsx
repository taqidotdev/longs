import type { Metadata } from "next";
import { Updock, Crimson_Pro } from "next/font/google";
import "./globals.css";

const headerFont = Updock({
  variable: "--font-header",
  weight: "400",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  weight: "200",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Longs.",
  description: "Log songs: Longs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headerFont.variable} ${crimsonPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-col flex-1 items-center justify-center font-serif bg-radial-[at_0%_0%] from-primary/15 via-background to-primary/15">
          {children}
        </div>
      </body>
    </html>
  );
}
