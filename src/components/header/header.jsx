import Link from "next/link";
import Logo from "@/components/logo/logo";
import ThemeChanger from "./theme-changer";

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 lg:px-8">
        <Link href="/ara" className="flex items-center gap-2.5 rounded-md" aria-label="Pide Vakti ana sayfa">
          <Logo className="h-8 w-auto" />
          <span className="font-display text-xl font-semibold tracking-tight">Pide Vakti</span>
        </Link>

        <ThemeChanger />
      </div>
    </header>
  );
}
