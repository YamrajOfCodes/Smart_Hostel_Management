function SummaryStrip({ hostels }) {
  const totalHostels = hostels.length;
  const activeHostels = hostels.filter((hostel) => hostel.status === "active").length;
  const totalResidents = hostels.reduce((sum, hostel) => sum + hostel.occupied, 0);
  const totalRooms = hostels.reduce((sum, hostel) => sum + hostel.totalRooms, 0);

  const stats = [
    { label: "Total Hostels", value: totalHostels },
    { label: "Active", value: activeHostels, color: "#16a34a" },
    { label: "Setup Pending", value: totalHostels - activeHostels, color: "#ca8a04" },
    { label: "Total Residents", value: totalResidents },
    { label: "Total Rooms", value: totalRooms },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
        >
          <p
            className="text-2xl font-bold text-slate-800"
            style={stat.color ? { color: stat.color } : {}}
          >
            {stat.value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryStrip;