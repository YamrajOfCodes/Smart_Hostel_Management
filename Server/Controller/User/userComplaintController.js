import complaintDb from "../../Model/Complaints/complaintSchema.js";


export const raiseComplaint = async(req,res)=>{
    try {
        const {cat,title,desc,priority,userId} = req.body;
        const {hostelId} = req.params;

        if(!cat || !title || !desc || !priority || !userId){
            return res.status(400).json({error:"all the fields are required"});
        }

        const letestCoplaint = new complaintDb({
            hostelId,
            userId,
            category:cat,
            issueTitle:title,
            details:desc,
            priority,
            status:"pending"
        })

        await letestCoplaint.save();
        return res.status(200).json({messgae:"complaints is submited successfully",data:letestCoplaint})

    } catch (error) {
        return res.status(400).json({error:"error while raise complaint"});
        console.log(error);
    }
}

export const getallComplaints = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const complaints = await complaintDb
      .find({ hostelId })
      .populate("userId", "name email phone");

    if (complaints.length === 0) {
      return res.status(404).json({
        message: "No complaints found",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching complaints",
    });
  }
};

export const deleteComplaint = async(req,res)=>{
    try {
        const {hostelId} = req.params;
        const complaints = await complaintDb.findOneAndDelete({hostelId});
        if(!complaints){
            return res.status(200).json({error:"no complaint found"});
        }

        return res.status(200).json({message:"complaint deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"error while deleting complaints"})
    }
}