import { useState, useEffect }   from "react";
import { jwtDecode }             from "jwt-decode";
import NoticeSubmitModal         from "../../../../components/Models/Resident/NoticePeriodModals/NoticeSubmitModal";
import {
  NoActiveNotice,
  PendingNoticeBanner,
  ApprovedNoticeBanner,
  RejectedNoticeBanner,
  InfoTile,
  ProcessStep,
} from "../../../../components/ResidentComponents/NoticePeriod/NoticePeriodComponents";
import {
  useGetMyNoticePeriod,
  useSubmitNoticePeriod,
} from "../../../../hooks/UserHooks/noticePeriodHooks";

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
  clock:    ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
  calendar: ["M3 9h18", "M16 3v4", "M8 3v4", "M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  rupee:    ["M6 3h12", "M6 8h12", "M6 13h8a4 4 0 000-8", "M6 21l7-8"],
};


const VACATING_STEPS = [
  { stepNumber: "01", title: "Submit Notice",   description: "Choose your planned vacating date and submit the notice.",                   accentColor: "bg-teal-500",   textColor: "text-teal-700",   bgColor: "bg-teal-50",   borderColor: "border-teal-100"   },
  { stepNumber: "02", title: "Warden Approval", description: "Warden reviews your request and confirms the notice period start date.",      accentColor: "bg-blue-500",   textColor: "text-blue-700",   bgColor: "bg-blue-50",   borderColor: "border-blue-100"   },
  { stepNumber: "03", title: "Room Inspection", description: "A scheduled inspection is conducted 2 days prior to vacating.",               accentColor: "bg-amber-500",  textColor: "text-amber-700",  bgColor: "bg-amber-50",  borderColor: "border-amber-100"  },
  { stepNumber: "04", title: "Deposit Refund",  description: "Security deposit refunded within 7 working days post clearance.",             accentColor: "bg-violet-500", textColor: "text-violet-700", bgColor: "bg-violet-50", borderColor: "border-violet-100" },
];


const getNoticeState = (noticePeriod) => {
  if (!noticePeriod)               return "none";
  if (noticePeriod === "approved") return "approved";
  if (noticePeriod === "rejected") return "rejected";
  return "pending";
};


function PageNoticePeriod() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token,       setToken]       = useState(null);

  const { mutate: submitNoticePeriod } = useSubmitNoticePeriod();
  const { data: myNoticePeriodData }   = useGetMyNoticePeriod(token?.email);

  const noticePeriodValue = myNoticePeriodData?.noticePeriod || null;
  const noticeState       = getNoticeState(noticePeriodValue);

  useEffect(() => {
    const loginToken = localStorage.getItem("login");
    if (!loginToken) return;
    setToken(jwtDecode(loginToken));
  }, []);

  const handleNoticeSubmit = (vacatingDate) => {
    const formatted = new Date(vacatingDate).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    const { name, email, roomNumber, hostelId } = token;

    submitNoticePeriod(
      { hostelId, name, email, roomNumber, formatted },
      { onSuccess: () => setIsModalOpen(false) }
    );
  };

  /* ── Banner switcher ── */
  const renderNoticeBanner = () => {
    switch (noticeState) {
      case "pending":
        return (
          <PendingNoticeBanner
            vacatingDate={noticePeriodValue}
            onWithdrawSuccess={() => {/* react-query refetches automatically */}}
          />
        );
      case "approved":
        return <ApprovedNoticeBanner />;
      case "rejected":
        return <RejectedNoticeBanner onResubmit={() => setIsModalOpen(true)} />;
      case "none":
      default:
        return <NoActiveNotice onServeNotice={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Notice Period</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your room vacating notice</p>
      </div>

      {/* Banner — driven by noticePeriod value from API */}
      {renderNoticeBanner()}

      {/* Info tiles */}
      <div className="grid grid-cols-3 gap-3">
        <InfoTile
          iconPaths={ICONS.clock}    iconStroke="#1e40af"
          bgColor="bg-blue-50"       borderColor="border-blue-100"
          labelColor="text-blue-600" label="Notice Period"
          valueColor="text-blue-700" value="30 Days"
        />
        <InfoTile
          iconPaths={ICONS.calendar}    iconStroke="#166534"
          bgColor="bg-emerald-50"       borderColor="border-emerald-100"
          labelColor="text-emerald-600" label="Joined On"
          valueColor="text-emerald-700"
          value={
            myNoticePeriodData?.joiningDate
              ? new Date(myNoticePeriodData.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "—"
          }
        />
        <InfoTile
          iconPaths={ICONS.rupee}       iconStroke="#5b21b6"
          bgColor="bg-violet-50"        borderColor="border-violet-100"
          labelColor="text-violet-600"  label="Deposit"
          valueColor="text-violet-700"
          value={
            myNoticePeriodData?.deposite
              ? `₹${Number(myNoticePeriodData.deposite).toLocaleString("en-IN")}`
              : "—"
          }
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