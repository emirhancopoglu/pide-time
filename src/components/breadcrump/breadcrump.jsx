"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useApiContext } from "@/context/api-context";

import { Slash } from "lucide-react";

export default function Breadcrump() {
  const { selectedCities } = useApiContext();

  return (
    <>
      <Breadcrumb className="mt-12 text-">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/ara">Ara</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>
              {selectedCities ? selectedCities : ""} İmsakiye
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
