"use client";
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
import { useEffect, useState } from "react";

export default function IftarSearch() {
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCities, setSelectedCities] = useState("");
  const [selectedRegions, setSelectedRegions] = useState("");
  const [selectedCitiesId, setSelectedCitiesId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const getAllCities = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/regions?country=Turkey`
        );
        setCities(response.data);
      } catch (error) {
        console.log("Şehirler çekilirken bir hata oluştu.", error);
      }
    };
    getAllCities();
  }, []);

  useEffect(() => {
    if (!selectedCities) return;

    const getCityId = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/searchPlaces?q=${selectedCities}&lang=tr`
        );
        const city = response.data.find((city) => city.name === selectedCities);
        if (city) {
          setSelectedCitiesId(city.id);
        }
      } catch (error) {
        console.log("Şehir ID'si alınırken bir hata oluştu.", error);
      }
    };
    getCityId();
  }, [selectedCities]);

  useEffect(() => {
    const getCityRegion = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/cities?country=Turkey&region=${selectedCities}`
        );
        setRegions(response.data);
      } catch (error) {
        console.log("İlçeler alınırken bir hata oluştu.", error);
      }
    };
    getCityRegion();
  }, [selectedCities]);

  useEffect(() => {
    const getRegionId = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/searchPlaces?q=${selectedRegions}&lang=tr`
        );
        const region = response.data.find(
          (region) => region.name === selectedRegions
        );
        if (region) {
          setSelectedRegionId(region.id);
        }
      } catch (error) {
        console.log("Şehir ID'si alınırken bir hata oluştu.", error);
      }
    };
    getRegionId();
  }, [selectedRegions]);

  const handleSearch = async () => {
    if (!selectedCitiesId) {
      console.log("Şehir seçmelisiniz.");
      return;
    }

    try {
      const cityOrRegionId = selectedRegionId || selectedCitiesId;
      const response = await axios.get(
        `https://vakit.vercel.app/api/timesForPlace?id=${cityOrRegionId}&timezoneOffset=180&calculationMethod=Turkey&lang=tr`
      );

      const allTimes = response.data.times;

      const formattedTimes = Object.entries(allTimes).map(([date, times]) => {
        return { date, times };
      });

      setTimes(formattedTimes);
    } catch (error) {
      console.log("Vakitler çekilirken bir hata oluştu.", error);
    }
  };

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
