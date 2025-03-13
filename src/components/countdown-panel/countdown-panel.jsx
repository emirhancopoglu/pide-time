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
  const todayTimes = getPrayerTimes(times);
  const prayerTimes = getPrayerTimes(times);

  const sahurTime = prayerTimes?.find(
    (item) => item.time === "İmsak Vakti"
  )?.clock;
  const iftarTime = prayerTimes?.find(
    (item) => item.time === "İftar Saati"
  )?.clock;

  const remainingSahurTime = getRemainingTime(sahurTime);
  const remainingIftarTime = getRemainingTime(iftarTime);

  const isSahurPassed = remainingSahurTime === "Zaman Geçti";
  const isIftarPassed = remainingIftarTime === "Zaman Geçti";

  return (
    <>
      <Breadcrump />
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <p className="font-semibold text-3xl">
          {selectedCity &&
            (selectedRegion
              ? `${selectedCity}, ${selectedRegion}`
              : selectedCity)}
        </p>
      </div>

      <div className="w-full border rounded-sm h-full mt-4 px-4 py-4">
        <div className="flex w-full flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-1">
            <MapPin size={20} strokeWidth={1} absoluteStrokeWidth />
            <p className="font-[450]">
              Türkiye /{" "}
              {selectedCity &&
                (selectedRegion
                  ? `${selectedCity}, ${selectedRegion}`
                  : selectedCity)}
            </p>
          </div>
          <div className="flex flex-col">
            {" "}
            <p> {times.length > 0 ? formatDate(times[0].date) : "2025"}</p>
            <p className="text-end">{currentTime}</p>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center my-4">
          {isSahurPassed ? (
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-3xl font-bold">İFTARA KALAN SÜRE</p>
              <p>{remainingIftarTime}</p>
            </div>
          ) : isIftarPassed ? (
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-3xl font-bold">SAHURA KALAN SÜRE</p>
              <p>{remainingSahurTime}</p>
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-3xl font-bold">SAHURA KALAN SÜRE</p>
              <p className="text-3xl">{remainingSahurTime}</p>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-row justify-around px-4 py-8">
          {todayTimes?.map((item, index) => (
            <div className=" flex flex-row gap-2  justify-center" key={index}>
              <Separator orientation="vertical" />
              <div>{item.icon}</div>
              <div className="text-center">
                <p className="font-[450]">{item.time} </p>
                <p className="font-[350]">{item.clock}</p>
              </div>
              <Separator orientation="vertical" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
