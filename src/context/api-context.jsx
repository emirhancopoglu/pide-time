"use client";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
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
    <ApiContext.Provider
      value={{
        cities,
        regions,
        times,
        selectedCities,
        selectedRegions,
        selectedRegionId,
        selectedCitiesId,
        setSelectedCities,
        handleSearch,
        setSelectedRegions,
        setTimes, // Burayı eklediğinizden emin olun
        setSelectedCitiesId,
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
