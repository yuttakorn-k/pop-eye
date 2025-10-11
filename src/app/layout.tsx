import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Popeye POS System",
  description: "ระบบขายหน้าร้าน Popeye POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased min-h-screen bg-gray-50`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
