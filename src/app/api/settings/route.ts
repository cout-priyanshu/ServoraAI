import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const { ownerId, bussinessName, supportEmail, knowledge} = await req.json()
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id is required"},
                {status:400}
            )
        } await connectDb()
        const settings = await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId, bussinessName, supportEmail, knowledge},
            {new:true,upset:true}
        )
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json(
            {message:`settings error ${error}`},
            {status:500}
        )
    }
}
