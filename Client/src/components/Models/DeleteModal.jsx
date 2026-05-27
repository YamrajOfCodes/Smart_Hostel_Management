import { Trash2, X, TriangleAlert } from "lucide-react";

function DeleteModal({ isOpen, onClose, onConfirm, title, description, itemName }) {
  if (!isOpen) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-red-500" />
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <TriangleAlert size={20} className="text-red-500" />
            </div>

            <div className="flex-1 pt-0.5">
              <h2 className="text-[15px] font-semibold text-slate-800">
                {title || "Delete Hostel"}
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {description || (
                  <>
                    You're about to permanently delete{" "}
                    <span className="font-semibold text-slate-700">
                      {itemName || "this hostel"}
                    </span>
                    . This will remove all associated rooms, tenants, and records.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <Trash2 size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600 leading-relaxed">
              This action <span className="font-semibold">cannot be undone</span>. All tenant assignments, room data, and complaint history will be permanently erased.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl cursor-pointer border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 h-10 rounded-xl cursor-pointer bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow-sm shadow-red-200"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;