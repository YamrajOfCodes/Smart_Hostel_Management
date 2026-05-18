function RoomSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse">
          <div className="h-1 bg-slate-200 rounded mb-5" />
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-2 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-4" />
          <div className="h-10 bg-slate-50 rounded-xl mb-4" />
          <div className="h-8 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default RoomSkeleton;