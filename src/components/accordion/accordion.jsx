import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  {
    q: "Ramazan'da sahurda hangi yemekler tercih edilmeli?",
    a: "Sahurda uzun süre tok tutan, protein ve lif açısından zengin besinler tercih edilmelidir. Yumurta, yoğurt, peynir, tam tahıllı ekmekler ve meyveler enerji seviyenizi gün boyu dengede tutar.",
  },
  {
    q: "İftar sırasında nelere dikkat etmeliyiz?",
    a: "İftara hafif ve sindirimi kolay yiyeceklerle başlamak önemlidir. Hurma ve su ile oruç açtıktan sonra çorba gibi hafif yemekler tüketilmeli, ardından ana yemeğe geçilmelidir. Ani ve aşırı yemekten kaçınılmalıdır.",
  },
  {
    q: "Ramazan ayında su tüketimi nasıl dengelenir?",
    a: "İftar ile sahur arasında suyu bir defada değil, saatlere yayarak için ve en az 8 bardak hedefleyin. Çay ve kahve vücuttan su atımını artırabileceği için önceliği suya verin.",
  },
  {
    q: "Gösterilen vakitler ne kadar doğru?",
    a: "Vakitler Diyanet İşleri Başkanlığı'nın yayımladığı verilerden alınır. Diyanet her ilçe için ayrı vakit yayımlamaz; listede olmayan ilçelerde il merkezinin vakitleri kullanılır.",
  },
];

export default function AccordionComponent() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {QUESTIONS.map((item, index) => (
        <AccordionItem key={item.q} value={`item-${index}`}>
          <AccordionTrigger className="py-5 text-[1.0625rem] font-medium hover:text-accent-foreground hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
