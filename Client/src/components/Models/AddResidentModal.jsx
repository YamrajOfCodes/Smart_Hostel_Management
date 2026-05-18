import { useState } from "react";

function AddResidentModal({ onClose, onAdd }) {


      const avatarColor = (str) => {
      const colors = [
        "bg-blue-500",
        "bg-violet-500",
        "bg-emerald-500",
        "bg-pink-500",
        "bg-amber-500",
        "bg-cyan-500",
      ];
    
      let hash = 0;
    
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
    
      return colors[Math.abs(hash) % colors.length];
    };

    const statusStyle = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);


const Icons = {
  search: [
    "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z",
    "M16 16l4.5 4.5",
  ],

  plus: "M12 5v14 M5 12h14",

  users: [
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
    "M23 21v-2a4 4 0 00-3-3.87",
    "M16 3.13a4 4 0 010 7.75",
    "M9 7a4 4 0 100 8 4 4 0 000-8z",
  ],

  close: "M18 6L6 18 M6 6l12 12",

  phone: ["M22 16.92v3a2 2 0 01-2.18 2", "M16 3h3a2 2 0 012 2v3", "M5 3h3", "M3 5v3", "M16 8a6 6 0 006 6"],

  mail: [
    "M4 4h16v16H4z",
    "M22 6l-10 7L2 6",
  ],

  room: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],

  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 100 6 3 3 0 000-6z",
  ],

  edit: [
    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
    "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  ],

  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
};


  const [form, setForm] = useState({
    name: "",
    room: "",
    floor: "",
    phone: "",
    email: "",
    rent: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      ...form,
      id: Date.now(),
      status: "active",
    });

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 animate-scale">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Add Resident
              </h2>

              <p className="text-slate-500 mt-1">
                Add new hostel resident
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
            >
              <Icon d={Icons.close} size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Room No"
                value={form.room}
                onChange={(e) =>
                  handleChange("room", e.target.value)
                }
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
              />

              <select
                required
                value={form.floor}
                onChange={(e) =>
                  handleChange("floor", e.target.value)
                }
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Select Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
                <option>3rd Floor</option>
              </select>
            </div>

            <input
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <input
              required
              type="number"
              placeholder="Monthly Rent"
              value={form.rent}
              onChange={(e) =>
                handleChange("rent", e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Add Resident
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddResidentModal;