import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConditionalHeader from "@/components/layout/ConditionalHeader"; // Importamos o novo componente

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyGym App",
  description: "Seu app de treino pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TooltipProvider>
            {/* Usamos o ConditionalHeader para envolver o conteúdo da página */}
            <ConditionalHeader>
              {children}
            </ConditionalHeader>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}