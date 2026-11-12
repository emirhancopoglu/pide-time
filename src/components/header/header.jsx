import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import HeaderLogo from "@/assets/ramazanpidesi.png";
import ThemeChanger from "./theme-changer";

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/ara" className="flex items-center gap-2.5 rounded-md" aria-label="Pide Vakti ana sayfa">
          <Image src={HeaderLogo} alt="" priority className="h-8 w-auto" />
          <span className="font-display text-xl font-semibold tracking-tight">Pide Vakti</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/ara"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.95rem] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <MapPin className="size-4" />
            <span className="hidden sm:inline">Konum değiştir</span>
          </Link>
          <ThemeChanger />
        </nav>
      </div>
    </header>
  );
}
