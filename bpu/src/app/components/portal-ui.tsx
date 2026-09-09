import type { ReactNode } from "react";

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
      {Array.from({ length: 28 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow-pill">{children}</span>;
}
