// app/layout.tsx
import type { Metadata, Viewport } from "next"; // MUDANÇA 1: Importamos o tipo 'Viewport'
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

// MUDANÇA 2: O metadata agora contém apenas título e descrição
export const metadata: Metadata = {
  title: "MyGym App",
  description: "Seu app de treino pessoal",
};

// MUDANÇA 3: Criamos uma nova exportação separada apenas para o viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}