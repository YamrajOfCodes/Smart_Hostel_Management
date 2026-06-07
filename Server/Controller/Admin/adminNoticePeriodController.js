import User from "../../Model/User/userSchema.js";
import RoomDb from "../../Model/Room/roomSchema.js";




const unassignRoomByEmail = async (roomId, email) => {
  const room = await RoomDb.findById(roomId);
  if (!room) throw new Error("Room not found.");

  room.roomMembers = room.roomMembers.filter(member => member.email !== email);
  if (room.roomMembers.length === room.totalBeds) {
    room.status = "occupied";
  } else if (room.roomMembers.length < room.totalBeds) {
    room.status = "partial";
  } else {
    room.status = "vacant";
  }

  if (room.roomMembers.length === 0) {
    room.status = "vacant";
  }

  await room.save();
  return room;
};



export const clearNoticePeriodAfterVacating = async (req, res) => {
  try {
    const { email, hostelId } = req.body;

    if (!email || !hostelId) {
      return res.status(400).json({
        success: false,
        message: "email and hostelId are required.",
      });
    }

    /* ── Step 1: Find resident ── */
    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    if (!resident.noticePeriod) {
      return res.status(400).json({
        success: false,
        message: "This resident has no active notice period to clear.",
      });
    }
    let updatedRoom = null;

    if (resident.room) {
      updatedRoom = await unassignRoomByEmail(resident.room, email);
    }

    resident.noticePeriod = null;
    resident.roomNumber   = null;
    resident.room         = null;

    await resident.save();

    return res.status(200).json({
      success: true,
      message: `${resident.name} marked as vacated. Room updated successfully.`,
      data: {
        resident: {
          _id:          resident._id,
          name:         resident.name,
          email:        resident.email,
          noticePeriod: null,
          roomNumber:   null,
        },
        room: updatedRoom
          ? {
              _id:         updatedRoom._id,
              roomNumber:  updatedRoom.roomNumber,
              status:      updatedRoom.status,
              roomMembers: updatedRoom.roomMembers,
            }
          : null,
      },
    });

  } catch (error) {
    console.error("clearNoticePeriodAfterVacating error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while clearing notice period.",
    });
  }
};

export const acceptedNoticePeriod = async (req, res) => {
  try {
    const { email, hostelId } = req.body;

    if (!email || !hostelId) {
      return res.status(400).json({
        success: false,
        message: "email and hostelId are required.",
      });
    }

    /* ── Step 1: Find resident ── */
    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    if (!resident.noticePeriod) {
      return res.status(400).json({
        success: false,
        message: "This resident has no active notice period to clear.",
      });
    }
    let updatedRoom = null;

    resident.noticePeriod = "approved";
    await resident.save();

    return res.status(200).json({message:"notice period is approved successfully"});

 

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while approving notice period.",
    });
  }
};


export const RejectedNoticePeriod = async (req, res) => {
  try {
    const { email, hostelId } = req.body;

    if (!email || !hostelId) {
      return res.status(400).json({
        success: false,
        message: "email and hostelId are required.",
      });
    }

    /* ── Step 1: Find resident ── */
    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    if (!resident.noticePeriod) {
      return res.status(400).json({
        success: false,
        message: "This resident has no active notice period to clear.",
      });
    }
    let updatedRoom = null;

    resident.noticePeriod = "rejected";
    await resident.save();

    return res.status(200).json({message:"notice period is rejected successfully"});

 

  } catch (error) {
    console.error("clearNoticePeriodAfterVacating error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while rejecting notice period.",
    });
  }
};
