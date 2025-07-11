import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try{
        const{userId} = await auth()
             if(!userId){
                return NextResponse.json({error: "Unauthorized"},
                    {status: 401});
             }
         //parse body request
     const body = await request.json()
     const {imagekit, userId: bodyUserId} = body

     //it means some one else is trying to access the database but not the user
     if(bodyUserId !== userId){
        return NextResponse.json(
          {error: "Unauthorized"},
          {status: 401}
        );
     }

     if(!imagekit || !imagekit.url){
      return NextResponse.json(
          {error: "invalid file upload error"},
          {status: 401}
        );
     }

     const fileData = {
        name: imagekit.name || "untitled",
        path: imagekit.filePath || `/dropo/${userId}/${imagekit.name}`,
        size: (imagekit.size ? imagekit.size.toString() : "0"),
        type: imagekit.fileType || "image",
        fileURL: imagekit.url,
        thumbnailURL: imagekit.thumbnailURL || "",
        userId: userId,
        parentId: "", // root level by default
        isFolder: false,
        isStarred: false,
        isTrash: false,
     };

     const [newFile] = await db.insert(files).values(fileData).returning()
     return NextResponse.json(newFile)

    }catch(error){
        console.error("Upload error:", error);
        return NextResponse.json({error: "failed to generate authentication param"}, {status: 500});
    }
}