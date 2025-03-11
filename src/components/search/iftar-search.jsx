import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { ClipboardType } from "lucide-react";

export default function IftarSearch() {
  return (
    <>
      <div className="w-full flex flex-row justify-between items-center mt-4">
        <p className="font-semibold text-3xl"> İstanbul İftar Vakti</p>
        <div className="flex flex-row gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Şehir" />
            </SelectTrigger>
            <SelectContent>
              {/* {city.map((city, index) => ({
             <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">
                  Mountain Standard Time (MST)
                </SelectItem>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="akst">
                  Alaska Standard Time (AKST)
                </SelectItem>
                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
              </SelectGroup> 
              }))} */}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              {/* {city.map((city, index) => ({
             <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">
                  Mountain Standard Time (MST)
                </SelectItem>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="akst">
                  Alaska Standard Time (AKST)
                </SelectItem>
                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
              </SelectGroup> 
              }))} */}
            </SelectContent>
          </Select>
          <Button>
            <MapPin />
            Ara
          </Button>
        </div>
      </div>
    </>
  );
}
