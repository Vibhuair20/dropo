import { db } from "@/lib/db";
import { files, filesRelations } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { eq, and, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }
        const searchParams = request.nextUrl.searchParams
        const queryUserId = searchParams.get("userId")
        const parentId = searchParams.get("parentId")

        if(!queryUserId || queryUserId !== userId){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        // fetch files from database
        let userFiles;
        if(parentId){
            // fetching from a specific folder
             userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        eq(files.parentId, parentId)
                    )
                )
        }else{ // if we don't have the parent id, fetch root level files
            userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        eq(files.parentId, "") // Root level files have empty string as parentId
                    )
                )
        }

        console.log(`Fetched ${userFiles.length} files for user ${userId}, parentId: ${parentId || 'root'}`);
        return NextResponse.json(userFiles)

    } catch (error) {
        console.error("Error fetching files:", error);
        return NextResponse.json(
                {error: "Unable to catch the files"},
                {status: 500}
            );
    }
}