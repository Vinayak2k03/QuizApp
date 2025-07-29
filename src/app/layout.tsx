import type { Metadata } from "next";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";

export const metadata: Metadata = {
  title: "Quiz App - CausalFunnel Challenge",
  description: "A challenging quiz application built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}