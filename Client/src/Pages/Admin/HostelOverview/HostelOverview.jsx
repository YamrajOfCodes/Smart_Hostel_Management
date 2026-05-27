import { useEffect, useState } from "react";
import AdminDashboard from "../AdminDashboard";
import { useLogout } from "../../../hooks/authHooks/authHooks";
import HostelCard from "../../../components/AdminComponents/HostelCard/HostelCard";
import SummaryStrip from "../../../components/AdminComponents/SummaryCard/SummaryStrip";
import {Outlet, useNavigate} from "react-router-dom"
import { protectRoute } from "../../../utils/ProtectedRoutes/ProtectedRoutes";
import { jwtDecode } from "jwt-decode";
import AddHostelModal from "../../../components/Models/AddHostelModal";
import { usedeleteHostel, usegetHostels, useRegisterHostel, useUpdateHostel } from "../../../hooks/AdminHooks/adminHooks";
import toast from "react-hot-toast";
import DeleteModal from "../../../components/Models/DeleteModal";


const hostelsData = [
  {
    id: 1,
    name: "Sunrise PG & Hostel",
    city: "Pune, Maharashtra",
    totalRooms: 170,
    occupied: 153,
    complaints: 8,
    monthlyRevenue: "₹2.4L",
    status: "active",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Green Valley Boys Hostel",
    city: "Mumbai, Maharashtra",
    totalRooms: 120,
    occupied: 94,
    complaints: 3,
    monthlyRevenue: "₹1.8L",
    status: "active",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Pearl Ladies PG",
    city: "Nagpur, Maharashtra",
    totalRooms: 80,
    occupied: 52,
    complaints: 5,
    monthlyRevenue: "₹1.1L",
    status: "active",
    color: "#8b5cf6",
  },
  {
    id: 4,
    name: "Horizon Co-living",
    city: "Nashik, Maharashtra",
    totalRooms: 60,
    occupied: 13,
    complaints: 1,
    monthlyRevenue: "₹0.3L",
    status: "setup",
    color: "#f59e0b",
  },
];

export default function HostelOverview() {

    const login = localStorage.getItem("login");
    const decodeToken = jwtDecode(login);
    // console.log(decodeToken);

  const [selectedHostel, setSelectedHostel] = useState(null);
  const [hostelModel,setHostelModal] = useState(false);
  
    const [editId,setEditId] = useState(null);
    const [editText,setEditText] = useState({});

    const [ShowDeleteModal,setShowDeleteModal] = useState(false);
    const [deleteHostelName,setDeleteHostelName] = useState({})

  const { mutate: logout } = useLogout();
  const {mutate:createhostel} = useRegisterHostel();
  const {mutate:updatehostel} = useUpdateHostel();
  const {mutate:deletehostel} = usedeleteHostel();
  const {data:getAssociateHostels} = usegetHostels(decodeToken?._id)
  const navigate = useNavigate();


    
    const handleEdit = (id,editData)=>{
      setEditId(id);
      setEditText(editData);
      setHostelModal(true);
    }

  // console.log(getAssociateHostels)


  const handleHostelModel = ()=>{
    setEditId(null);
    setEditText({});
    setHostelModal(false);
  }

 const handleDelete = (id)=>{
  deletehostel(id)
 }

  const handleHostel = (data)=>{
    data.ownerId = decodeToken._id;
    console.log(editId);
    console.log(data)
    editId !== null ? updatehostel({data,editId},{
      onSuccess:()=>{
        setEditId(null);
        setEditText({});
      }
    }) :createhostel(data);
    setHostelModal(false);
  }
  


useEffect(()=>{
  protectRoute(navigate, 'admin');
},[]);



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        body { font-family: 'DM Sans', sans-serif; }
        .dot-bg {
          background-image: radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 dot-bg">

        {/* Top navbar */}
        <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="w-full mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              S
            </div>
            <div>
              <p className="font-display font-bold text-slate-800 text-sm leading-tight">
                StayNest HMS
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Owner Portal
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => logout()}
                className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Logout
              </button>
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="w-full mx-auto px-4 sm:px-6 py-8">

          {/* Page title */}
       <div className="flex">
           <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-800">
              Your Hostels
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select a hostel to view and manage its dashboard.
            </p>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setHostelModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/25"
            >
              Add New Hostel
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
       </div>

          {/* Summary numbers */}
          <SummaryStrip hostels={hostelsData} />
          

          {/* Hostel cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getAssociateHostels?.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                onClick={() => setSelectedHostel(hostel)}
                editId={editId}
                setEditId={setEditId}
                editText={editText}
                handleEdit={handleEdit}
                setShowDeleteModal={setShowDeleteModal}
                setDeleteId={setDeleteHostelName}
              />
            ))}

            {/* Add new hostel card */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[260px] cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group" onClick={()=>{setHostelModal(true)}}>
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 group-hover:border-blue-400 flex items-center justify-center text-slate-400 group-hover:text-blue-500 text-2xl transition-colors">
                +
              </div>
              <p className="text-sm text-slate-400 group-hover:text-blue-500 mt-3 transition-colors">
                Add new hostel
              </p>
            </div>
          </div>

        </main>
      </div>

      {
        hostelModel && 
        <AddHostelModal 
        onClose={handleHostelModel} 
        onSubmit={handleHostel}
        editId={editId}
        setEditId={setEditId}
        editText={editText}
        />
      }

      {
        ShowDeleteModal && (
          <DeleteModal
          isOpen={ShowDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(deleteHostelName.deleteId)}
          itemName={deleteHostelName.hostelname}
      />
        )
      }
    </>
  );
}