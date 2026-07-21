"use client";

import { useEffect, useId, useRef } from "react";

export type ParsedAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onAddressParsed?: (parsed: ParsedAddress) => void;
  className?: string;
  placeholder?: string;
  /** Browser autocomplete token when Places is off */
  autoComplete?: string;
  "aria-invalid"?: boolean;
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: {
              componentRestrictions?: { country: string | string[] };
              fields?: string[];
              types?: string[];
            },
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => {
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
              formatted_address?: string;
              name?: string;
            };
          };
        };
        event?: { clearInstanceListeners?: (instance: unknown) => void };
      };
    };
    __btfMapsPromise?: Promise<void>;
  }
}

function getMapsKey(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || null;
}

function loadPlacesLibrary(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places?.Autocomplete) {
    return Promise.resolve();
  }
  if (window.__btfMapsPromise) return window.__btfMapsPromise;

  window.__btfMapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-btf-maps]",
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Maps script failed")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.btfMaps = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(script);
  });

  return window.__btfMapsPromise;
}

function parsePlaceComponents(
  components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>,
): ParsedAddress {
  const get = (type: string, short = false) => {
    const c = components.find((x) => x.types.includes(type));
    if (!c) return "";
    return short ? c.short_name : c.long_name;
  };

  const streetNumber = get("street_number");
  const route = get("route");
  const street = [streetNumber, route].filter(Boolean).join(" ").trim();

  return {
    street,
    city:
      get("locality") ||
      get("sublocality") ||
      get("neighborhood") ||
      get("administrative_area_level_2"),
    state: get("administrative_area_level_1", true),
    zip: get("postal_code"),
  };
}

/**
 * Street address input with Google Places suggestions when
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set (Places API enabled).
 */
export function AddressSuggestInput({
  id,
  value,
  onChange,
  onBlur,
  onAddressParsed,
  className,
  placeholder = "Start typing your address…",
  autoComplete = "street-address",
  "aria-invalid": ariaInvalid,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const onParsedRef = useRef(onAddressParsed);
  const reactId = useId();
  const inputId = id ?? reactId;
  const mapsKey = getMapsKey();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onParsedRef.current = onAddressParsed;
  }, [onAddressParsed]);

  useEffect(() => {
    if (!mapsKey || !inputRef.current) return;
    let cancelled = false;
    let autocomplete: {
      addListener: (event: string, handler: () => void) => void;
      getPlace: () => {
        address_components?: Array<{
          long_name: string;
          short_name: string;
          types: string[];
        }>;
      };
    } | null = null;

    void (async () => {
      try {
        await loadPlacesLibrary(mapsKey);
        if (cancelled || !inputRef.current || !window.google?.maps?.places) {
          return;
        }
        autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "us" },
            fields: ["address_components", "formatted_address"],
            types: ["address"],
          },
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          const components = place?.address_components;
          if (!components?.length) return;
          const parsed = parsePlaceComponents(components);
          if (parsed.street) {
            onChangeRef.current(parsed.street);
          }
          onParsedRef.current?.(parsed);
        });
      } catch {
        /* Places optional — plain input still works */
      }
    })();

    return () => {
      cancelled = true;
      if (autocomplete && window.google?.maps?.event?.clearInstanceListeners) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [mapsKey]);

  return (
    <input
      ref={inputRef}
      id={inputId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={className}
      autoComplete={mapsKey ? "off" : autoComplete}
      aria-invalid={ariaInvalid}
    />
  );
}

export function isAddressSuggestEnabled(): boolean {
  return Boolean(getMapsKey());
}
