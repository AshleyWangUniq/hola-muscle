import type { Request, Response } from "express";
import StrengthRecord from "../models/StrengthRecord";
import { AuthRequest } from "../middleware/authMiddleware";

export async function addRecord(
    req: AuthRequest,
    res: Response
) {
    try {
        const record = req.body;
        
        if (!req.user) return res.status(401).json({message: "No user found"});
        console.log(record);
        const newRecord = await StrengthRecord.create({...record, belongsTo: req.user.id});
        console.log("new record", newRecord);
    res.status(201).json({message: "Record saved"});
    } catch(err){
        res.status(500).json({message: "Failed to save reocrd!"});
    }
}

export async function deleteRecord(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.user) {
            return res.status(401).json({message: "No User Found"});
        }
        const recordId = req.params.id;
        console.log("record id is:", recordId);
        if (typeof recordId !== "string") {
            return res.status(400).json({message: "Invalid exercises ID"});
        }
        console.log("inside deletion");

        const deletion = await StrengthRecord.findOneAndDelete({
            _id: recordId,
            belongsTo: req.user.id
        });
        if (!deletion) {
            console.log("no record fond");
            return res.status(404).json({message: "No Record History Found"});}
        return res.status(200).json({message:"Record Deleted"});
    } catch(err) {
        return res.status(500).json({message: err});
    }
}

export async function getRecords(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.user) return res.status(401).json({ message: "No user found" });
        const records = await StrengthRecord.find({belongsTo: req.user.id});
        return res.status(200).json(records);
    } catch(err) {
        return res.status(500).json({message: err});
    }
}


