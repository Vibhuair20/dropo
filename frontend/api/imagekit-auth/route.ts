import { auth } from "@clerk/nextjs/server";
import { ImageKit } from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKitProvider({
    publicKey: process.env. || "",
    privateKey: process.env. || "",
    urlEndpoint: ProcessingInstruction.env
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
        return NextResponse.json({error: "failed to generate authentication param"}, {status: 500});
   }
};