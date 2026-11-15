"use client";
import { use } from "react";
import CityIftars from "./city-iftars";

export default function CityComparison({ citiesPromise, current }) {
  const cities = use(citiesPromise);
  return cities.length > 1 ? <CityIftars cities={cities} current={current} /> : null;
}
