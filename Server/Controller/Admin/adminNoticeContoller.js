import noticeDb from "../../Model/Notice/noticeSchema.js";


export const createNotice = async (req,res) => {
    try {
        const {title,body,hostelId,category,urgency} = req.body;
        if(!title || !body || !hostelId) return res.status(400).json({message:"Title, body, and hostel ID are required"});
        const newNotice = new noticeDb({title,body,hostelId,category,urgency});
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};

export const getNotices = async (req,res) => {
    try {
        const {hostelId} = req.params;
        const notices = await noticeDb.find({hostelId});
        return res.status(200).json(notices);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};

export const updateNotice = async (req,res) => {
    try {
        const {noticeId} = req.params;
        const {title,body,pin,hostelId,category,urgency} = req.body;
        const updatedNotice = await noticeDb.findByIdAndUpdate(noticeId, {title,body,pin,hostelId,category,urgency},  { returnDocument: "after" });
        res.status(200).json(updatedNotice);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};

export const deleteNotice = async (req,res) => {
    try {
        const {noticeId} = req.params;
        const deletedNotice = await noticeDb.findByIdAndDelete(noticeId);
        res.status(200).json(deletedNotice);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};
