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
import { useRouter } from "next/navigation";

export default function Breadcrump() {
  const { selectedCity, setSelectedCity, setSelectedRegion } = useApiContext();
  const router = useRouter();

  const handleClearLocalStorage = () => {
    localStorage.removeItem("selectedRegion");
    localStorage.removeItem("selectedCity");
    localStorage.removeItem("times");
    setSelectedCity(null);
    setSelectedRegion(null);
    router.push("/ara");
  };

  return (
    <>
      <Breadcrumb className="mt-6 cursor-pointer">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handleClearLocalStorage}>
              Ara
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>
              {selectedCity ? selectedCity : ""} İmsakiye
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
