import complaintModel from "../../Model/Complaints/complaintSchema.js";
import serviceModel from "../../Model/Service/serviceSchema.js";




export const raiseComplaint = async(req,res)=>{
    const {category,issueTitle,details,priority} = req.body;
    try {

        if(!category || !issueTitle || !details || !priority){
            return res.status(400).json({error:"all the fields are required"});
        }

        const complaint = new complaintModel({
           category,issueTitle,details,priority
        });

        await complaint.save();
        return res.status(200).json({
            message:"Complaint is raised succesfully ",
            data:complaint
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAllComplaints = async(req,res)=>{
      try {
        const complaints = await complaintModel.find({});
        return res.status(200).json(complaints);
      } catch (error) {
        console.log(error);
      }
}



// Service



export const requestService = async(req,res)=>{

    console.log(req.body)
    try {
        const {serviceType,serviceDescription,serviceDate,notes} = req.body;

        if(!serviceType || !serviceDescription || !serviceDate){
            return res.status(400).json({error:"all the fields are required"});
        }

        const service = new serviceModel({
            serviceType,serviceDescription,serviceDate,notes
        });

        await service.save();
        return res.status(200).json({
            message:"Service request is submitted succesfully ",
            data:service
        });

    } catch (error) {
        console.log(error);
    }
}

export const getAllRequestedServices = async(req,res)=>{
    try {
        const services = await serviceModel.find({});
        return res.status(200).json(services);
    } catch (error) {
        console.log(error);
    }
}