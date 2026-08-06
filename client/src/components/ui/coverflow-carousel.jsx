import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function CoverflowCarousel({
  slides,
  rotate = 35,
  depth = 0.5,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(260px, 28vw, 340px)",
  gap = 0.1,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  autoplay = true,
  autoplayInterval = 3000,
  label = "Cover carousel",
  className,
  cardClassName,
  renderCard,
}) {
  const count = slides.length;

  const frameRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [selected, setSelected] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const indexAt = React.useCallback(
    (pos) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  // Autoplay every 3 seconds
  React.useEffect(() => {
    if (!autoplay || isHovered || count <= 1) return;
    const interval = setInterval(() => {
      nudge(1);
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, isHovered, count, nudge]);

  const onPointerDown = (event) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full py-4", className)}
      style={{ ["--cf-card"]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-8 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 1.35)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={cn(
                  "absolute left-1/2 top-0 aspect-[3/4] overflow-hidden rounded-3xl bg-[#FAF4ED] dark:bg-[#071E2E] border border-[#D6CC99]/60 dark:border-[#445D48]/60 shadow-2xl will-change-transform",
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
              >
                {renderCard ? (
                  renderCard(slide, index === selected)
                ) : (
                  <div className="h-full w-full p-6 flex flex-col justify-between">
                    {slide.src && (
                      <img
                        src={slide.src}
                        alt={slide.alt || slide.title}
                        draggable={false}
                        className="h-36 w-full select-none object-cover rounded-xl"
                      />
                    )}
                    <div>
                      <h3 className="font-extrabold text-lg text-[#001524] dark:text-[#FDE5D4]">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="text-xs text-[#001524]/70 dark:text-[#FDE5D4]/70 mt-1">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] p-3 shadow-2xl transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] p-3 shadow-2xl transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-4 flex flex-col items-center px-6 transition-all duration-300"
        >
          <p className="text-xl font-extrabold text-[#001524] dark:text-[#FDE5D4]">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-1 text-sm font-medium text-[#001524]/70 dark:text-[#FDE5D4]/70 text-center max-w-md">
              {active.subtitle}
            </p>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                index === selected
                  ? "w-8 bg-[#445D48] dark:bg-[#D6CC99]"
                  : "w-2.5 bg-[#D6CC99]/50 dark:bg-[#445D48]/50 hover:bg-[#445D48]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
