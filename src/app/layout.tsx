import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import CartBottomBar from "@/components/CartBottomBar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });
const monda = localFont({
  src: [
    {
      path: "../../public/fonts/Monda.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Monda.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velcario | Premium Collectibles",
  description: "Your ultimate destination for premium collectibles, action figures, and merchandise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${monda.variable} antialiased`} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
            <CartBottomBar />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
