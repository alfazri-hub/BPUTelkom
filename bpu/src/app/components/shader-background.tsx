"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function ShaderBackground() {
  return (
    <div className="shader-background" aria-hidden="true">
      <ShaderGradientCanvas
        className="shader-background__canvas"
        pointerEvents="none"
        pixelDensity={1}
        fov={45}
        lazyLoad
      >
        <ShaderGradient
          animate="on"
          brightness={1.15}
          cAzimuthAngle={250}
          cDistance={1.5}
          cPolarAngle={140}
          cameraZoom={12.5}
          color1="#e43d4b"
          color2="#ff6b8a"
          color3="#6d163b"
          envPreset="city"
          grain="on"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          reflection={0.45}
          rotationX={0}
          rotationY={0}
          rotationZ={140}
          shader="defaults"
          type="sphere"
          uAmplitude={7}
          uDensity={0.8}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={0.4}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
