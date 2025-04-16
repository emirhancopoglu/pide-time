"use client";
import { useApiContext } from "@/context/api-context";
import { MapPin } from "lucide-react";
import Breadcrump from "@/components/breadcrump/breadcrump";
import { formatDate } from "@/utils/date-format";
import useCurrentTime from "@/utils/current-time";
import getPrayerTimes from "@/utils/get-prayer-times";
import { Separator } from "@/components/ui/separator";
import { getRemainingTime } from "@/utils/remaining-time";

export default function CountdownPanel() {
  const { selectedCity, selectedRegion, times } = useApiContext();

  const currentTime = useCurrentTime();

  const now = new Date();
  now.setHours(now.getHours() + 3);
  const today = now.toISOString().split("T")[0];

  // Bugünün namaz vakitlerini bul
  const todayData = times.find((item) => item.date === today);
  const todayTimes = getPrayerTimes(todayData);

  const sahurTime = todayTimes?.find((item) => item.time === "İmsak")?.clock;
  const iftarTime = todayTimes?.find((item) => item.time === "Akşam")?.clock;

  const remainingSahur = getRemainingTime(sahurTime, iftarTime);
  const remainingIftar = getRemainingTime(sahurTime, iftarTime);

  // Doğru zaman tipine göre kalan süreyi belirle
  const remainingSahurTime =
    remainingSahur?.type === "sahur" ? remainingSahur.time : "00:00:00";
  const remainingIftarTime =
    remainingIftar?.type === "iftar" ? remainingIftar.time : "00:00:00";

  return (
    <>
      <Breadcrump />
      {/* <div className="w-full flex flex-row justify-between items-center mt-4">
        <p className="font-semibold text-3xl">
          {selectedCity &&
            (selectedRegion
              ? `${selectedCity}, ${selectedRegion}`
              : selectedCity)}
        </p>
      </div> */}

      <div className="w-full border border-gray-300  dark:border-gray-600 rounded-sm h-full mt-4 px-4 py-4 ">
        <div className="flex w-full flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-1">
            <MapPin size={20} strokeWidth={1} absoluteStrokeWidth />
            <p className="font-[500]">
              Türkiye /{" "}
              {selectedCity &&
                (selectedRegion
                  ? `${selectedCity}, ${selectedRegion}`
                  : selectedCity)}
            </p>
          </div>
          <div className="flex flex-col">
            {" "}
            <p className="font-[500]">
              {" "}
              {todayData ? formatDate(todayData.date) : "2025"}
            </p>
            <p className="text-end font-[300]">{currentTime}</p>
          </div>
        </div>

        <div className="w-full flex flex-row justify-center max-md:justify-between items-center my-10">
          <div className="w-full flex flex-col justify-center items-center max-md:items-start">
            <p className="text-3xl max-md:text-xl font-bold">
              İFTARA KALAN SÜRE
            </p>
            <p className="text-3xl py-2 max-md:text-xl font-orbitron font-[500]">
              {remainingIftarTime}
            </p>
          </div>

          <div className="w-full flex flex-col justify-center items-center max-md:items-end max-md:text-end">
            <p className="text-3xl max-md:text-xl font-bold">
              SAHURA KALAN SÜRE
            </p>
            <p className="text-3xl py-2 max-md:text-xl font-orbitron font-[500]">
              {remainingSahurTime}
            </p>
          </div>
        </div>

        <Separator />
        <div className="w-full flex flex-row  justify-around px-4 py-8 max-md:gap-4 max-sm:flex-col max-md:flex-col ">
          {todayTimes?.map((item, index) => (
            <div
              className=" flex flex-row gap-4 justify-center max-md:justify-between"
              key={index}
            >
              <Separator orientation="vertical" className="max-md:hidden" />

              <div>{item.icon}</div>

              <div className="w-full text-center flex flex-col max-md:flex-row max-md:justify-between items-center">
                <p className="font-[450]">{item.time} </p>
                <p className="font-[350]">{item.clock}</p>
              </div>

              <Separator orientation="vertical" className="max-md:hidden" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
