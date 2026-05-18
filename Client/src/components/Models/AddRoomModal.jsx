import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ─── VALIDATION SCHEMA ────────────────────────────────────────
const schema = yup.object({
  floor: yup
    .string()
    .required("Floor is required"),

  roomNumber: yup
    .string()
    .required("Room number is required")
    .matches(/^[A-Za-z0-9\-]+$/, "Only letters, numbers and hyphens allowed")
    .max(10, "Max 10 characters"),

  roomType: yup
    .string()
    .oneOf(["AC", "Non-AC"], "Select a valid room type")
    .required("Room type is required"),

  roomSharing: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Minimum 1 bed")
    .max(10, "Maximum 10 beds")
    .integer("Must be a whole number")
    .required("Number of beds is required"),

  roomRent: yup
    .number()
    .typeError("Must be a valid amount")
    .min(1, "Rent must be greater than 0")
    .required("Monthly rent is required"),

  roomMembers: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .integer("Must be a whole number")
    .required("Current occupancy is required")
    .test(
      "not-exceeds-sharing",
      "Occupancy cannot exceed total beds",
      function (value) {
        const { roomSharing } = this.parent;
        if (!roomSharing || value === undefined) return true;
        return value <= roomSharing;
      }
    ),

  status: yup
    .string()
    .oneOf(["vacant", "occupied", "partial", "maintenance"])
    .required("Status is required"),

  amenities: yup.array().of(yup.string()).default([]),

  notes: yup.string().max(300, "Max 300 characters").optional(),
});

// ─── CONSTANTS ────────────────────────────────────────────────
const FLOORS = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];

const ROOM_TYPES = [
  { value: "AC",    label: "AC" },
  { value: "Non-AC",   label: "Non-AC" },
];

const STATUS_OPTIONS = [
  { value: "vacant",      label: "Vacant" },
  { value: "occupied",    label: "Occupied" },
  { value: "partial",     label: "Partial" },
  { value: "maintenance", label: "Maintenance" },
];

const AMENITIES = [
  { id: "wifi",          label: "Wi-Fi" },
  { id: "ac",            label: "AC" },
  { id: "tv",            label: "TV" },
  { id: "geyser",        label: "Geyser" },
  { id: "fridge",        label: "Fridge" },
  { id: "attached_bath", label: "Attached Bath" },
  { id: "parking",       label: "Parking" },
  { id: "laundry",       label: "Laundry" },
];

// ─── FIELD ERROR ──────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <span style={{
      fontSize: "11px",
      color: "#e24b4a",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </span>
  );
}

// ─── LABEL ────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{
      fontSize: "12px",
      fontWeight: 500,
      color: "#64748b",
      display: "block",
      marginBottom: "6px",
      letterSpacing: "0.01em",
    }}>
      {children}
      {required && <span style={{ color: "#e24b4a", marginLeft: "3px" }}>*</span>}
    </label>
  );
}

