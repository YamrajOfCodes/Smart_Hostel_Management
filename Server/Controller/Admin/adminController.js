import RoomDb from "../../Model/Room/roomSchema.js";
import Hostel from "../../Model/Hostel/hostelModel.js"
import User from "../../Model/User/userSchema.js"


export const RegisterHostel = async (req, res) => {
  try {
    const {hostelName, address, hostelCode, phone, hostelFloors,rentAmount,rooms} = req.body;
    const {ownerId} = req.params;

    if (!hostelName || !address || !ownerId || !hostelCode || !phone || !hostelFloors || !rentAmount || !rooms) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingMob  = await Hostel.findOne({phone});
    const hostelCodeExists = await Hostel.findOne({hostelCode});

    
    if(existingMob){
      return res.status(400).json({ message: "phone number already exists" });
    }

    if(hostelCodeExists){
      return res.status(400).json({message:"Code already exists"});
    }

  

    const newUser = new Hostel({
      hostelName,
      address,
      ownerId,
      hostelCode,
      phone,
      hostelFloors,
      rentAmount,
      room:rooms
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    return res.status(201).json({
      message: "Hostel registered successfully",
      data: userData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getHostels = async(req,res)=>{
  try {
    const {ownerId} = req.params;
    const gethostels = await Hostel.find({ownerId});
    return res.status(200).json({message:"hostels getting successful",data:gethostels});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while fetching hostels"})
  }
}


export const getHostelById = async(req,res)=>{
  try {
    const {hostelId} = req.params;
    const gethostel = await Hostel.findById(hostelId);
    return res.status(200).json({message:"hostels getting successful",data:gethostel});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while fetching hostels"})
  }
}

export const updateHostel = async(req,res)=>{
  try {
    const {hostelId} = req.params;
    const updatedHostel = await Hostel.findByIdAndUpdate(hostelId,req.body,{
      new:true,
      runValidators:true
    })

    if(!updatedHostel){
      return res.status(400).json({error:"hostel is not found"});
    }

    return res.status(200).json({
      message:"hostel updated successfully",
      data:updatedHostel
    })


  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"something went wrong while updating the hostel"});
  }
}


export const deleteHostel = async(req,res)=>{
  try {
    const {hostelId} = req.params;
    const getHostel = await Hostel.findByIdAndDelete(hostelId);

    if(!getHostel){
      return res.status(400).json({error:"hostel is not found"});
    }

    return res.status(200).json({
      message:"hostel deleted successfully",
      data:getHostel
    })


  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"something went wrong while updating the hostel"});
  }
}





export const createRoom = async (req, res) => {
  try {
    const {
      roomNumber, floor, roomCategory, roomType,
      totalBeds, monthlyRent, securityDeposit,
      amenities, notes
    } = req.body;
    const { hostelId } = req.params;

    if (!roomNumber || !floor || !roomCategory || !roomType || !totalBeds || !monthlyRent) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const roomExists = await RoomDb.findOne({ hostelId, roomNumber });
    if (roomExists) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const newRoom = new RoomDb({
      hostelId,
      roomNumber,
      floor,
      roomCategory,
      roomType,
      totalBeds,
      monthlyRent,
      securityDeposit: securityDeposit || 0,
      amenities: amenities || [],
      notes: notes || "",
    });

    await newRoom.save();

    return res.status(201).json({
      message: "Room created successfully",
      data: newRoom,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getallRooms = async(req,res)=>{
    try {
        const getrooms = await RoomDb.find({hostelId:req.params.hostelId});
        return res.status(200).json({message:"rooms fetched successfully",getrooms});
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"something went wrong while getting rooms",error});
    }
}


export const assignedRoom = async(req,res)=>{
    try {
      const { name, email, password, phone,role,joiningDate,deposite,room} = req.body;
  
      if (!name || !email || !password || !phone ) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }
  
      const existingUser = await User.findOne({ email });
      const existingMob  = await User.findOne({phone});
  
      if (existingUser || existingMob) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const newUser = new User({
        name,
        email,
        password,
        phone,
        deposite,
        joiningDate,
        room,
        role:"resident"
      });
  
      await newUser.save();
  
      const userData = newUser.toObject();
      delete userData.password;
  
    const getRooms = await RoomDb.find({
     hostelId: req.params.hostelId,
    });


const filteredRoom = getRooms.find(
  (rm) => rm.roomNumber === room
);

console.log(filteredRoom)

if (!filteredRoom) {
  return res.status(404).json({
    message: "Room not found",
  });
}

filteredRoom.roomMembers.push({
  name,
  email,
  bedNumber: room,
  joinedAt:joiningDate
});

await filteredRoom.save();

res.status(200).json({
  message: "Member added successfully",
  room: filteredRoom,
});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
}