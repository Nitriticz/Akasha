import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { ModalProvider } from "@/components/providers/modal-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const font = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akasha",
  description: "Aplicación de mensajería y videollamadas en tiempo real",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="akasha-theme"
          >
            <ModalProvider />
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
