export interface Group {
    name: string;
    id?: string;
    description: string;
    ownerEmail: string;
    memberEmails: string[];
}