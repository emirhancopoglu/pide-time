import Image from "next/image";
import ThemeChanger from "./theme-changer";
import HeaderLogo from "@/assets/ramazanpidesi.png";

export default function Header() {
  return (
    <>
      <div className="flex flex-row items-center justify-between py-2">
        <a href="/">
          <div className="w-[92px] h-auto">
            <Image
              src={HeaderLogo}
              alt="Pide Vakti"
              className="w-full h-full object-contain"
            />{" "}
          </div>
        </a>
        <ThemeChanger />
      </div>
    </>
  );
}
