export interface Post { 
    guid: string, // sqlite id is not global.
    content: string,
    tags: string[],
    created_at: string
}
