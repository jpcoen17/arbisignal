import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArbiSignal – Crypto Arbitrage Alert Platform",
  description: "Real-time crypto arbitrage opportunities across exchanges",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0F1623",
              color: "#E8F0FE",
              border: "1px solid #1E2D45",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#00FF94",
                secondary: "#0F1623",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF4444",
                secondary: "#0F1623",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
