import { scalekit } from "@/src/lib/scalekit";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    const redirectUrl=`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    const url=scalekit.getAuthorizationUrl(redirectUrl)

}