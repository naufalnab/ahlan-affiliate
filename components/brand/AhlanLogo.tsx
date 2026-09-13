import Image from "next/image";
import React from "react";

export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface AhlanLogoProps {
  /** Predefined size or custom pixel width */
  size?: LogoSize | number;
  /** Explicit pixel width if not using size preset */
  width?: number;
  /** Asset variant to use */
  variant?: "transparent" | "cropped" | "original";
  /** If rendered on a dark background (e.g., admin sidebar), wrap in a clean white pill */
  onDark?: boolean;
  /** Optional custom CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
  /** Prioritize image loading (e.g. for hero / header) */
  priority?: boolean;
  /** Alt text for accessibility */
  alt?: string;
}

// Aspect ratio of the official cropped Ahlan logo (126px width x 78px height)
const ASPECT_RATIO = 126 / 78;

const SIZE_MAP: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 92, height: Math.round(92 / ASPECT_RATIO) }, // ~57px height (compact nav)
  md: { width: 118, height: Math.round(118 / ASPECT_RATIO) }, // ~73px height (standard desktop nav)
  lg: { width: 136, height: Math.round(136 / ASPECT_RATIO) }, // ~84px height (lobby / hero)
  xl: { width: 150, height: Math.round(150 / ASPECT_RATIO) }, // ~93px height
};

export default function AhlanLogo({
  size = "md",
  width,
  variant = "transparent",
  onDark = false,
  className = "",
  style = {},
  priority = true,
  alt = "Ahlan Les Bahasa Arab",
}: AhlanLogoProps) {
  let targetWidth: number;
  let targetHeight: number;

  if (width && typeof width === "number") {
    targetWidth = width;
    targetHeight = Math.round(width / ASPECT_RATIO);
  } else if (typeof size === "number") {
    targetWidth = size;
    targetHeight = Math.round(size / ASPECT_RATIO);
  } else {
    const dimensions = SIZE_MAP[size] || SIZE_MAP.md;
    targetWidth = dimensions.width;
    targetHeight = dimensions.height;
  }

  const src =
    variant === "original"
      ? "/brand/ahlan-logo-original.png"
      : variant === "cropped"
      ? "/brand/ahlan-logo-cropped.png"
      : "/brand/ahlan-logo-transparent.png";

  const imgElement = (
    <Image
      src={src}
      alt={alt}
      width={targetWidth}
      height={targetHeight}
      priority={priority}
      style={{
        width: targetWidth,
        height: "auto",
        maxWidth: "100%",
        display: "block",
        objectFit: "contain",
        ...style,
      }}
      className={className}
    />
  );

  if (onDark) {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          padding: "5px 9px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
        }}
      >
        {imgElement}
      </div>
    );
  }

  return imgElement;
}
