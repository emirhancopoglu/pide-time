"use client";
import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import axios from "axios";
import { useApiContext } from "@/context/api-context";

export default function IftarSearch() {
  const {
    cities,
    regions,
    times,
    selectedCities,
    selectedRegions,
    selectedRegionId,
    selectedCitiesId,
    setSelectedCities,
    setSelectedRegions,
    setTimes, // Burayı eklediğinizden emin olun
    setSelectedCitiesId,
    handleSearch,
    setSelectedRegionId,
  } = useApiContext();

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <p className="font-semibold text-3xl">İstanbul İftar Vakti</p>
        <div className="flex flex-row gap-2">
          <Select onValueChange={(value) => setSelectedCities(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="İl" />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 ? (
                cities.map((city, index) => (
                  <SelectItem key={index} value={city}>
                    {city}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="noData">İl Verisi Bulunamadı</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select
            disabled={!selectedCities}
            onValueChange={(value) => setSelectedRegions(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              {regions.length > 0 ? (
                regions.map((regions, index) => (
                  <SelectItem key={index} value={regions}>
                    {regions}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="noData">İlçe Verisi Bulunamadı</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>
            <MapPin />
            Ara
          </Button>

          {times.length > 0 && (
            <div className="mt-4">
              {times.map(({ date, times }) => (
                <div key={date}>
                  <p className="font-semibold text-xl">Tarih: {date}</p>
                  <p className="font-semibold text-xl">
                    Vakitler: {times.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
