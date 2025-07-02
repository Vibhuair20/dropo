import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

import {eq, and} from "drizzle-orm";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function DELETE() {
    try {
        const { userId } = await auth();
        if(!userId){
            return NextResponse.json(
                {error: "user id is not valid"},
                {status: 401}
            );
        }
        // get all files in trash from the user
        const trashFile = await db
            .select()
            .from(files)
            .where(and(eq(files.userId, userId), eq(files.isTrash, true)));
        
        if(trashFile.length === 0){
            return NextResponse.json(
                {error: "there are no files in the trash"},
                {status: 401}
            );
        }
        //delete files from the imagekit
        const deletePromises = trashFile
        .filter((file) => !file.isFolder) //skip folders
        .map(async (file) =>{
            try {
                let imageKitfeild = null;

                if(!file.fileURL){
                    const UrlNoParams = file.fileURL.split("?")[0];
                    imageKitfeild = UrlNoParams.split("/").pop();
                }

                if(!imageKitfeild && file.path){
                    imageKitfeild = file.path.split("/").pop();
                }

                if(imageKitfeild){ //searching for the name
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
                        console.error(
                            `error searching for file in imagekit:`,
                            error
                        );
                        await imagekit.deleteFile(imageKitfeild);
                    }
                }
            } catch (error) {
                console.error(`Error deleting file ${file.id} from ImageKit:`, error);
            }
        });

        // wait for all deletions to complete or fail
        await Promise.allSettled(deletePromises);

        //delete all trashed files form the database
        const deletedFile = await db
        .delete(files)
        .where(and(eq(files.userId, userId), eq(files.isTrash, true)))
        .returning();

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedFile.length} files from trash`,           
        });
    } catch (error) {
        console.error("error emptying trash", error);
        return NextResponse.json(
            {error: "failed to empty trash"},
            {status: 500}
        );
    }
}
  