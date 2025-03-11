import { MapPin } from "lucide-react";

export default function CountdownPanel() {
  return (
    <>
      <div className="w-full border rounded-sm h-full mt-4 px-4 py-4">
        <div className="flex w-full flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-1">
            <MapPin size={20} strokeWidth={1} absoluteStrokeWidth />
            <p className="font-[450]">Türkiye / İstanbul</p>
          </div>
          <div className="flex flex-col">
            {" "}
            <p> 10 Mart 2025</p> <p className="text-end">22:31 </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center my-4">
          <p className="text-3xl font-bold">İFTARA KALAN SÜRE </p>
          <p>TİMER</p>
        </div>
      </div>
    </>
  );
}
