import React from 'react'
import Table from '../../../../components/Reusable/Table';

const DashboardHome = () => {

    
  const columns = ["Hostel", "Owner", "Location", "Rooms", "Status"]
  
  const hostels = [
    { title: "Sunrise Hostel", subtitle: "Amit Sharma", helpertext: 50, status: "Active", location: "Mumbai" },
    { title: "Green View PG", subtitle: "Rahul Verma", helpertext: 30, status: "Active", location: "Pune" },
    { title: "City Nest", subtitle: "Priya Nair", helpertext: 45, status: "Pending", location: "Bangalore" },
    { title: "Blue Horizon", subtitle: "Karan Mehta", helpertext: 25, status: "Active", location: "Delhi" },
  ];

    
      const stats = [
    {
      label: "Total Hostels",
      value: "12",
      change: "+2 this month",
      iconBg: "bg-violet-500/10 border-violet-500/20",
      iconColor: "text-violet-400",
      dotColor: "bg-violet-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Total Owners",
      value: "8",
      change: "+1 this month",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      dotColor: "bg-emerald-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Total Users",
      value: "120",
      change: "+14 this month",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      iconColor: "text-rose-400",
      dotColor: "bg-rose-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];


  return (
    <>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Table
          columns={columns}
          data={hostels}
          />
    </>
  )
}

export default DashboardHome
