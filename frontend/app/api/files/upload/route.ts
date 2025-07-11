import { db } from "@/lib/db";
import { files, filesRelations } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import {and, eq} from "drizzle-orm"
import ImageKit from "imagekit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// image kit credentials
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextResponse){
    try{
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:
                "unauthorized"},{status: 401});
        }
        // parse form data
        const formData = await request.formData()
        const file = formData.get("file") as File
        const fromUserId = formData.get("userId") as string
        const parentId = formData.get("parentId") as string || null

        // match id with userId
        if(fromUserId !== userId){
            return NextResponse.json(
                {error: "unauthorized"},
                {status: 401}
            );
        }
        // if file exits
        if(!file){
            return NextResponse.json({error: "No file provides"},
                {status: 401}
            );
        }

        // check with the parent id
        if(parentId){ // 1. ensure that it exists 2.belongs to user 3. it should be folder
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId), // Fixed: was parentId, should be userId
                        eq(files.isFolder, true)
                    )
                )
            
            if(!parentFolder){
                return NextResponse.json({error: "parent folder not found or not accessible"},
                    {status: 401});
            }
        }
        // Allow root-level uploads (no parentId check needed)

        // check if the file is image or pdf
        if(!file.type.startsWith("image/") && file.type !== "application/pdf"){
            return NextResponse.json(
                {error: "only images and pdf are supported"},
                {status: 401}
            );
        }

        // convert file into buffer
       const buffer =  await file.arrayBuffer()
       const fileBuffer =  Buffer.from(buffer)

       const folderPath = parentId ? `/dopo/${userId}/folder/${parentId}` : `dropo/${userId}`

       const originalFileName = file.name
       const fileExtension = originalFileName.split(".").pop() || ""
       // check for empty extension
       // validation for not storing exe, php
       const uniqueFilename = `${uuidv4()}.${fileExtension}` 

      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName:uniqueFilename,
        folder: folderPath,
        useUniqueFileName: false
       })

       // create a file data
       const fileData = {
        name: originalFileName,
        path: uploadResponse.filePath,
        size: file.size.toString(),
        type: file.type,
        fileURL: uploadResponse.url,
        thumbnailURL: uploadResponse.thumbnailUrl || "",
        userId: userId,
        parentId: parentId || "", // Ensure parentId is always a string
        isFolder: false,
        isStarred: false,
        isTrash: false
       }

       const [newFile] = await db.insert(files).values(fileData).returning();

       return NextResponse.json(
        newFile
       )

    }catch(error){
        console.error("Upload error:", error);
        return NextResponse.json(
            {error: "failed to upload file", details: error instanceof Error ? error.message : String(error)},
            {status: 500}
        );
    }
}