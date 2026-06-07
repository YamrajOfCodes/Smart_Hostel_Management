import { useState } from "react";
import NoticeSubmitModal from "../../../../components/Models/Resident/NoticePeriodModals/NoticeSubmitModal";
import { ActiveNoticeBanner, InfoTile, NoActiveNotice, ProcessStep } from "../../../../components/ResidentComponents/NoticePeriod/NoticePeriodComponents";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useGetMyNoticePeriod, useSubmitNoticePeriod } from "../../../../hooks/UserHooks/noticePeriodHooks";

/* ─────────────────────────────────────────────
   Inline SVG icon helper
───────────────────────────────────────────── */
const Icon = ({ paths, size = 18, strokeWidth = 1.75, fill = "none", stroke = "currentColor", className = "" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}
  >
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:     ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
  calendar:  ["M3 9h18", "M16 3v4", "M8 3v4", "M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  rupee:     ["M6 3h12", "M6 8h12", "M6 13h8a4 4 0 000-8", "M6 21l7-8"],
  checkCircle: ["M22 11.08V12a10 10 0 11-5.93-9.14", "M22 4L12 14.01l-3-3"],
  alertCircle: ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 8v4", "M12 16h.01"],
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  info:      ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 16v-4", "M12 8h.01"],
  search:    ["M3 7a4 4 0 018 0c0 3-2 5-4 7H3V7z", "M10.5 17H21"],
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
};

const RESIDENT = {
  name:          "Arjun Mehta",
  room:          "A-204",
  hostel:        "Sunrise Boys Hostel",
  joinedDate:    "12 Jan 2024",
  depositAmount: "₹17,000",
  noticeDays:    30,
};

/* ─────────────────────────────────────────────
   Vacating process steps
───────────────────────────────────────────── */
const VACATING_STEPS = [
  {
    stepNumber: "01",
    title:      "Submit Notice",
    description: "Choose your planned vacating date and submit the notice.",
    accentColor: "bg-teal-500",
    textColor:   "text-teal-700",
    bgColor:     "bg-teal-50",
    borderColor: "border-teal-100",
  },
  {
    stepNumber: "02",
    title:      "Warden Approval",
    description: "Warden reviews your request and confirms the notice period start date.",
    accentColor: "bg-blue-500",
    textColor:   "text-blue-700",
    bgColor:     "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    stepNumber: "03",
    title:      "Room Inspection",
    description: "A scheduled inspection is conducted 2 days prior to vacating.",
    accentColor: "bg-amber-500",
    textColor:   "text-amber-700",
    bgColor:     "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    stepNumber: "04",
    title:      "Deposit Refund",
    description: "Security deposit refunded within 7 working days post clearance.",
    accentColor: "bg-violet-500",
    textColor:   "text-violet-700",
    bgColor:     "bg-violet-50",
    borderColor: "border-violet-100",
  },
];


function PageNoticePeriod() {
  const [activeVacatingDate, setActiveVacatingDate] = useState(null); // null = no notice served
  const [isModalOpen, setIsModalOpen]               = useState(false);
  let [token,setToken] = useState(null);
  const [mynotice,setMyNotice] = useState(null);
  const {mutate:submitnoticeperiod} = useSubmitNoticePeriod();
  const {data:mynoticePeriod} = useGetMyNoticePeriod(token?.email);



  console.log(token);

  useEffect(()=>{ 
   const loginToken = localStorage.getItem("login");
   if(!loginToken){
     return null;
   } 
   const decodeToken = jwtDecode(loginToken);
   setToken(decodeToken);
   },[]);

useEffect(() => {
  setActiveVacatingDate(mynoticePeriod?.noticePeriod || "");
}, [mynoticePeriod]);

  const handleNoticeSubmit = (vacatingDate) => {
    const formatted = new Date(vacatingDate).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    const {name,email,roomNumber,hostelId} = token;
    console.log(token);
    const payload = {
        hostelId,
        name,
        email,
        roomNumber,
        formatted
    }
    submitnoticeperiod(payload,{
      onSuccess:()=>{
        setIsModalOpen(false);
      }
    })
    console.log(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Notice Period</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your room vacating notice · {RESIDENT.hostel}</p>
      </div>

      {/* Notice status card */}
      {activeVacatingDate
        ? <ActiveNoticeBanner vacatingDate={activeVacatingDate} />
        : <NoActiveNotice onServeNotice={() => setIsModalOpen(true)} />
      }

      {/* Info tiles row */}
      <div className="grid grid-cols-3 gap-3">
        <InfoTile
          iconPaths={ICONS.clock}
          iconStroke="#1e40af"
          bgColor="bg-blue-50"
          borderColor="border-blue-100"
          labelColor="text-blue-600"
          label="Notice Period"
          valueColor="text-blue-700"
          value={`${RESIDENT.noticeDays} Days`}
        />
        <InfoTile
          iconPaths={ICONS.calendar}
          iconStroke="#166534"
          bgColor="bg-emerald-50"
          borderColor="border-emerald-100"
          labelColor="text-emerald-600"
          label="Joined On"
          valueColor="text-emerald-700"
          value={RESIDENT.joinedDate}
        />
        <InfoTile
          iconPaths={ICONS.rupee}
          iconStroke="#5b21b6"
          bgColor="bg-violet-50"
          borderColor="border-violet-100"
          labelColor="text-violet-600"
          label="Deposit"
          valueColor="text-violet-700"
          value={RESIDENT.depositAmount}
        />
      </div>

      {/* Vacating process timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-base">Vacating Process</p>
          <p className="text-xs text-slate-400 mt-0.5">Follow these steps when planning to vacate</p>
        </div>
        <div className="p-5">
          {VACATING_STEPS.map((step, index) => (
            <ProcessStep
              key={step.stepNumber}
              step={step}
              isLast={index === VACATING_STEPS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Notice submission modal */}
      {isModalOpen && (
        <NoticeSubmitModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNoticeSubmit}
        />
      )}

    </div>
  );
}

export default PageNoticePeriod;