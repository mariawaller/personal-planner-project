export interface Event {
    name: string;
    id?: string;
    creatorID: string;
    categoryID: string;
    groupID: string;
    date: number; // Firebase doesn't play well with dates, store as number (milliseconds since Jan 1, 1970) and turn into date where necessary
    notes: string;
}