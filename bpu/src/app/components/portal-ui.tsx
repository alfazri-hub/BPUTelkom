import Image from "next/image";

export function PortalMark({ width = "w-[100px]" }: { width?: string }) {
  return (
    <Image
      src="/telkom-indonesia.png"
      alt="Telkom Indonesia"
      width={250}
      height={138}
      priority
      className={`h-auto ${width}`}
    />
  );
}

export function PortalLogo() {
  return (
    <span className="flex flex-col items-center gap-3 text-center">
      <PortalMark />
      <span className="flex w-full flex-col border-t border-rule-soft pt-3 leading-tight">
        <span className="text-[0.9375rem] font-semibold tracking-tight text-ink">
          Portal Bukti Potong Pajak
        </span>
        <span className="mt-1 text-[0.6875rem] font-medium tracking-wide text-ink-2">
          BPU · Arsip administrasi perpajakan
        </span>
      </span>
    </span>
  );
}
