export interface Group {
    name: string;
    id?: string;
    description: string;
    ownerID: string;
    memberIDs: string[];
}