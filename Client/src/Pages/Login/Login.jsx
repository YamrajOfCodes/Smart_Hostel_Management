import { useState, useEffect, useRef } from "react";

const stats = [
  { value: "248", label: "Residents" },
  { value: "96%", label: "Occupancy" },
  { value: "12", label: "Floors" },
];

const chips = ["🛏 Room 204", "🔑 Check-in", "🍽 Mess Menu", "📋 Complaints", "💡 Utilities", "🧺 Laundry"];

export default function HostelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    setTimeout(() => setMounted(true), 80);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes starTwinkle {
          0%,100% { opacity: 0.25; } 50% { opacity: 0.9; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spinAnim {
          to { transform: rotate(360deg); }
        }
        @keyframes chipScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }

        .stat-shimmer {
          background: linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .spin-icon { animation: spinAnim 1s linear infinite; }

        .chip-track {
          display: flex;
          gap: 10px;
          animation: chipScroll 22s linear infinite;
          width: max-content;
        }
        .chip-track:hover { animation-play-state: paused; }

        .input-field {
          width: 100%;
          padding: 13px 16px 13px 42px;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0e1e34;
          background: white;
          border: 2px solid #e8e4de;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245,158,11,0.12);
        }
        .input-field::placeholder { color: #b0aaa4; }

        .submit-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg,#0e1e34 0%,#1a3a5c 100%);
          color: white;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.02em;
          box-shadow: 0 6px 24px rgba(14,30,52,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(14,30,52,0.38);
        }
        .submit-btn:disabled { background: #c9912a; cursor: not-allowed; }

        .dot-texture {
          background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0);
          background-size: 22px 22px;
        }
      `}</style>

      <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", display:"flex",
        flexDirection: isMobile ? "column" : "row", background:"#0c1117", overflow:"hidden" }}>

        {/* ═══════════════════════════════════════════
            HERO / ILLUSTRATION SECTION
        ═══════════════════════════════════════════ */}
        <div style={{
          position: "relative",
          flex: isMobile ? "0 0 auto" : "1 1 55%",
          minHeight: isMobile ? 300 : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          overflow: "hidden",
        }}>
          {/* Sky gradient */}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(180deg,#060f1e 0%,#0a1c38 30%,#112848 60%,#1a3a5c 85%,#1e4060 100%)" }} />

          {/* Stars */}
          {Array.from({length: isMobile ? 30 : 50}).map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              width: i%7===0 ? 3 : 2,
              height: i%7===0 ? 3 : 2,
              borderRadius:"50%",
              background:"white",
              top: `${(i*29)%60}%`,
              left: `${(i*53+7)%100}%`,
              opacity: 0.2 + (i%5)*0.12,
              animation: `starTwinkle ${2+(i%4)}s ease-in-out infinite`,
              animationDelay: `${(i*0.37)%4}s`,
            }} />
          ))}

          {/* Moon */}
          <div style={{
            position:"absolute", top: isMobile ? "8%" : "7%", right: isMobile ? "10%" : "15%",
            width: isMobile ? 40 : 54, height: isMobile ? 40 : 54,
            borderRadius:"50%",
            background:"radial-gradient(circle at 35% 35%,#fffde7,#fde68a)",
            boxShadow:"0 0 28px rgba(253,230,138,0.45), 0 0 60px rgba(253,230,138,0.15)",
            opacity: mounted ? 1 : 0,
            transition:"opacity 1.2s ease 0.4s",
          }} />

          {/* Building SVG */}
          <svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg"
            style={{ width:"100%", maxWidth: isMobile ? 380 : 520, position:"relative", zIndex:2,
              opacity: mounted ? 1 : 0, transition:"opacity 0.9s ease 0.2s",
              paddingBottom: 0 }}>

            {/* Ground */}
            <rect x="0" y="272" width="520" height="28" fill="#0f1f35"/>
            <rect x="0" y="268" width="520" height="6" fill="#162840"/>
            {/* Road dashes */}
            <rect x="238" y="271" width="12" height="2" fill="#f59e0b" opacity="0.5"/>
            <rect x="260" y="271" width="12" height="2" fill="#f59e0b" opacity="0.5"/>
            <rect x="282" y="271" width="12" height="2" fill="#f59e0b" opacity="0.5"/>

            {/* Left bg building */}
            <rect x="10" y="145" width="78" height="127" fill="#0c1c30" rx="2"/>
            {[[1,0,1],[0,1,1],[1,1,0],[0,1,0],[1,0,1]].map((r,ri)=>r.map((lit,ci)=>(
              <rect key={`lb${ri}${ci}`} x={20+ci*24} y={155+ri*23} width={14} height={16}
                fill={lit ? (ci===1?"#fef08a":"#bae6fd") : "#0a1624"}
                opacity={lit?(ci===1?0.7:0.5):0.3} rx="1"/>
            )))}

            {/* Right bg building */}
            <rect x="432" y="158" width="72" height="114" fill="#0c1c30" rx="2"/>
            {[[1,1],[0,1],[1,0],[1,1]].map((r,ri)=>r.map((lit,ci)=>(
              <rect key={`rb${ri}${ci}`} x={442+ci*30} y={168+ri*25} width={16} height={18}
                fill={lit?(ci===0?"#fef08a":"#38bdf8"):"#0a1624"}
                opacity={lit?(ci===0?0.65:0.5):0.25} rx="1"/>
            )))}

            {/* Main hostel building */}
            <rect x="124" y="48" width="272" height="224" fill="#101f35" rx="3"/>
            {/* Facade horizontal lines */}
            {[0,1,2,3,4,5].map(f=>(
              <rect key={`fl${f}`} x="124" y={90+f*30} width="272" height="1" fill="#0a1828" opacity="0.9"/>
            ))}
            {/* Vertical column lines */}
            {[0,1,2,3,4].map(c=>(
              <rect key={`cl${c}`} x={170+c*42} y="48" width="1" height="224" fill="#0a1828" opacity="0.6"/>
            ))}

            {/* Windows — 7 rows × 5 cols */}
            {[
              [1,0,1,1,0],[0,1,1,0,1],[1,1,0,1,1],[0,1,1,1,0],
              [1,0,1,0,1],[1,1,0,1,1],[0,1,1,0,1]
            ].map((row,ri)=>row.map((lit,ci)=>(
              <rect key={`w${ri}${ci}`}
                x={140+ci*44} y={55+ri*29} width={22} height={21}
                fill={lit?(ci%2===0?"#fef08a":"#bae6fd"):"#08121e"}
                opacity={lit?(ci%2===0?0.72:0.55):0.4} rx="2"/>
            )))}

            {/* HMS badge on building */}
            <rect x="212" y="75" width="96" height="22" fill="#0b1d36" rx="3"/>
            <text x="260" y="90" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" letterSpacing="4">HMS</text>

            {/* Roof parapet */}
            <rect x="120" y="43" width="280" height="10" fill="#132030" rx="2"/>
            {Array.from({length:9}).map((_,i)=>(
              <rect key={`pt${i}`} x={124+i*31} y={33} width={16} height={13} fill="#132030" rx="1"/>
            ))}
            {/* Flag */}
            <rect x="258" y="18" width="2" height="18" fill="#8fa3b8"/>
            <polygon points="260,18 276,24 260,30" fill="#f59e0b" opacity="0.95"/>

            {/* Entrance arch */}
            <rect x="214" y="215" width="92" height="57" fill="#09111e" rx="2"/>
            <ellipse cx="260" cy="215" rx="46" ry="16" fill="#0c1c2e"/>
            {/* Doors */}
            <rect x="232" y="236" width="22" height="36" fill="#172a42" rx="2"/>
            <rect x="258" y="236" width="22" height="36" fill="#172a42" rx="2"/>
            <circle cx="256" cy="255" r="2.5" fill="#f59e0b" opacity="0.85"/>
            <circle cx="264" cy="255" r="2.5" fill="#f59e0b" opacity="0.85"/>
            {/* Columns */}
            <rect x="218" y="215" width="8" height="57" fill="#142034"/>
            <rect x="294" y="215" width="8" height="57" fill="#142034"/>

            {/* Street lamps */}
            <rect x="168" y="232" width="3" height="40" fill="#1e3a5c"/>
            <ellipse cx="169" cy="231" rx="13" ry="4" fill="#1a3050"/>
            <ellipse cx="169" cy="229" rx="6" ry="3.5" fill="#fef08a" opacity="0.75"/>
            <rect x="349" y="232" width="3" height="40" fill="#1e3a5c"/>
            <ellipse cx="350" cy="231" rx="13" ry="4" fill="#1a3050"/>
            <ellipse cx="350" cy="229" rx="6" ry="3.5" fill="#fef08a" opacity="0.75"/>

            {/* Trees */}
            <ellipse cx="92" cy="260" rx="24" ry="30" fill="#0b2616"/>
            <ellipse cx="92" cy="254" rx="19" ry="24" fill="#0e3420"/>
            <rect x="89" y="263" width="6" height="12" fill="#091810"/>
            <ellipse cx="428" cy="260" rx="24" ry="30" fill="#0b2616"/>
            <ellipse cx="428" cy="254" rx="19" ry="24" fill="#0e3420"/>
            <rect x="425" y="263" width="6" height="12" fill="#091810"/>

            {/* Ground glow */}
            <ellipse cx="260" cy="274" rx="60" ry="5" fill="#f59e0b" opacity="0.06"/>
          </svg>

          {/* Stats bar — only on desktop, chips on mobile */}
          {!isMobile && (
            <div style={{
              position:"relative", zIndex:3,
              display:"flex", width:"100%", maxWidth:520,
              background:"rgba(255,255,255,0.045)",
              backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"14px 14px 0 0",
              overflow:"hidden",
              opacity: mounted ? 1 : 0,
              transition:"opacity 0.8s ease 0.6s",
            }}>
              {stats.map((s,i)=>(
                <div key={i} style={{
                  flex:1, padding:"15px 20px",
                  borderRight: i<2?"1px solid rgba(255,255,255,0.06)":"none",
                  textAlign:"center",
                }}>
                  <div className="stat-shimmer" style={{ fontSize:22, fontWeight:700, fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2, letterSpacing:"0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile: scrolling chip strip */}
          {isMobile && (
            <div style={{ position:"relative", zIndex:3, width:"100%", overflow:"hidden",
              padding:"12px 0", borderTop:"1px solid rgba(255,255,255,0.07)",
              opacity: mounted?1:0, transition:"opacity 0.8s ease 0.5s" }}>
              <div style={{ display:"flex", overflow:"hidden" }}>
                <div className="chip-track">
                  {[...chips,...chips].map((c,i)=>(
                    <div key={i} style={{
                      background:"rgba(255,255,255,0.07)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:20, padding:"5px 14px",
                      fontSize:12, color:"rgba(255,255,255,0.75)",
                      whiteSpace:"nowrap", flexShrink:0,
                    }}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            LOGIN FORM SECTION
        ═══════════════════════════════════════════ */}
        <div className="dot-texture" style={{
          flex: isMobile ? "1 1 auto" : "0 0 420px",
          background:"#f8f5f0",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          padding: isMobile ? "32px 24px 40px" : "48px 44px",
          position:"relative",
          overflow:"hidden",
        }}>
          {/* Corner decorations */}
          <div style={{ position:"absolute", top:0, right:0, width:110, height:110,
            background:"linear-gradient(225deg,rgba(245,158,11,0.13),transparent)",
            borderRadius:"0 0 0 100%", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, width:70, height:70,
            background:"linear-gradient(45deg,rgba(14,30,52,0.07),transparent)",
            borderRadius:"0 100% 0 0", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1, maxWidth: isMobile ? 400 : "none", margin:"0 auto", width:"100%" }}>

            {/* Brand */}
            <div style={{
              display:"flex", alignItems:"center", gap:12,
              marginBottom: isMobile ? 24 : 32,
              opacity: mounted?1:0,
              animation: mounted ? "fadeUp 0.6s ease 0.1s both" : "none",
            }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background:"#0e1e34", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 18px rgba(14,30,52,0.22)",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9,22 9,12 15,12 15,22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 17 : 19,
                  fontWeight:700, color:"#0e1e34", lineHeight:1.1 }}>StayNest HMS</div>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:"0.09em", marginTop:2 }}>
                  HOSTEL MANAGEMENT SYSTEM
                </div>
              </div>
            </div>

            {/* Heading */}
            <div style={{
              marginBottom: isMobile ? 22 : 28,
              opacity: mounted?1:0,
              animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none",
            }}>
              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize: isMobile ? 26 : 30,
                fontWeight:700, color:"#0e1e34",
                lineHeight:1.2, letterSpacing:"-0.02em",
              }}>Welcome back</h1>
              <p style={{ fontSize:14, color:"#64748b", marginTop:6 }}>
                Sign in to access your hostel portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              opacity: mounted?1:0,
              animation: mounted ? "fadeUp 0.6s ease 0.35s both" : "none",
            }}>
              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#475569",
                  letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>
                  Email Address
                </label>
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
                    color: focused==="email" ? "#f59e0b" : "#b0aaa4", transition:"color 0.2s", pointerEvents:"none" }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input className="input-field" type="email" value={email}
                    onChange={e=>setEmail(e.target.value)}
                    onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
                    placeholder="your@email.com" required/>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#475569",
                    letterSpacing:"0.1em", textTransform:"uppercase" }}>Password</label>
                  <button type="button" style={{ fontSize:12, color:"#f59e0b", background:"none",
                    border:"none", cursor:"pointer", fontWeight:500, fontFamily:"'DM Sans',sans-serif" }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
                    color: focused==="password" ? "#f59e0b" : "#b0aaa4", transition:"color 0.2s", pointerEvents:"none" }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input className="input-field" type={showPass?"text":"password"}
                    value={password} onChange={e=>setPassword(e.target.value)}
                    onFocus={()=>setFocused("password")} onBlur={()=>setFocused(null)}
                    placeholder="Enter your password" required
                    style={{ paddingRight:44 }}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer", color:"#b0aaa4", display:"flex",
                      padding:0 }}>
                    {showPass
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                    }
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: isMobile ? 20 : 24 }}>
                <div style={{ width:16, height:16, borderRadius:4, border:"2px solid #d9d3cc",
                  background:"white", cursor:"pointer", flexShrink:0 }}/>
                <span style={{ fontSize:13, color:"#64748b" }}>Keep me signed in</span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <>
                      <svg className="spin-icon" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                        <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Authenticating…
                    </>
                  : <>
                      Sign In to Portal
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12,5 19,12 12,19"/>
                      </svg>
                    </>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:12,
              margin: isMobile ? "20px 0 16px" : "24px 0 18px",
              opacity: mounted?1:0, animation: mounted?"fadeUp 0.6s ease 0.5s both":"none" }}>
              <div style={{ flex:1, height:1, background:"#e4dfd9" }}/>
              <span style={{ fontSize:10, color:"#a39e98", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>SECURE ACCESS</span>
              <div style={{ flex:1, height:1, background:"#e4dfd9" }}/>
            </div>

            {/* Trust badges */}
            <div style={{
              display:"flex", gap: isMobile ? 8 : 12,
              justifyContent:"center", flexWrap:"wrap",
              opacity: mounted?1:0, animation: mounted?"fadeUp 0.6s ease 0.6s both":"none",
            }}>
              {["🔒 SSL Encrypted","✦ Role-based Access","📱 Mobile Ready"].map(b=>(
                <span key={b} style={{ fontSize:10, color:"#a39e98", whiteSpace:"nowrap" }}>{b}</span>
              ))}
            </div>

            {/* Mobile stats row */}
            {isMobile && (
              <div style={{
                display:"flex", gap:0, marginTop:24,
                background:"rgba(14,30,52,0.06)",
                borderRadius:12, overflow:"hidden",
                border:"1px solid rgba(14,30,52,0.08)",
                opacity: mounted?1:0, animation: mounted?"fadeUp 0.6s ease 0.65s both":"none",
              }}>
                {stats.map((s,i)=>(
                  <div key={i} style={{
                    flex:1, padding:"12px 8px", textAlign:"center",
                    borderRight: i<2?"1px solid rgba(14,30,52,0.08)":"none",
                  }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700,
                      color:"#0e1e34" }}>{s.value}</div>
                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:1, letterSpacing:"0.04em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <p style={{ textAlign:"center", fontSize:11, color:"#a39e98",
              marginTop: isMobile ? 16 : 24,
              opacity: mounted?1:0, animation: mounted?"fadeUp 0.6s ease 0.7s both":"none" }}>
              Need help?{" "}
              <button style={{ color:"#f59e0b", background:"none", border:"none",
                cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
                Contact IT Support
              </button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}