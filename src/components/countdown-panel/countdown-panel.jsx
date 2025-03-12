"use client";
import { useApiContext } from "@/context/api-context";
import { MapPin } from "lucide-react";
import Breadcrump from "../breadcrump/breadcrump";
import { formatDate } from "@/utils/date-format";

export default function CountdownPanel() {
  const { selectedCity, selectedRegion, times } = useApiContext();

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
            <p className="text-end">currentTime</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center my-4">
          <p className="text-3xl font-bold">KALAN SÜRE</p>
          <p>remainingTime</p>
        </div>
      </div>
    </>
  );
}
