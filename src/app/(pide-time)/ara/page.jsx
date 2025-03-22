"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiContext } from "@/context/api-context";
import axios from "axios";
import { LocateFixed, MapPin } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const {
    cities,
    regions,
    selectedCity,
    selectedRegion,
    setSelectedCity,
    setSelectedRegion,
    handleSearch,
  } = useApiContext();

  const handleAutoLocate = async () => {
    if (!navigator.geolocation) {
      console.log("Tarayıcınız konum hizmetlerini desteklemiyor.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Konum bilgisi alındı:", latitude, longitude);

        try {
          // Ters geokodlama için bir API kullanabilirsiniz
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const city =
            response.data.address?.city || response.data.address?.state;
          const region =
            response.data.address?.suburb || response.data.address?.town;

          if (city) setSelectedCity(city);

          if (region) setSelectedRegion(region);

          console.log("Şehir:", city, "İlçe:", region);

          // Ardından arama yap
          handleSearch();
        } catch (error) {
          console.log("Ters geokodlama yapılırken bir hata oluştu:", error);
        }
      },
      (error) => {
        console.log("Konum alınamadı:", error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (selectedCity && selectedCity !== "null") {
      localStorage.setItem("selectedCity", selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedRegion && selectedRegion !== "null") {
      localStorage.setItem("selectedRegion", selectedRegion);
    }
  }, [selectedRegion]);

  return (
    <>
      <div className="w-full  h-full  flex justify-center mt-4 items-center">
        <Card className="w-1/2 max-md:w-full h-full px-6 py-16 border-gray-300  dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-2xl">İftar ve Sahur Saatleri</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-row">
            <Select
              onValueChange={(value) => setSelectedCity(value)}
              className="cursor-pointer"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="İl" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300  dark:border-gray-600">
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
              disabled={!selectedCity}
              onValueChange={(value) => setSelectedRegion(value)}
              className="cursor-pointer"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="İlçe" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300  dark:border-gray-600">
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
          </CardContent>
          <CardContent className="flex flex-row gap-2 w-full">
            <Button
              onClick={handleAutoLocate}
              className="w-1/2 cursor-pointer"
              variant="outline"
            >
              <LocateFixed />
              Otomatik Bul
            </Button>
            <Button onClick={handleSearch} className="w-1/2 cursor-pointer">
              <MapPin />
              Ara
            </Button>
          </CardContent>
        </Card>
        {/* Kullanılan API yazılacak buraya  */}
      </div>
    </>
  );
}
