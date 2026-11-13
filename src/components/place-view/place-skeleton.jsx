import { cn } from "@/lib/utils";

export function Bone({ className }) {
  return <span aria-hidden className={cn("block animate-pulse rounded-lg bg-secondary", className)} />;
}

export function CountdownSkeleton() {
  return (
    <div aria-hidden className="mt-5 flex flex-wrap items-end gap-x-4 sm:gap-x-6">
      {["sa", "dk", "sn"].map((unit) => (
        <span key={unit} className="inline-flex items-end gap-1.5">
          <Bone className="h-[clamp(3.4rem,9vw,6.75rem)] w-[clamp(4.5rem,12vw,9rem)] rounded-2xl" />
          <Bone className="mb-1 h-5 w-6" />
        </span>
      ))}
    </div>
  );
}

export function SkyCardSkeleton({ className }) {
  return (
    <div aria-hidden className={cn("flex min-h-[32rem] flex-col rounded-3xl bg-card p-5 sm:p-6", className)}>
      <div className="mb-2 flex items-center justify-between">
        <Bone className="h-6 w-20" />
        <Bone className="h-4 w-14" />
      </div>
      <div className="flex min-h-44 flex-1 items-center justify-center py-4">
        <Bone className="aspect-[2/1] h-full max-h-56 rounded-t-full rounded-b-none" />
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-10" />
          <Bone className="h-7 w-20" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Bone className="h-4 w-10" />
          <Bone className="h-7 w-20" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center justify-between px-3.5 py-3">
            <Bone className="h-5 w-24" />
            <Bone className="h-5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardSkeleton({ className, children }) {
  return <div className={cn("flex flex-col rounded-3xl bg-card p-5 sm:p-7", className)}>{children}</div>;
}

export function SectionsSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-10">
      <div>
        <Bone className="h-8 w-48" />
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2 bg-card px-4 py-4 sm:px-5 sm:py-5">
              <Bone className="h-5 w-16" />
              <Bone className="h-8 w-20" />
              <Bone className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton>
          <Bone className="h-8 w-40" />
          <Bone className="mt-2 h-5 w-72 max-w-full" />
          <Bone className="mt-7 min-h-64 flex-1 rounded-2xl" />
        </CardSkeleton>
        <CardSkeleton>
          <Bone className="h-8 w-56" />
          <Bone className="mt-2 h-5 w-80 max-w-full" />
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="h-5 w-24" />
                <Bone className="h-2 flex-1" />
                <Bone className="h-5 w-12" />
              </div>
            ))}
          </div>
        </CardSkeleton>
      </div>

      <div>
        <Bone className="h-8 w-36" />
        <Bone className="mt-2 h-5 w-52" />
        <div className="mt-4 flex flex-col gap-px overflow-hidden rounded-2xl bg-border">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-6 bg-card px-5 py-4">
              <Bone className="h-5 w-28" />
              <Bone className="ml-auto h-5 w-[55%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlaceSkeleton() {
  return (
    <div className="flex flex-col gap-10" aria-busy="true" aria-label="Vakitler yükleniyor">
      <section className="grid gap-8 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="flex min-w-0 flex-col">
          <Bone className="h-4 w-56" />
          <Bone className="mt-3 h-[clamp(2.25rem,5vw,3.75rem)] w-[min(100%,34rem)] rounded-xl" />
          <CountdownSkeleton />
          <Bone className="mt-5 h-6 w-80 max-w-full" />
          <div className="mt-5 flex gap-2">
            <Bone className="h-10 w-40 rounded-full" />
            <Bone className="h-10 w-32 rounded-full" />
            <Bone className="h-10 w-24 rounded-full" />
          </div>
          <div className="mt-8 rounded-3xl bg-card p-4 sm:p-5">
            <div className="flex min-h-12 items-center gap-3">
              <Bone className="hidden size-11 rounded-xl sm:block" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Bone className="h-4 w-16" />
                <Bone className="h-6 w-36" />
              </div>
              <Bone className="h-11 w-24 rounded-xl" />
              <Bone className="size-11 rounded-xl" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              {Array.from({ length: 10 }, (_, index) => (
                <Bone key={index} className="h-9 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <SkyCardSkeleton />
      </section>
      <SectionsSkeleton />
    </div>
  );
}
