"use client";
import Image from "next/image";
import ThemeChanger from "./theme-changer";
import HeaderLogo from "@/assets/ramazanpidesi.png";
import { useRouter } from "next/navigation";
import { useApiContext } from "@/context/api-context";

export default function Header() {
  const { setSelectedCity, setSelectedRegion } = useApiContext();
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
      <header className="flex flex-row items-center justify-between py-2 border-b ">
        <div className="w-[92px] h-auto">
          <a onClick={handleClearLocalStorage}>
            <Image
              src={HeaderLogo}
              alt="Pide Vakti"
              className="w-full h-full object-contain cursor-pointer"
            />{" "}
          </a>
        </div>
        <p className="text-orange-200 font-inter text-4xl font-semibold stroke-custom font-orbitron">
          Pide Vakti
        </p>
        <ThemeChanger />
      </header>
    </>
  );
}
