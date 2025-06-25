import {pgTable, boolean, uuid, text, char, date, timestamp} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm" 
import { time } from "drizzle-orm/mysql-core"

export const usersTable = pgTable("users", {
    id : uuid().defaultRandom().primaryKey(),

    // basic file.folder information
    name : text("name").notNull(),
    path : text("path").notNull(), // document/project/resume
    size : text("size").notNull(),
    type : text("type").notNull(), //folder

    //storage information
    fileURL : text("file_url").notNull(), // url to access file
    thumbnailURL : text("thumbnail_url").notNull(),

    //ownership
    userId: text("user_id").notNull(),
    parentId : text("parent_id").notNull(),

    //file/folder-flags
    isFolder : boolean("is_folder").notNull(),
    isStarred : boolean("is_starred").default(false).notNull(),
    isTrash : boolean("is_trash").default(false).notNull(),

    //timestamps
    createdAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull(),
   
    /*
    parent == one table can have one parent
    children == one parent can have multiple childrem

    hence we are proving here that we want one-to-many relationship
    */
    
});

export const filesRelations = relations(usersTable, ({one, many}) => ({
    parent: one(usersTable, {
        fields: [usersTable.parentId],  // this is the foreign key
        references : [usersTable.id],
    }),

    children: many(usersTable),
}));

export type File = typeof usersTable.$inferSelect;
export type NewFile = typeof usersTable.$inferInsert;