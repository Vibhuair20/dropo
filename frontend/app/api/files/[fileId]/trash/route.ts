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
            return NextResponse.json({error: "file id is required"}, {status: 401});
        }

        // all the above check are done now we move forward for the trash function
        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        )

        if(!fileId){
            return NextResponse.json({error: "file not found"}, {status: 401});
        }

        // toggle the trash status
        const updatedFiles = await db.update(files)
            .set({isTrash: !file.isTrash})
            .where(and(eq(files.id, fileId), eq(files.userId, userId)))
            .returning();
            // consoloe logging this
            console.log("trash option me dikkat hai");
            const updatedFile = updatedFiles[0]

            return NextResponse.json(updatedFile)

    } catch (error) {
        return NextResponse.json({error:"failed to update the file"},{status: 401});       
    }
}
