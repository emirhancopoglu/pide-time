import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="border-t mt-4 px-4 py-4 text-end flex flex-row justify-between">
        <p className="text-sm font-[300]"> Developed by Emirhan</p>
        <div className="flex flex-row gap-1">
          <Link
            href="https://github.com/emirhancopoglu"
            target="_blank"
            className=""
          >
            <FaGithub size={20} className="flex-shrink-0" />
          </Link>

          <Link
            href="https://www.linkedin.com/in/emirhancopoglu/"
            target="_blank"
            className=""
          >
            <FaLinkedin size={20} className="flex-shrink-0" />
          </Link>
        </div>
      </footer>
    </>
  );
}
