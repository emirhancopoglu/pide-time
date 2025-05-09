"use client";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [times, setTimes] = useState([]);
  const router = useRouter();

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
    if (!selectedCity) return;

    const getCityId = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/searchPlaces?q=${selectedCity}&lang=tr`
        );
        const city = response.data.find((city) => city.name === selectedCity);

        if (city) {
          setSelectedCityId(city.id);
        } else {
          setSelectedCityId("");
        }
      } catch (error) {
        console.log("Şehir ID'si alınırken bir hata oluştu.", error);
      }
    };
    getCityId();
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedCity) return;

    const getCityRegion = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/cities?country=Turkey&region=${selectedCity}`
        );
        setRegions(response.data);
      } catch (error) {
        console.log("İlçeler alınırken bir hata oluştu.", error);
      }
    };
    getCityRegion();
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedRegion) return;
    const getRegionId = async () => {
      try {
        const response = await axios.get(
          `https://vakit.vercel.app/api/searchPlaces?q=${selectedRegion}&lang=tr`
        );
        const region = response.data.find(
          (region) => region.name === selectedRegion
        );
        if (region) {
          setSelectedRegionId(region.id);
        } else {
          setSelectedRegionId("");
        }
      } catch (error) {
        console.log("İlçe ID'si alınırken bir hata oluştu.", error);
      }
    };
    getRegionId();
  }, [selectedRegion]);

  useEffect(() => {
    setSelectedRegion(null);
    setSelectedRegionId("");
    setRegions([]);
  }, [selectedCity]);

  const handleSearch = async () => {
    if (!selectedCityId) {
      toast.info("Şehir seçmelisin!");
      return;
    }

    const path = selectedRegion
      ? `/${selectedCity?.toLowerCase()}-${selectedRegion?.toLowerCase()}`
      : `/${selectedCity?.toLowerCase()}`;

    router.push(`${path}?city=${selectedCity}&region=${selectedRegion || ""}`);

    //Hangi ay içindeysek o ayı alır.
    const currentDate = new Date();
    const currentYYMMDD = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD formatında alırız

    try {
      const cityOrRegionId = selectedRegionId || selectedCityId;
      const response = await axios.get(
        `https://vakit.vercel.app/api/timesForPlace?id=${cityOrRegionId}&date=${currentYYMMDD}&days=29&timezoneOffset=180&calculationMethod=Turkey&lang=tr`
      );

      const allTimes = response.data.times;

      const formattedTimes = Object.entries(allTimes).map(([date, times]) => {
        return { date, times };
      });

      setTimes(formattedTimes);

      if (selectedCity && selectedCity !== "null") {
        localStorage.setItem("selectedCity", selectedCity);
      }
      if (selectedRegion && selectedRegion !== "null") {
        localStorage.setItem("selectedRegion", selectedRegion || "");
      }

      if (formattedTimes && formattedTimes.length > 0) {
        localStorage.setItem("times", JSON.stringify(formattedTimes));
      } else {
        localStorage.removeItem("times");
      }
    } catch (error) {
      console.log("Vakitler çekilirken bir hata oluştu.", error);
    }
  };

  useEffect(() => {
    const savedTimes = localStorage.getItem("times");
    const savedCity = localStorage.getItem("selectedCity");
    const savedRegion = localStorage.getItem("selectedRegion");

    if (savedTimes) setTimes(JSON.parse(savedTimes));
    if (savedCity) setSelectedCity(savedCity);
    if (savedRegion) setSelectedRegion(savedRegion);
  }, []);

  return (
    <ApiContext.Provider
      value={{
        cities,
        regions,
        times,
        selectedCity,
        selectedRegion,
        selectedRegionId,
        selectedCityId,
        setSelectedCity,
        handleSearch,
        setSelectedRegion,
        setTimes,
        setSelectedCityId,
        setSelectedRegionId,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  return useContext(ApiContext);
};
