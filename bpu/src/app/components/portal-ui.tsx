import type { ReactNode } from "react";

const PERFORATION_DOTS = Array.from({ length: 28 }, (_, index) => index);

export function PortalLogo() {
  return (
    <span className="portal-logo" aria-label="BPU Portal Pajak">
      BPU
    </span>
  );
}

export function Perforation() {
  return (
    <div className="perforation" aria-hidden="true">
      {PERFORATION_DOTS.map((dot) => (
        <span key={dot} />
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow-pill">{children}</span>;
}