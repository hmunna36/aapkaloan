"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { branches, directionsUrl } from "@/content/branches";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Leaflet + OpenStreetMap. No API key needed; see README for production tile options. */
export default function BranchMap({ activeId, onSelect }: { activeId: string | null; onSelect: (id: string) => void }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      branches.forEach((b) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="akl-pin"><span>${esc(b.city.slice(0, 1))}</span></div>`,
          iconSize: [40, 48],
          iconAnchor: [20, 46],
          popupAnchor: [0, -42],
        });
        const m = L.marker([b.lat, b.lng], { icon, title: b.name, alt: b.name, keyboard: true })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:210px">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#85531f">${esc(b.kind)}</p>
              <p style="margin:4px 0 6px;font-size:15px;font-weight:800;color:#1f1510">${esc(b.name)}</p>
              <p style="margin:0 0 8px;font-size:12.5px;line-height:1.45;color:#5c5147">${esc(b.address)}</p>
              <a href="${directionsUrl(b)}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:#85531f">Get directions →</a>
            </div>`,
          );
        m.on("click", () => onSelectRef.current(b.id));
        markersRef.current[b.id] = m;
      });

      map.fitBounds(L.latLngBounds(branches.map((b) => [b.lat, b.lng] as [number, number])), { padding: [70, 70], maxZoom: 12 });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const b = branches.find((x) => x.id === activeId);
    const m = markersRef.current[activeId];
    if (!b || !m) return;
    map.flyTo([b.lat, b.lng], 15, { duration: 1.1 });
    m.openPopup();
  }, [activeId]);

  return (
    <>
      <div ref={elRef} className="map-tones h-full min-h-[22rem] w-full" role="region" aria-label="Map of AapKaLoan branches" />
      <style>{`
        .akl-pin{width:40px;height:40px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:#1f1510;border:3px solid #ca903f;display:grid;place-items:center;box-shadow:0 10px 20px -8px rgba(20,16,13,.6)}
        .akl-pin span{transform:rotate(45deg);color:#e4bf85;font-weight:800;font-size:14px;font-family:var(--font-sans)}
      `}</style>
    </>
  );
}
