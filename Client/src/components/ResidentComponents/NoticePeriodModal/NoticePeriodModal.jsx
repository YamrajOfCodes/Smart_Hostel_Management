import { useState } from "react";
import Modal from "../Modal/Modal";
import FieldLabel from "../../Reusable/FieldLabel";
import TextInput from "../../Reusable/TextInput";
import TextArea from "../../Reusable/TextArea";

function NoticePeriodModal({ active, onClose, onActivate }) {

  const IC = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  bell:    ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  warn:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  wrench:  ["M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"],
  file:    ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logout:  ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:    ["M3 12h18","M3 6h18","M3 18h18"],
  close:   ["M18 6L6 18","M6 6l12 12"],
  plus:    ["M12 5v14","M5 12h14"],
  dl:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  check:   "M20 6L9 17l-5-5",
  clock:   ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"],
  send:    ["M22 2L11 13","M22 2L15 22l-4-9-9-4 22-7z"],
  cal:     ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  chevR:   ["M9 18l6-6-6-6"],
  chat:    ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
};

const Ic = ({ d, size = 18, sw = 2, fill = "none", stroke = "currentColor" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0 block"
  >
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

  const [vacDate, setVacDate] = useState("");
  const [reason, setReason]   = useState("");

  const submit = (e) => {
    e.preventDefault();
    onActivate(vacDate);
    onClose();
  };

  return (
    <Modal title={active ? "Notice Period Active" : "Serve Notice Period"} onClose={onClose}>
      {active ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <Ic d={IC.shield} size={28} stroke="#d97706" />
          </div>
          <p className="font-bold text-amber-700 text-lg">Notice Period Active</p>
          <p className="text-sm text-amber-600">Your vacating date is set to</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-display text-2xl font-bold text-amber-800">{active}</p>
          </div>
          <p className="text-xs text-slate-400">Contact your warden to modify or withdraw.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">⚠️ Important</p>
            <p>Once submitted, a 30-day notice period begins. This cannot be undone without warden approval.</p>
          </div>

          <div>
            <FieldLabel>Planned Vacating Date</FieldLabel>
            <TextInput type="date" value={vacDate} onChange={e => setVacDate(e.target.value)} required />
          </div>

          <div>
            <FieldLabel>Reason (Optional)</FieldLabel>
            <TextArea rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for leaving…" />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-100 transition-all"
          >
            <Ic d={IC.shield} size={14} /> Confirm Notice Period
          </button>
        </form>
      )}
    </Modal>
  );
}

export default NoticePeriodModal