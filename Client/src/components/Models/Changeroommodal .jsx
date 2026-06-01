import { useState, useMemo } from "react";
import { DoorOpen, X, BedDouble } from "lucide-react";

const FLOOR_ORDER = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];

const FLOOR_SHORT = {
  "Ground Floor": "Ground",
  "1st Floor": "1st",
  "2nd Floor": "2nd",
  "3rd Floor": "3rd",
};

/**
 * ChangeRoomModal
 *
 * Props:
 *   member       – the resident to move (shape: { tenantId: { _id, name }, bed })
 *   allRooms     – array of all room objects
 *   currentRoom  – the room object the member currently belongs to
 *   onClose      – () => void
 *   onConfirm    – ({ member, targetRoom }) => void
 */
function ChangeRoomModal({ member, allRooms = [], currentRoom, onClose, onConfirm }) {
  const [floorFilter, setFloorFilter] = useState("All");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const myName = member?.tenantId?.name || "Resident";
  const myRoom = currentRoom?.roomNumber || "—";

  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Unique floors present
  const floors = useMemo(() => {
    const set = new Set(allRooms.map((r) => r.floor).filter(Boolean));
    return FLOOR_ORDER.filter((f) => set.has(f));
  }, [allRooms]);

  // Filter rooms: exclude current, filter by floor, only rooms with free beds
  const availableRooms = useMemo(() => {
    return allRooms.filter((room) => {
      if (room._id === currentRoom?._id) return false;
      const occupied = room.roomMembers?.length || 0;
      const free = room.totalBeds - occupied;
      if (free <= 0) return false;
      if (floorFilter !== "All" && room.floor !== floorFilter) return false;
      return true;
    });
  }, [allRooms, currentRoom, floorFilter]);

  // Full rooms (same floor filter, excluding current) — shown greyed out for context
  const fullRooms = useMemo(() => {
    return allRooms.filter((room) => {
      if (room._id === currentRoom?._id) return false;
      const occupied = room.roomMembers?.length || 0;
      const free = room.totalBeds - occupied;
      if (free > 0) return false;
      if (floorFilter !== "All" && room.floor !== floorFilter) return false;
      return true;
    });
  }, [allRooms, currentRoom, floorFilter]);

  const allDisplayRooms = [
    ...availableRooms.map((r) => ({ ...r, isFull: false })),
    ...fullRooms.map((r) => ({ ...r, isFull: true })),
  ].sort((a, b) => String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true }));

  const selectedRoom = availableRooms.find((r) => r._id === selectedRoomId);
  const freeBeds = selectedRoom
    ? selectedRoom.totalBeds - (selectedRoom.roomMembers?.length || 0)
    : 0;

  const handleConfirm = () => {
    if (!selectedRoom) return;
    onConfirm?.({ member, targetRoom: selectedRoom });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <DoorOpen size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-[14px]">Change room</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {myName} · currently Room {myRoom}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          {/* Resident */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Moving
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[11px] font-bold text-amber-700 flex-shrink-0">
                {initials(myName)}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">{myName}</p>
                <p className="text-[10px] text-slate-400">Room {myRoom}</p>
              </div>
            </div>
          </div>

          {/* Floor filter */}
          {floors.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Filter by floor
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {["All", ...floors].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFloorFilter(f);
                      setSelectedRoomId(""); // reset selection on floor change
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all
                      ${floorFilter === f
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    {FLOOR_SHORT[f] || f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Room grid */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Select room
              <span className="ml-1 normal-case font-normal text-slate-300">
                · greyed out = full
              </span>
            </p>

            {allDisplayRooms.length === 0 ? (
              <div className="py-6 text-center">
                <BedDouble size={24} className="text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No available rooms on this floor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {allDisplayRooms.map((room) => {
                  const isSelected = selectedRoomId === room._id;
                  const free = room.totalBeds - (room.roomMembers?.length || 0);
                  return (
                    <button
                      key={room._id}
                      type="button"
                      disabled={room.isFull}
                      onClick={() => setSelectedRoomId(room._id)}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all
                        ${room.isFull
                          ? "border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed"
                          : isSelected
                            ? "border-blue-400 bg-blue-50 border-[1.5px]"
                            : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                    >
                      <span
                        className={`text-[13px] font-bold ${
                          isSelected ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {room.roomNumber}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? "text-blue-500" : "text-slate-400"
                        }`}
                      >
                        {room.isFull ? "Full" : `${free} free`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-3 mt-2.5">
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Available
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                Full
              </span>
            </div>
          </div>

          {/* Summary banner */}
          {selectedRoom && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <DoorOpen size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                <span className="font-bold">Room {myRoom} → Room {selectedRoom.roomNumber}</span>
                {" "}· {freeBeds} bed{freeBeds > 1 ? "s" : ""} available. Billing will continue from the current date.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedRoom}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all"
          >
            <DoorOpen size={13} /> Move resident
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeRoomModal;