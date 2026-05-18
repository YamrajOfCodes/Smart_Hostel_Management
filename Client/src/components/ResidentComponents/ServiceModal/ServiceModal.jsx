import { useState } from "react";
import Modal from "../Modal/Modal";
import FieldLabel from "../../Reusable/FieldLabel";
import TextArea from "../../Reusable/TextArea";
import TextInput from "../../Reusable/TextInput";

function ServiceModal({ onClose, onSubmit }) {

const SERVICES = [
  { emoji:"🔧", label:"Plumbing"    },
  { emoji:"⚡",  label:"Electrical" },
  { emoji:"🧺",  label:"Laundry"   },
  { emoji:"🍽",  label:"Mess/Food" },
  { emoji:"📶",  label:"WiFi/IT"   },
  { emoji:"🔨",  label:"Carpentry" },
  { emoji:"🧹",  label:"Cleaning"  },
  { emoji:"🛏",  label:"Bedding"   },
];

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


  const [cat, setCat]   = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title || !cat) return;
    onSubmit({ id: Date.now(), title, date: "Today", status: "pending", cat });
    onClose();
  };

  return (
    <Modal title="Request a Service" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <FieldLabel>Service Type</FieldLabel>
          <div className="grid grid-cols-4 gap-2">
            {SERVICES.map(s => (
              <button
                key={s.label} type="button" onClick={() => setCat(s.label)}
                className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-[10px] font-semibold border transition-all ${
                  cat === s.label
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>What do you need?</FieldLabel>
          <TextInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fix tap, Extra pillow…" />
        </div>

        <div>
          <FieldLabel>Preferred Date</FieldLabel>
          <TextInput type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
          <FieldLabel>Notes (Optional)</FieldLabel>
          <TextArea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Any special instructions?" />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-100 transition-all"
        >
          <Ic d={IC.send} size={14} /> Submit Request
        </button>
      </form>
    </Modal>
  );
}

export default ServiceModal;