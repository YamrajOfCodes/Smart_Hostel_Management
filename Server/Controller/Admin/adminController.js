import RoomDb from "../../Model/Room/roomSchema.js";
import Hostel from "../../Model/Hostel/hostelModel.js"
import User from "../../Model/User/userSchema.js"
import complaintDb from "../../Model/Complaints/complaintSchema.js";

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


export const assignedRoom = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      joiningDate,
      deposite,
      room,
      hostelId,
    } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !room || !hostelId) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Find room
    const roomDoc = await RoomDb.findOne({
      _id: room,
      hostelId,
    });

    if (!roomDoc) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check room capacity
    if (roomDoc.roomMembers.length >= roomDoc.totalBeds) {
      return res.status(400).json({
        message: "Room is already full",
      });
    }

    // Create resident
    const newUser = new User({
      name,
      email,
      password,
      phone,
      joiningDate,
      deposite,
      room,
      hostelId,
      roomNumber:roomDoc?.roomNumber,
      role: "resident",
    });

    await newUser.save();

    // Add resident to room
    roomDoc.roomMembers.push({
      residentId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      bedNumber: roomDoc.roomMembers.length + 1,
      joinedAt: joiningDate || new Date(),
    });

    // Update room status
    if (roomDoc.roomMembers.length === roomDoc.totalBeds) {
      roomDoc.status = "occupied";
    } else {
      roomDoc.status = "partial";
    }

    await roomDoc.save();

    const userData = newUser.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "Resident assigned successfully",
      resident: userData,
      room: roomDoc,
    });
  } catch (error) {
    console.error("Assign Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const unassigneRoom = async(req,res)=>{
  try {
    const {email} = req.body;
    const {roomId} = req.params;

    // console.log(email,roomId);

    const getroom = await RoomDb.findById(roomId);
    if(!getroom){
      return res.status(400).json({error:"room is not found"});
    }

    // console.log(getroom)

   getroom.roomMembers =  getroom.roomMembers.filter((member,element)=>{
        if(member.email !== email){
          return member
        }
    });

    if(getroom.roomMembers?.length === getroom.totalBeds){
      getroom.status = "occupied"
    }else if(getroom.roomMembers?.length < getroom.totalBeds){
      getroom.status = "partial"
    }else{
      getroom.status = "vacant"
    }
    
    await getroom.save();

    return res.status(200).json({message:"room unassigned successfully"});

  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"something wen wrong while unassigning room",error})
  }
}

export const swapResidents = async(req,res)=>{
  try {
    const {member,targetMember,targetRoom} = req.body;

    const {email,bedNumber,joinedAt,name} = member || {}; // raj 401
    const {email:targetEmail,bedNumber:targetBedNumber,joinedAt:targetJoinedAt} = targetMember || {}; // dev 301
    const {_id:targetRoomId} = targetRoom || {}; // 301

    if(!member || !targetMember || !targetRoom) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findRoom = await RoomDb.findOne({ roomNumber: bedNumber });
    if(!findRoom){
      return res.status(404).json({message:"target room not found"});
    }

    findRoom.roomMembers = findRoom.roomMembers.filter((member,index)=> member.email !== email);
    findRoom.roomMembers.push({
      name:targetMember.name,
      email:targetEmail,
      bedNumber:findRoom.roomNumber,
      joinedAt:targetJoinedAt
    })

    const findoldRoom = await RoomDb.findOne({roomNumber:targetBedNumber});

      if(!findoldRoom){
      return res.status(404).json({message:"old room not found"});
      }

    findoldRoom.roomMembers = findoldRoom.roomMembers.filter((member,index)=> member.email !== targetEmail);
    findoldRoom.roomMembers.push({
      name,
      email,
      bedNumber:findoldRoom.roomNumber,
      joinedAt
    })

    await findRoom.save();
    await findoldRoom.save();

    return res.status(200).json({message:"room is successfully swapped"});




  } catch (error) {
    console.log(error);
  }
}

export const ChangeRoom = async(req,res)=>{
  try {
    const {member,targetRoom} = req.body;
    
    if(!member || !targetRoom){
      return res.status(400).json({error:"target room and member both needed"})
    }

    const {name,email,joinedAt,hostelId,bedNumber} = member;
    const {_id} = targetRoom;

    const findoldRoom = await RoomDb.findOne({roomNumber:bedNumber,hostelId});
    if(!findoldRoom){
      return res.status(404).json({message:"old room not found"});
    }

    findoldRoom.roomMembers = findoldRoom.roomMembers.filter((member,index)=> member.email !== email);
    await findoldRoom.save();

    const getroom = await RoomDb.findById(_id);
    if(!getroom){
      return res.status(400).json({error:"room is not found"})
    }

    getroom.roomMembers.push({
      name,
      email,
      joinedAt,
      bedNumber:getroom.roomNumber
    })

    await getroom.save();
    return res.status(200).json({message:"room is changed"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while changing the room",error})
  }
}


export const getResidents = async(req,res)=>{
  try {
    const {hostelId} = req.params;
    const getallResidents = await User.find({hostelId,role:"resident"});
    return res.status(200).json({message:"residents fetched successfully",data:getallResidents});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while fetching residents",error})
  }
}

export const getResidentById = async(req,res)=>{
  try {
    const {residentId} = req.params;  
    const getResident = await User.findById(residentId);
    if(!getResident){
      return res.status(404).json({message:"resident not found"});
    }
    return res.status(200).json({message:"resident fetched successfully",data:getResident});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while fetching resident",error})
  }
}

export const updateResident = async(req,res)=>{
  try {
    const {email,hostelId} = req.body;
    const updatedResident = await User.findOneAndUpdate({email,hostelId},req.body,{
      new:true,
      runValidators:true
    })
    return res.status(200).json({message:"resident updated successfully",data:updatedResident});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while updating resident",error})
  }
}

export const deleteResident = async(req,res)=>{
  try {
    const {email,hostelId} = req.body;
    const getResident = await User.findOne({email,hostelId});
    if(!getResident){
      return res.status(404).json({message:"resident not found"});
    }

    const assignedRoom = await RoomDb.findOne({hostelId,roomMembers:{$elemMatch:{email}}});

    if(assignedRoom){
      return res.status(400).json({message:"Resident is assigned to a room, Unassign the room first"})
    }

    const removeResident = await User.findOneAndDelete({email,hostelId});


    return res.status(200).json({message:"resident deleted successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while deleting resident",error})
  }
}


// update Complaint Status


export const updateComplaintStatus = async(req,res)=>{
  try {
    const {complaintId} = req.params;
    const {status} = req.body;

    if(!status){
      return res.status(400).json({error:"status is required"});
    }

    const updateComplaint = await complaintDb.findByIdAndUpdate(complaintId,{status},{
      returnDocument:"after"
    });

    if(!updateComplaint){
      return res.status(400).json({error:"complaint not found"});
    }

    await updateComplaint.save();

    return res.status(200).json({message:"complaint is updated successfully"});
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({error:"error while updating complaint status"});
  }
}

