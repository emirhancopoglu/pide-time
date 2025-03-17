"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiContext } from "@/context/api-context";
import { formatDate } from "@/utils/date-format";

export default function ImsakiyeTable() {
  const { selectedCity, selectedRegion, times } = useApiContext();

  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="mt-4">
      <h1 className="flex flex-row gap-1 text-xl font-semibold">
        {selectedCity &&
          (selectedRegion
            ? `${selectedCity}, ${selectedRegion}`
            : selectedCity)}
        <p> Ramazan İmsakiyesi</p>
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tarih</TableHead>
            <TableHead className="text-center">İmsak</TableHead>
            <TableHead className="text-center">Güneş</TableHead>
            <TableHead className="text-center">Öğle</TableHead>
            <TableHead className="text-center">İkindi</TableHead>
            <TableHead className="text-center">Akşam</TableHead>
            <TableHead className="text-center">Yatsı</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {times.map((day, index) => {
            const isToday = day.date === today; // Bugünün tarihiyle eşleşme kontrolü
            const isPast = day.date < today;
            return (
              <TableRow
                className={`text-center ${
                  isToday ? "text-green-600 font-bold" : ""
                } ${isPast ? "line-through" : ""}`}
                key={index}
              >
                <TableCell className="font-semibold">
                  {formatDate(day.date)}
                </TableCell>
                <TableCell>{day.times[0]}</TableCell> {/* İmsak */}
                <TableCell>{day.times[1]}</TableCell> {/* Güneş */}
                <TableCell>{day.times[2]}</TableCell> {/* Öğle */}
                <TableCell>{day.times[3]}</TableCell> {/* İkindi */}
                <TableCell>{day.times[4]}</TableCell> {/* İftar */}
                <TableCell>{day.times[5]}</TableCell> {/* Teravih */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
