import { Databases, Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

interface getMemberProps {
    databases: Databases;
    workspaceId : string;
    userId : string;
};

export const getMember = async ({
    databases, workspaceId, userId
} : getMemberProps) => {
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
            Query.equal('workspaceId', workspaceId),
            Query.equal('userId', userId),
        ],
    );

    return members.documents[0];
}
