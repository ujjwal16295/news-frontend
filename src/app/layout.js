import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/store/StoreProvider";
import AuthListener from "@/utils/userIdFunction";
import { Toaster } from "sonner";
import SubscriptionNotice from "@/components/SubscriptionExpiry";

// Primary font for general text
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display font for headlines and emphasis
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font for code and technical content
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "NewsEcho",
  description: "Summarize and listen to news from PDFs and images instantly with AI-powered voice narration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} 
        font-sans antialiased flex flex-col min-h-screen bg-black text-white`}
      >
        <StoreProvider>
          <AuthListener/>
          <Navbar />
          <SubscriptionNotice/>
          <Toaster position="bottom-right" />
          <main className="flex-grow">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}