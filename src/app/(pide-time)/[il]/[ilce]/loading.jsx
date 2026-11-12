export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-10 pt-8 sm:pt-12" aria-busy="true" aria-label="Vakitler yükleniyor">
      <div className="h-5 w-72 max-w-full rounded-full bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="flex flex-col gap-4">
          <div className="h-6 w-40 rounded-full bg-muted" />
          <div className="h-16 w-full max-w-lg rounded-2xl bg-muted sm:h-24" />
          <div className="h-16 w-3/4 max-w-md rounded-2xl bg-muted sm:h-24" />
        </div>
        <div className="h-80 rounded-3xl bg-day-sky" />
      </div>
      <div className="h-32 rounded-2xl bg-card" />
      <div className="h-96 rounded-2xl bg-card" />
    </div>
  );
}
