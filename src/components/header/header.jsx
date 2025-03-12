"use client";
import Image from "next/image";
import ThemeChanger from "./theme-changer";
import HeaderLogo from "@/assets/ramazanpidesi.png";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleClearLocalStorage = () => {
    localStorage.removeItem("selectedRegion");
    localStorage.removeItem("selectedCity");
    localStorage.removeItem("times");
    setSelectedCity(null);
    setSelectedRegion(null);
    router.push("/ara");
  };
  return (
    <>
      <div className="flex flex-row items-center justify-between py-2">
        <a onClick={handleClearLocalStorage}>
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
