import User from "../../Model/User/userSchema.js";

const NOTICE_PERIOD_DAYS = 30;

/* ─────────────────────────────────────────────
   Helper — compute earliest allowed vacating date
───────────────────────────────────────────── */
const getEarliestAllowedDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + NOTICE_PERIOD_DAYS);
  return date;
};

/* ─────────────────────────────────────────────
   POST /api/notice-period/submit
   Payload: { hostelId, name, email, roomNumber, formatted }
   → finds the user by email + hostelId
   → validates the date
   → saves formatted date string into user.noticePeriod
───────────────────────────────────────────── */
export const submitNoticePeriod = async (req, res) => {
  try {
    const { hostelId, name, email, roomNumber, formatted } = req.body;

    /* Basic field check */
    if (!hostelId || !email || !formatted) {
      return res.status(400).json({
        success: false,
        message: "hostelId, email and formatted date are required.",
      });
    }

    /* Validate the planned vacating date is at least 30 days ahead */
    const plannedDate         = new Date(formatted);
    const earliestAllowedDate = getEarliestAllowedDate();

    if (isNaN(plannedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format received.",
      });
    }

    if (plannedDate < earliestAllowedDate) {
      return res.status(400).json({
        success: false,
        message: `Vacating date must be at least ${NOTICE_PERIOD_DAYS} days from today.`,
      });
    }

    /* Find the resident by email and hostelId */
    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    /* Check if a notice period is already active */

if (resident.noticePeriod && resident.noticePeriod !== "rejected") {
  return res.status(409).json({
    success: false,
    message: resident.noticePeriod === "approved"
      ? "Your notice is already approved by the warden."
      : "You already have a pending notice awaiting approval.",
  });
}

    /* Save the formatted date string into noticePeriod field */
    resident.noticePeriod = formatted;
    await resident.save();

    return res.status(200).json({
      success: true,
      message: "Notice period submitted successfully.",
      data: {
        name:         resident.name,
        email:        resident.email,
        roomNumber:   resident.roomNumber,
        hostelId:     resident.hostelId,
        noticePeriod: resident.noticePeriod,
      },
    });

  } catch (error) {
    console.error("submitNoticePeriod error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/notice-period/my/:email
   Resident fetches their own notice period status
───────────────────────────────────────────── */
export const getMyNoticePeriod = async (req, res) => {
  try {
    const { email } = req.params;

    const resident = await User.findOne({ email }).select(
      "name email roomNumber hostelId noticePeriod joiningDate deposite"
    );

    if (!resident) {
      return res.status(404).json({ success: false, message: "Resident not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        name:         resident.name,
        email:        resident.email,
        roomNumber:   resident.roomNumber,
        hostelId:     resident.hostelId,
        joiningDate:  resident.joiningDate,
        deposite:     resident.deposite,
        noticePeriod: resident.noticePeriod || null, // null = no active notice
      },
    });

  } catch (error) {
    console.error("getMyNoticePeriod error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/notice-period/hostel/:hostelId
   Admin fetches all residents with an active notice
───────────────────────────────────────────── */
export const getAllNoticesForHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const residents = await User.find({
      hostelId,
      role: "resident",
      noticePeriod: { $exists: true, $nin: ["", null] },
    }).select("name email phone roomNumber joiningDate deposite noticePeriod");

    return res.status(200).json({
      success: true,
      total: residents.length,
      data:  residents,
    });

  } catch (error) {
    console.error("getAllNoticesForHostel error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/notice-period/withdraw
   Resident withdraws their notice (clears the field)
   Payload: { email, hostelId }
───────────────────────────────────────────── */
export const withdrawNoticePeriod = async (req, res) => {
  try {
    const { email, hostelId } = req.body;

    console.log(email,hostelId);

    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({ success: false, message: "Resident not found." });
    }

    console.log(resident)

    if (!resident.noticePeriod) {
      return res.status(400).json({
        success: false,
        message: "No active notice period to withdraw.",
      });
    }

    resident.noticePeriod = null;
    await resident.save();

    return res.status(200).json({
      success: true,
      message: "Notice period withdrawn successfully.",
    });

  } catch (error) {
    console.error("withdrawNoticePeriod error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/notice-period/clear
   Admin clears the notice after resident has vacated
   Payload: { email, hostelId }
───────────────────────────────────────────── */
export const clearNoticePeriodAfterVacating = async (req, res) => {
  try {
    const { email, hostelId } = req.body;

    const resident = await User.findOne({ email, hostelId });

    if (!resident) {
      return res.status(404).json({ success: false, message: "Resident not found." });
    }

    resident.noticePeriod = null;
    await resident.save();

    return res.status(200).json({
      success: true,
      message: "Notice period cleared. Resident marked as vacated.",
    });

  } catch (error) {
    console.error("clearNoticePeriodAfterVacating error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};