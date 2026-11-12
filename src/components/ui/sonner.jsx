"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { resolvedTheme = "dark" } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !font-sans !text-base",
          icon: "!text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