// ─── INPUT STYLES ─────────────────────────────────────────────
const inputStyle = (hasError) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  fontSize: "13.5px",
  border: `1px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
  borderRadius: "10px",
  outline: "none",
  background: hasError ? "#fff5f5" : "#f8fafc",
  color: "#0f172a",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
});

const selectStyle = (hasError) => ({
  ...inputStyle(hasError),
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
  cursor: "pointer",
});

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function AddRoomModal({ onClose, onSubmit: onSubmitProp }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      floor: "",
      roomNumber: "",
      roomType: "",
      roomSharing: "",
      roomMembers: 0,
      roomRent: "",
      status: "vacant",
      amenities: [],
      notes: "",
    },
  });

  // Auto-derive status from members vs sharing
  const watchSharing = watch("roomSharing");
  const watchMembers = watch("roomMembers");
  useEffect(() => {
    const sharing = Number(watchSharing);
    const members = Number(watchMembers);
    if (!sharing) return;
    if (members === 0) setValue("status", "vacant");
    else if (members >= sharing) setValue("status", "occupied");
    else setValue("status", "partial");
  }, [watchSharing, watchMembers, setValue]);

  const onSubmit = async (data) => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 600));
    console.log("Payload →", data);
    if (onSubmitProp) onSubmitProp(data);
    if (onClose) onClose();
  };

  // Amenities toggle helper
  const watchAmenities = watch("amenities");
  const toggleAmenity = (id) => {
    const current = watchAmenities || [];
    setValue(
      "amenities",
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px",
              borderRadius: "12px",
              background: "#0f172a",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#0f172a" }}>Add new room</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Fill in all required fields</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "transparent",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── FORM BODY ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ overflowY: "auto", flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
        >

          {/* Row 1: Floor + Room Number */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label required>Floor</Label>
              <select {...register("floor")} style={selectStyle(!!errors.floor)}>
                <option value="">Select floor</option>
                {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <FieldError message={errors.floor?.message} />
            </div>
            <div>
              <Label required>Room number</Label>
              <input
                {...register("roomNumber")}
                placeholder="e.g. A-101"
                style={inputStyle(!!errors.roomNumber)}
              />
              <FieldError message={errors.roomNumber?.message} />
            </div>
          </div>

          {/* Row 2: Room Type */}
          <div>
            <Label required>Room type</Label>
            <Controller
              name="roomType"
              control={control}
              render={({ field }) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  {ROOM_TYPES.map((rt) => {
                    const active = field.value === rt.value;
                    return (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => field.onChange(rt.value)}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          fontSize: "13px",
                          fontWeight: 500,
                          border: `1px solid ${active ? "#0f172a" : "#e2e8f0"}`,
                          borderRadius: "10px",
                          background: active ? "#0f172a" : "#f8fafc",
                          color: active ? "#fff" : "#475569",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        {rt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError message={errors.roomType?.message} />
          </div>

          {/* Row 3: Beds (roomSharing) + Current Members */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label required>Total beds</Label>
              <input
                {...register("roomSharing")}
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 4"
                style={inputStyle(!!errors.roomSharing)}
              />
              <FieldError message={errors.roomSharing?.message} />
            </div>
            <div>
              <Label required>Current occupancy</Label>
              <input
                {...register("roomMembers")}
                type="number"
                min="0"
                placeholder="e.g. 2"
                style={inputStyle(!!errors.roomMembers)}
              />
              <FieldError message={errors.roomMembers?.message} />
            </div>
          </div>

          {/* Row 4: Rent + Auto Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label required>Monthly rent (₹)</Label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "13px", color: "#94a3b8", pointerEvents: "none",
                }}>₹</span>
                <input
                  {...register("roomRent")}
                  type="number"
                  min="0"
                  placeholder="8500"
                  style={{ ...inputStyle(!!errors.roomRent), paddingLeft: "26px" }}
                />
              </div>
              <FieldError message={errors.roomRent?.message} />
            </div>
            <div>
              <Label required>Status</Label>
              <select {...register("status")} style={selectStyle(!!errors.status)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <FieldError message={errors.status?.message} />
              <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", display: "block" }}>
                Auto-set from occupancy
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <Controller
              name="amenities"
              control={control}
              render={() => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {AMENITIES.map((a) => {
                    const active = (watchAmenities || []).includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAmenity(a.id)}
                        style={{
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 500,
                          border: `1px solid ${active ? "#0f172a" : "#e2e8f0"}`,
                          borderRadius: "8px",
                          background: active ? "#0f172a" : "#f8fafc",
                          color: active ? "#fff" : "#475569",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {/* Notes */}
          <div>
            <Label>
              Notes{" "}
              <span style={{ fontWeight: 400, color: "#cbd5e1" }}>(optional)</span>
            </Label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Any additional details about this room…"
              style={{
                ...inputStyle(!!errors.notes),
                resize: "vertical",
                lineHeight: "1.5",
                minHeight: "64px",
              }}
            />
            <FieldError message={errors.notes?.message} />
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            paddingTop: "0.5rem",
            borderTop: "1px solid #f1f5f9",
            marginTop: "0.5rem",
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 20px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#475569",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "9px 22px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "10px",
                border: "none",
                background: isSubmitting ? "#94a3b8" : "#0f172a",
                color: "#fff",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
            >
              {isSubmitting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add room
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}