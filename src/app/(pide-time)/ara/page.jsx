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
import { LocateFixed, MapPin } from "lucide-react";

export default function Page() {
  const {
    cities,
    regions,
    selectedCity,
    setSelectedCity,
    setSelectedRegion,
    handleSearch,
  } = useApiContext();

  return (
    <>
      <div className="w-full  h-full  flex justify-center mt-4 items-center">
        <Card className="w-1/2  max-md:w-full h-full px-6 py-16 ">
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
              disabled={!selectedCity}
              onValueChange={(value) => setSelectedRegion(value)}
              className="cursor-pointer"
            >
              <SelectTrigger className="w-full">
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
          </CardContent>
          <CardContent className="flex flex-row gap-2 w-full">
            <Button
              onClick={handleSearch}
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
