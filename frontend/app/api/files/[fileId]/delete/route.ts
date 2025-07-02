import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import {eq, and} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  });

export async function DELETE(
    request: NextRequest,
    props: {params: Promise<{ fileId: string}> }
) {
    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({error:"unauthorized"},{status: 401});
        }

        const {fileId} = await props.params;

        if(!fileId){
            return NextResponse.json({error:"file id is requird"},{status: 401});
        }
        // all the checks are done now to move on to the main part
        // get the file to be deleted 
        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        )

        if(!fileId){
            return NextResponse.json({error:"file not found"},{status: 401});
        }

        // delete file from image.kit if it's not a folder
        if(!file.isFolder){
            try {
                let imageKitfeild = null;
                // getting file id from its url
                if(file.fileURL){
                    const urlnoParams = file.fileURL.split("?")[0];
                    imageKitfeild = urlnoParams.split("/").pop();
                }

                if(imageKitfeild){ // search for the name 
                    try {
                        const searchResult = await imagekit.listFiles({
                            name: imageKitfeild,
                            limit: 1,
                        });

                        if(searchResult && searchResult.length > 0){
                            await imagekit.deleteFile(searchResult[0].fileId);
                        }else{
                            await imagekit.deleteFile(imageKitfeild);
                        }

                    } catch (error: any) {
                        console.error("error searching in the file", error);
                        await imagekit.deleteFile(imageKitfeild);
                    }
                }
            } catch (error) {
                return NextResponse.json({error : "error deleting the file"}, {status: 401});
            }
        }

        //delete file from database -> the main part now
        const[deletedFile] = await db
            .delete(files)
            .where(and(eq(files.id, fileId), eq(files.userId, userId)))
            .returning();
        
            return NextResponse.json({
                success: true,
                message: "file deleted successfully",
                deletedFile,
            });
        

    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
    ); 
    }
}