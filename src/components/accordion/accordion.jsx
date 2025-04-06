import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionComponent() {
  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="flex flex-col w-1/2 max-md:w-full max-md:px-6"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Ramazan'da sahurda hangi yemekler tercih edilmeli?
          </AccordionTrigger>
          <AccordionContent>
            Sahurda uzun süre tok tutan protein ve lif açısından zengin besinler
            tercih edilmelidir. Örneğin, yumurta, yoğurt, tam tahıllı ekmekler
            ve meyveler enerji seviyenizi yüksek tutmanıza yardımcı olur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            İftar sırasında nelere dikkat etmeliyiz?
          </AccordionTrigger>
          <AccordionContent>
            İftara hafif ve sindirimi kolay yiyeceklerle başlamak önemlidir.
            Hurma ve su ile oruç açtıktan sonra çorba gibi hafif yemekler
            tüketilmeli, ardından ana yemeğe geçilmelidir. Ani ve aşırı yemek
            tüketiminden kaçınılmalıdır.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Ramazan ayında su tüketimi nasıl dengelenir?
          </AccordionTrigger>
          <AccordionContent>
            İftar ile sahur arasında su tüketimine özen gösterilmeli ve günde en
            az 8 bardak su içilmelidir. Çay ve kahve gibi içeceklerin fazla
            tüketimi vücudu susuz bırakabileceği için su öncelikli olmalıdır.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
