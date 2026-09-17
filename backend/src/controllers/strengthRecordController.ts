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

export async function getRecords(
    req: AuthRequest,
    res: Response
) {
    try {
        console.log("inside getrecords");
        if (!req.user) return res.status(401).json({ message: "No user found" });
        const records = await StrengthRecord.find({belongsTo: req.user.id});
        return res.status(200).json(records);
    } catch(err) {
        return res.status(500).json({message: err});
    }
}


