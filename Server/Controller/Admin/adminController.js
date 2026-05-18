import RoomDb from "../../Model/Room/roomSchema.js";



export const createRoom = async (req, res) => {
  try {
    const {
      floor,
      roomNumber,
      roomType,
      beds,
      roomMembers,
      roomRent,
      status,
      amenities,
      notes,
    } = req.body;

    const { hostelId } = req.params;


    if (!floor || !roomNumber || !roomType || !beds || roomMembers == null || !roomRent) {
      return res.status(400).json({ error: "All the fields are required" });
    }

    let roomStatus = status;
    if (!roomStatus) {
      if (roomMembers === 0) roomStatus = "vacant";
      else if (roomMembers >= beds) roomStatus = "occupied";
      else roomStatus = "partial";
    }

    const room = new RoomDb({
      floor,
      roomNumber,
      roomType,
      beds,
      roomMembers,
      roomRent,
      hostelId,
      status: roomStatus,
      amenities: amenities || [],
      notes: notes || "",
    });

    await room.save();

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    console.error("createRoom error:", error);

    // Mongoose duplicate key (roomNumber already exists in this hostel)
    if (error.code === 11000) {
      return res.status(409).json({ error: "Room number already exists" });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    return res.status(500).json({ error: "Internal server error" });
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