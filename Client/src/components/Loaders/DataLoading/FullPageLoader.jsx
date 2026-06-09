import { useEffect, useRef } from "react";

const STYLES = `
@keyframes hms-win-on    { from{opacity:0.15} to{opacity:1} }
@keyframes hms-door-bob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes hms-txt-fade  { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes hms-flag-wave { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
@keyframes hms-cloud-l   { 0%{transform:translateX(0)} 100%{transform:translateX(-18px)} }
@keyframes hms-cloud-r   { 0%{transform:translateX(0)} 100%{transform:translateX(18px)} }
@keyframes hms-star-tw   { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
@keyframes hms-overlay-in{ from{opacity:0} to{opacity:1} }
`;

const MESSAGES = [
  "Setting up your hostel…",
  "Loading resident data…",
  "Fetching room records…",
  "Almost ready…",
];

const WINDOW_IDS = [
  "w3-1","w3-2","w3-3","w3-4",
  "w2-1","w2-2","w2-3","w2-4",
  "w1-1","w1-2","w1-3","w1-4",
  "sw1","sw2",
];

function injectStyles() {
  if (document.getElementById("hms-building-styles")) return;
  const tag = document.createElement("style");
  tag.id = "hms-building-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

/**
 * HostelLoader
 *
 * A full-page overlay loader shaped around the hostel theme —
 * a building whose windows light up one by one while data loads.
 *
 * Usage:
 *   {isLoading && <HostelLoader />}
 *   {isPending && <HostelLoader message="Updating status…" />}
 *
 * @param {string} message – optional override for the first status line
 */
export function HostelLoader({ message }) {
  const wIdxRef  = useRef(0);
  const mIdxRef  = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => {
    injectStyles();

    // Scatter stars once
    const starContainer = document.getElementById("hms-stars");
    if (starContainer && starContainer.childElementCount === 0) {
      for (let i = 0; i < 7; i++) {
        const s = document.createElement("div");
        s.style.cssText = `
          position:absolute;
          width:3px;height:3px;border-radius:50%;
          background:#C8A96E;
          left:${8 + Math.random() * 84}%;
          top:${5 + Math.random() * 70}%;
          animation:hms-star-tw ${1.4 + Math.random() * 1.2}s ease-in-out ${Math.random() * 2}s infinite;
        `;
        starContainer.appendChild(s);
      }
    }

    // Light windows sequentially
    const winTimer = setInterval(() => {
      const ids = WINDOW_IDS;
      if (wIdxRef.current < ids.length) {
        const el = document.getElementById("hms-" + ids[wIdxRef.current]);
        if (el) el.style.opacity = "1";
        wIdxRef.current++;
      } else {
        ids.forEach(id => {
          const el = document.getElementById("hms-" + id);
          if (el) el.style.opacity = "0.15";
        });
        wIdxRef.current = 0;
      }
    }, 220);

    // Rotate dots
    const dotTimer = setInterval(() => {
      const active = wIdxRef.current % 3;
      [0, 1, 2].forEach(i => {
        const d = document.getElementById("hms-dot-" + i);
        if (!d) return;
        d.style.opacity    = i === active ? "1"   : "0.25";
        d.style.transform  = i === active ? "scale(1.4)" : "scale(1)";
        d.style.transition = "all 0.3s";
      });
    }, 220);

    // Rotate messages
    const msgTimer = setInterval(() => {
      const el = document.getElementById("hms-loader-msg");
      if (!el) return;
      el.style.opacity = "0";
      el.style.transition = "opacity 0.3s";
      setTimeout(() => {
        mIdxRef.current = (mIdxRef.current + 1) % MESSAGES.length;
        el.textContent = MESSAGES[mIdxRef.current];
        el.style.opacity = "1";
      }, 300);
    }, 1800);

    timersRef.current = [winTimer, dotTimer, msgTimer];
    return () => timersRef.current.forEach(clearInterval);
  }, []);

  const W = (id, extraStyle = {}) => (
    <div
      id={"hms-" + id}
      style={{
        width: 22, height: 20,
        background: "#EAE8E3",
        borderRadius: "3px 3px 0 0",
        opacity: 0.15,
        position: "relative",
        overflow: "hidden",
        transition: "opacity 0.25s, background 0.25s",
        ...extraStyle,
      }}
    />
  );

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(249,248,246,0.80)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        zIndex: 9999,
        animation: "hms-overlay-in 0.2s ease",
      }}
    >
      {/* ── Scene ── */}
      <div style={{ position: "relative", width: 220, height: 200 }}>

        {/* Stars */}
        <div id="hms-stars" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        {/* Clouds */}
        <div style={{
          position:"absolute", top:8, left:0,
          width:52, height:14, background:"#EAE8E3", borderRadius:20,
          animation:"hms-cloud-l 3s ease-in-out infinite alternate",
        }} />
        <div style={{
          position:"absolute", top:18, right:10,
          width:42, height:14, background:"#EAE8E3", borderRadius:20,
          animation:"hms-cloud-r 4s ease-in-out infinite alternate",
        }} />

        {/* Building */}
        <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:130 }}>

          {/* Flag */}
          <div style={{ position:"relative" }}>
            <div style={{
              position:"absolute", top:-46, left:"50%", transform:"translateX(-50%)",
              width:2, height:24, background:"#A09890",
            }}>
              <div style={{
                position:"absolute", top:0, left:2,
                width:14, height:8, background:"#C8A96E",
                transformOrigin:"left center",
                animation:"hms-flag-wave 1.2s ease-in-out infinite",
              }} />
            </div>
            {/* Roof */}
            <div style={{
              width:0, height:0, margin:"0 auto",
              borderLeft:"65px solid transparent",
              borderRight:"65px solid transparent",
              borderBottom:"34px solid #C8A96E",
            }} />
          </div>
          <div style={{ height:8, background:"#B8996E" }} />

          {/* Floors */}
          <div style={{ background:"#1A1714", borderRadius:"0 0 4px 4px", padding:"10px 10px 0" }}>

            {/* Floor 3 */}
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:8 }}>
              {W("w3-1")} {W("w3-2")} {W("w3-3")} {W("w3-4")}
            </div>

            {/* Floor 2 */}
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:8 }}>
              {W("w2-1")} {W("w2-2")} {W("w2-3")} {W("w2-4")}
            </div>

            {/* Floor 1 */}
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:8 }}>
              {W("w1-1")} {W("w1-2")} {W("w1-3")} {W("w1-4")}
            </div>

            {/* Ground floor — door + side windows */}
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:5 }}>
              {W("sw1", { height:22 })}
              <div style={{
                width:26, height:34,
                background:"#C8A96E",
                borderRadius:"4px 4px 0 0",
                display:"flex", alignItems:"center", justifyContent:"center",
                animation:"hms-door-bob 2s ease-in-out infinite",
              }}>
                <div style={{
                  width:5, height:5,
                  background:"#1A1714",
                  borderRadius:"50%",
                  marginLeft:6, marginTop:8,
                }} />
              </div>
              {W("sw2", { height:22 })}
            </div>
          </div>

          <div style={{ height:6, background:"#2C2825", borderRadius:"0 0 4px 4px" }} />
          <div style={{ width:26, height:10, background:"#3C3835", margin:"0 auto", borderRadius:"0 0 3px 3px" }} />
        </div>
      </div>

      {/* ── Label + dots ── */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <p
          id="hms-loader-msg"
          style={{
            margin:0, fontSize:13,
            color:"#6B6560", fontWeight:400,
            animation:"hms-txt-fade 2s ease-in-out infinite",
            letterSpacing:"0.01em",
            transition:"opacity 0.3s",
          }}
        >
          {message || MESSAGES[0]}
        </p>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {[0,1,2].map(i => (
            <div
              key={i}
              id={"hms-dot-" + i}
              style={{
                width:5, height:5,
                borderRadius:"50%",
                background:"#C8A96E",
                opacity: i === 0 ? 1 : 0.25,
                transition:"all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HostelLoader;