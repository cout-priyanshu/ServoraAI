import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const {ownerId}=await req.json()
        if(!ownerId){
                    return NextResponse.json(
                        {message:"owner id is required"},
                        {status:400}
                    )
                } await connectDb()
                const setting = await Settings.findOne(
                    {ownerId}
                )
                return NextResponse.json(setting)
    } catch (error){
        return NextResponse.json(
                    {message:`get settings error ${error}`},
                    {status:500}
                )
    }
}