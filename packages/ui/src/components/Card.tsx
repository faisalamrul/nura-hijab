import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

export function Card({ title, children, className, ...props }: CardProps) {
  return (
    <div
      className={`border border-zinc-200 bg-white p-6 ${className ?? ""}`}
      {...props}
    >
      {title !== undefined && (
        <h2 className="mb-3 text-lg font-light text-zinc-900">{title}</h2>
      )}
      <div className="text-zinc-500 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
