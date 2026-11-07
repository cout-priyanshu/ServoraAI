import { scalekit } from "@/src/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const redirectUrl=`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    const url=scalekit.getAuthorizationUrl(redirectUrl)
    console.log(url)
    return NextResponse.redirect(url)
}