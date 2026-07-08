"use client";



import { useCallback, useEffect, useRef, useState } from "react";

import {

  OPENING_SPLASH_POSTER_LANDSCAPE,

  OPENING_SPLASH_POSTER_PORTRAIT,

  OPENING_SPLASH_VIDEO_DESKTOP,

  OPENING_SPLASH_VIDEO_MOBILE,

} from "@/lib/constants";

import { trackEvent } from "@/lib/tracking";

import { captureAttributionFromWindow, isPaidTrafficSession } from "@/lib/utm";

import { cn } from "@/lib/utils";



type SplashPhase = "active" | "fading" | "done";



/** Safety net if ended/error never fire (bad encode, stalled buffer, etc.). */

const SPLASH_MAX_MS = 9000;



function prefersReducedMotion() {

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;

}



export function OpeningSplash() {

  const videoRef = useRef<HTMLVideoElement>(null);

  const [phase, setPhase] = useState<SplashPhase>("active");

  const [muted, setMuted] = useState(true);

  const [needsTap, setNeedsTap] = useState(false);

  const [posterAvailable, setPosterAvailable] = useState(false);

  const completedRef = useRef(false);



  const dismiss = useCallback((reason: "skip" | "complete" | "error" | "paid") => {

    if (reason === "skip") {

      trackEvent("splash_skip", { source: reason });

    } else if (reason === "complete") {

      if (!completedRef.current) {

        completedRef.current = true;

        trackEvent("splash_complete", {});

      }

    }

    setPhase((current) => (current === "done" ? current : "fading"));

  }, []);



  useEffect(() => {

    captureAttributionFromWindow();



    if (prefersReducedMotion()) {

      setPhase("done");

      return;

    }



    if (isPaidTrafficSession()) {

      setPhase("done");

      return;

    }



    const video = videoRef.current;

    if (!video) return;



    let cancelled = false;



    const tryPlay = async () => {

      try {

        await video.play();

        if (!cancelled) setNeedsTap(false);

      } catch {

        if (!cancelled) setNeedsTap(true);

      }

    };



    const onCanPlay = () => {

      void tryPlay();

    };



    const onEnded = () => dismiss("complete");



    const onTimeUpdate = () => {

      if (

        video.duration &&

        Number.isFinite(video.duration) &&

        video.currentTime >= video.duration - 0.25

      ) {

        dismiss("complete");

      }

    };



    video.addEventListener("canplay", onCanPlay);

    video.addEventListener("ended", onEnded);

    video.addEventListener("timeupdate", onTimeUpdate);

    void tryPlay();



    const maxTimer = window.setTimeout(() => dismiss("complete"), SPLASH_MAX_MS);



    return () => {

      cancelled = true;

      window.clearTimeout(maxTimer);

      video.removeEventListener("canplay", onCanPlay);

      video.removeEventListener("ended", onEnded);

      video.removeEventListener("timeupdate", onTimeUpdate);

    };

  }, [dismiss]);



  useEffect(() => {

    if (phase === "done") return;



    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";



    return () => {

      document.body.style.overflow = previousOverflow;

    };

  }, [phase]);



  useEffect(() => {

    if (phase !== "fading") return;



    const timer = window.setTimeout(() => setPhase("done"), 280);

    return () => window.clearTimeout(timer);

  }, [phase]);



  const handleUnmute = useCallback(async () => {

    const video = videoRef.current;

    if (!video) return;



    video.muted = false;

    setMuted(false);

    trackEvent("splash_sound_on", {});



    try {

      await video.play();

      setNeedsTap(false);

    } catch {

      video.muted = true;

      setMuted(true);

    }

  }, []);



  const handleTapToPlay = useCallback(async () => {

    const video = videoRef.current;

    if (!video) return;



    try {

      await video.play();

      setNeedsTap(false);

    } catch {

      setNeedsTap(true);

    }

  }, []);



  if (phase === "done") return null;



  return (

    <div

      className={cn(

        "fixed inset-0 z-[200] bg-btf-ink",

        "h-[100dvh] w-full supports-[height:100svh]:h-[100svh]",

        "transition-opacity duration-300 ease-out",

        phase === "fading" && "pointer-events-none opacity-0",

      )}

      role="dialog"

      aria-modal="true"

      aria-label="Built Together Funding intro"

    >

      <div className="absolute inset-0 overflow-hidden">

        <video

          ref={videoRef}

          className="absolute inset-0 h-full w-full max-h-none max-w-none object-cover object-center"

          muted={muted}

          playsInline

          autoPlay

          preload="auto"

          poster={posterAvailable ? OPENING_SPLASH_POSTER_PORTRAIT : undefined}

          onError={() => dismiss("error")}

        >

          <source

            media="(max-width: 767px)"

            src={OPENING_SPLASH_VIDEO_MOBILE}

            type="video/mp4"

          />

          <source

            media="(min-width: 768px)"

            src={OPENING_SPLASH_VIDEO_DESKTOP}

            type="video/mp4"

          />

        </video>

      </div>



      {/* Probe poster availability without showing a broken image */}
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={OPENING_SPLASH_POSTER_PORTRAIT}
        alt=""
        className="hidden"
        onLoad={() => setPosterAvailable(true)}
        onError={() => setPosterAvailable(false)}
      />
      <img
        src={OPENING_SPLASH_POSTER_LANDSCAPE}
        alt=""
        className="hidden"
        onLoad={() => setPosterAvailable(true)}
        onError={() => setPosterAvailable(false)}
      />
      {/* eslint-enable @next/next/no-img-element */}



      {needsTap ? (

        <button

          type="button"

          onClick={() => void handleTapToPlay()}

          className={cn(

            "absolute inset-0 z-[1] flex items-center justify-center bg-btf-ink/55",

            "text-sm font-semibold text-white sm:text-base",

          )}

        >

          Tap to play intro

        </button>

      ) : null}



      <div

        className={cn(

          "pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-start justify-end gap-2 p-3",

          "pt-[max(0.75rem,env(safe-area-inset-top))]",

          "pr-[max(0.75rem,env(safe-area-inset-right))]",

          "sm:p-4",

        )}

      >

        {muted ? (

          <button

            type="button"

            onClick={() => void handleUnmute()}

            className={cn(

              "pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full",

              "border border-white/25 bg-black/45 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm",

              "transition-transform active:scale-[0.98] sm:min-h-10 sm:px-4",

              "touch-manipulation",

            )}

            aria-label="Turn sound on"

          >

            <VolumeOffIcon className="h-4 w-4 shrink-0" />

            <span>Sound on</span>

          </button>

        ) : null}



        <button

          type="button"

          onClick={() => dismiss("skip")}

          className={cn(

            "pointer-events-auto inline-flex min-h-11 items-center rounded-full",

            "border border-white/25 bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm",

            "transition-transform active:scale-[0.98] sm:min-h-10",

            "touch-manipulation",

          )}

        >

          Skip

        </button>

      </div>

    </div>

  );

}



function VolumeOffIcon({ className }: { className?: string }) {

  return (

    <svg

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

      strokeLinecap="round"

      strokeLinejoin="round"

      className={className}

      aria-hidden

    >

      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

      <line x1="23" y1="9" x2="17" y2="15" />

      <line x1="17" y1="9" x2="23" y2="15" />

    </svg>

  );

}


