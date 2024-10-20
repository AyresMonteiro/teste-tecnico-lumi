import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leitor de Faturas de Energia",
  description: "Envie as faturas e veja os dados delas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-[100vw] h-[100vh] flex items-center justify-center antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
