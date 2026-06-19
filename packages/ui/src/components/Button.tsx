import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center px-8 py-3 text-xs font-medium tracking-widest uppercase transition-colors duration-200 ease-out cursor-pointer ${
        variant === "primary"
          ? "bg-black text-white hover:bg-zinc-800"
          : "border border-black bg-transparent text-black hover:bg-black hover:text-white"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
