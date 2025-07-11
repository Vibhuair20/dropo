import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET(){
   try {
     const{userId} = await auth()
     if(!userId){
        return NextResponse.json({error: "Unauthorized"},
            {status: 401})
     }
 
     const authParams = imagekit.getAuthenticationParameters()
 
     return NextResponse.json(authParams)
   } catch (error: any) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json({error: "failed to generate authentication param"}, {status: 500});
   }
};