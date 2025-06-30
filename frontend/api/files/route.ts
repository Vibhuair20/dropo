import { db } from "@/lib/db";
import { filesRelations } from "@/lib/db/schema";
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
            // fetching from a specific order
             userFiles = await db
                .select()
                .from(filesRelations)
                .where(
                    and(
                        eq(filesRelations.userId, userId),
                        eq(filesRelations.parentId, parentId)
                    )
                )
        }else{ // if we don't have the parent id
            userFiles = await db
                .select()
                .from(filesRelations)
                .where(
                    and(
                        eq(filesRelations.userId, userId),
                        isNull(filesRelations.parentId)
                    )
                )
        }

        return NextResponse.json(userFiles)

    } catch (error) {
        return NextResponse.json(
                {error: "Unable to catch the files"},
                {status: 500}
            );
    }
}