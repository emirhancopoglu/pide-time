import BannerPhoto from "@/assets/banner.jpeg";
import Image from "next/image";
import Link from "next/link";

export default function BannerComponent() {
  return (
    <>
      <div className="w-full h-full my-10 max-md:px-6 relative">
        <div className="relative w-full h-[400px]">
          <Image
            src={BannerPhoto}
            alt="Pide Vakti"
            className="object-cover"
            fill
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 dark:opacity-40" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col cursor-pointer">
            <h1 className="text-white text-5xl max-md:text-3xl font-black">
              KULLANILAN API
            </h1>
            <Link
              href="https://vakit.vercel.app/"
              target="_blank"
              className="text-white text-2xl font-bold"
            >
              vakit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
