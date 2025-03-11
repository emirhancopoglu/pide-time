import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Slash } from "lucide-react";

export default function Breadcrump() {
  return (
    <>
      <Breadcrumb className="mt-12 text-">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">RAMAZAN İMSAKİYESİ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>İSTANBUL İMSAKİYESİ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
