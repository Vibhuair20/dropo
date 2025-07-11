import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

import {eq, and} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    props: {params: Promise<{fileId: string}> }
) {
    try {
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:"unauthorized"},{status: 401});
        }

        const {fileId} = await props.params

        if(!fileId){
            return NextResponse.json({error:"file id is requird"},{status: 401});
        }

        // all the checks are done above 
        // now thw main part
        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        )

        if(!fileId){
            return NextResponse.json({error:"file not found"},{status: 401});
        }

        //toggle the star status
        const updatedFiles = await db.update(files)
            .set({isStarred: !file.isStarred})
            .where(and(eq(files.id, fileId), eq(files.userId, userId)))
            .returning();
            // consoloe logging this
            console.log("star option me dikkat hai");
            const updatedFile = updatedFiles[0]

            return NextResponse.json(updatedFile)

    } catch (error) {
        return NextResponse.json({error:"failed to update the file"},{status: 401});
    }
    
}