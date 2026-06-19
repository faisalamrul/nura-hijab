import { useState, useEffect, useCallback, useRef } from "react";

type Slide = {
  label: string;
  headline: string;
  subtext?: string | undefined;
  cta: string;
  href: string;
  image: string;
};

function unsplashSrcSet(src: string): string {
  const make = (w: number, h: number, q: number): string => {
    try {
      const u = new URL(src);
      u.searchParams.set("w", String(w));
      u.searchParams.set("h", String(h));
      u.searchParams.set("q", String(q));
      return `${u.toString()} ${w}w`;
    } catch {
      return `${src} ${w}w`;
    }
  };
  return [make(640, 411, 55), make(1024, 658, 65), make(1400, 900, 75)].join(", ");
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  return (
    <section
      className="relative h-[68vh] max-h-[740px] min-h-[480px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.image}
          src={slide.image}
          srcSet={unsplashSrcSet(slide.image)}
          sizes="100vw"
          alt=""
          aria-hidden
          width={1400}
          height={900}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          loading={i <= 1 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : i === 1 ? "low" : undefined}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

      {/* Slide text — only current slide uses h1 for correct SEO heading hierarchy */}
      {slides.map((slide, i) => {
        const Heading = i === current ? "h1" : "h2";
        return (
          <div
            key={slide.label}
            aria-hidden={i !== current}
            className={`absolute inset-0 flex flex-col justify-end pb-16 md:pb-20 px-8 md:px-16 transition-opacity duration-700 ease-out ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-silver mb-5">
              {slide.label}
            </p>
            <Heading className="fs-hero font-heading font-light text-white leading-[1.08] mb-8 max-w-2xl">
              {slide.headline.split("\n").map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </Heading>
            <a
              href={slide.href}
              className="inline-flex items-center gap-4 bg-white text-jet text-[10px] tracking-[0.28em] uppercase px-8 py-3.5 hover:bg-jet hover:text-white transition-colors duration-200 ease-out self-start"
            >
              {slide.cta}
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        );
      })}

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Slide sebelumnya"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Slide berikutnya"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-px transition-all duration-300 ease-out ${
              i === current ? "w-10 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 md:right-16 z-10 text-white/40 text-[10px] tracking-[0.2em] select-none">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
