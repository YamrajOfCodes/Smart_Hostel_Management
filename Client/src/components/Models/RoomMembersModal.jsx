import { useState } from "react";
import { BadgeCheck, BedDouble, UserPlus, X, ArrowLeftRight, DoorOpen } from "lucide-react";
import MemberRow from "../AdminComponents/Room_Management/MemberRow/MemberRow";
import SwapResidentModal from "./SwapResidentModal";
import ChangeRoomModal from "./Changeroommodal ";
import { useChangeRoom, useSwapRooms } from "../../hooks/AdminHooks/adminHooks";
import { useEffect } from "react";

const STATUS = {
  occupied:    { label: "Occupied",    bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    border: "border-blue-100" },
  vacant:      { label: "Vacant",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-100" },
  partial:     { label: "Partial",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-100" },
  maintenance: { label: "Maintenance", bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500",    border: "border-rose-100" },
};

const FLOOR_ACCENT = {
  "Ground Floor": "bg-violet-500",
  "1st Floor":    "bg-sky-500",
  "2nd Floor":    "bg-teal-500",
  "3rd Floor":    "bg-amber-500",
};

function ActionBtn({ icon: Icon, label, description, onClick, disabled, color = "slate" }) {
  const colors = {
    slate: "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700",
    amber: "border-amber-100 hover:border-amber-200 hover:bg-amber-50 text-amber-700",
    blue:  "border-blue-100 hover:border-blue-200 hover:bg-blue-50 text-blue-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border transition-all text-left
        disabled:opacity-40 disabled:cursor-not-allowed ${colors[color]}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
        ${color === "amber" ? "bg-amber-50" : color === "blue" ? "bg-blue-50" : "bg-slate-100"}`}>
        <Icon size={15} className={
          color === "amber" ? "text-amber-600" : color === "blue" ? "text-blue-600" : "text-slate-600"
        } />
      </div>
      <div>
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

function RoomMembersPopup({
  room,
  allRooms = [],
  onClose,
  onUnassign,
  onAddResident,
  onSwapConfirm,
  onChangeRoomConfirm,
}) {
  const [activeTab, setActiveTab] = useState("members");

  // Sub-modal state
  const [swapTarget, setSwapTarget]       = useState(null); // member object
  const [changeTarget, setChangeTarget]   = useState(null); // member object

  const s        = STATUS[room.status] ?? STATUS["vacant"];
  const occupied = room.roomMembers?.length || 0;
  const free     = room.totalBeds - occupied;
  const {mutate:swaprooms} = useSwapRooms();
  const {mutate:changeroom} = useChangeRoom();

  const handleRoomSwapMemebers = (data)=>{
    swaprooms(data);
  }

  const handleChangeRoom = (data)=>{
    data.member.hostelId = room.hostelId;
    changeroom(data,{
      onSuccess:()=>{
        setChangeTarget(null);
      }
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}
        >

          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${FLOOR_ACCENT[room.floor] || "bg-slate-500"} flex items-center justify-center`}>
                  <BedDouble size={17} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[15px]">Room {room.roomNumber}</p>
                  <p className="text-xs text-slate-400">{room.floor} · {room.roomType} · {room.totalBeds} beds</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
                <X size={15} />
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: "Total beds", value: room.totalBeds },
                { label: "Occupied",   value: occupied },
                { label: "Available",  value: free },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl py-2.5 text-center">
                  <p className="text-base font-black text-slate-800">{value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 bg-slate-50 rounded-xl p-1">
              {[
                { key: "members", label: "Residents" },
                { key: "actions", label: "Quick Actions" },
              ].map(tab => (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${activeTab === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab: Members */}
          {activeTab === "members" && (
            <div className="flex-1 overflow-y-auto px-4 py-3 max-h-64">
              {occupied === 0 ? (
                <div className="py-10 text-center">
                  <BedDouble size={28} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No residents assigned yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {room.roomMembers.map((member, i) => (
                    <MemberRow
                      key={member?._id || i}
                      member={member}
                      roomId={room?._id}
                      index={i}
                      onUnassign={onUnassign}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Quick Actions */}
          {activeTab === "actions" && (
            <div className="px-4 py-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
              {occupied > 0 && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Per resident
                  </p>
                  {room.roomMembers.map((member, i) => {
                    const name = member?.name || `Resident ${i + 1}`;
                    return (
                      <div key={member?.tenantId?._id || i} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-700">{name}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSwapTarget(member)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-amber-100 bg-amber-50 text-amber-700 text-[11px] font-semibold hover:bg-amber-100 transition-all"
                          >
                            <ArrowLeftRight size={12} /> Swap resident
                          </button>
                          <button
                            type="button"
                            onClick={() => setChangeTarget(member)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 text-[11px] font-semibold hover:bg-blue-100 transition-all"
                          >
                            <DoorOpen size={12} /> Change room
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2 mb-1">
                Room actions
              </p>
              <ActionBtn
                icon={UserPlus}
                label="Add resident"
                description={free > 0 ? `${free} bed${free > 1 ? "s" : ""} available` : "Room is full"}
                onClick={onAddResident}
                disabled={free === 0}
                color="slate"
              />

              {occupied === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-3">
                  No residents to manage yet.
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>

            {free > 0 ? (
              <button onClick={onAddResident}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all">
                <UserPlus size={13} /> Add Resident
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                <BadgeCheck size={13} /> Room is full
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Swap Resident Sub-modal */}
      {swapTarget && (
        <SwapResidentModal
          member={swapTarget}
          allRooms={allRooms}
          currentRoom={room}
          onClose={() => setSwapTarget(null)}
          onConfirm={(payload) => {
            setSwapTarget(null);
            handleRoomSwapMemebers(payload)
          }}
        />
      )}

      {/* Change Room Sub-modal */}
      {changeTarget && (
        <ChangeRoomModal
          member={changeTarget}
          allRooms={allRooms}
          currentRoom={room}
          onClose={() => setChangeTarget(null)}
          onConfirm={handleChangeRoom}
        />
      )}
    </>
  );
}

export default RoomMembersPopup;