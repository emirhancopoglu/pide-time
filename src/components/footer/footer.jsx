import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-[0.95rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p>
            Vakitler Diyanet İşleri Başkanlığı verilerinden alınır (
            <Link
              href="https://ezanvakti.emushaf.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              ezanvakti.emushaf.net
            </Link>
            ).
          </p>
          <p>
            Geliştiren{" "}
            <Link
              href="mailto:copogluemirhan@outlook.com"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Emirhan Çöpoğlu
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/emirhancopoglu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-md transition-colors hover:text-foreground"
          >
            <FaGithub className="size-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/emirhancopoglu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid size-9 place-items-center rounded-md transition-colors hover:text-foreground"
          >
            <FaLinkedin className="size-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
