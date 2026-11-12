import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

// latin-ext: ğ, ş, ı, İ gibi Türkçe karakterler için gerekli
const heading = Funnel_Display({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const body = Funnel_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Pide Vakti | İftar ve sahur vakitleri",
    template: "%s | Pide Vakti",
  },
  description:
    "Türkiye'nin 81 ili ve ilçeleri için Diyanet verileriyle iftar, sahur ve namaz vakitleri; canlı geri sayım ve 30 günlük imsakiye.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1022" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 sm:px-6 lg:px-8 lg:px-8">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
