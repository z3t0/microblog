import { Post } from "./model.ts";


function renderPost(post: Post) {
    return `<li><a href="/posts/${post.guid}">${post.content}</a></li>`
}

function simpleCss() {
    

}

function index(posts: Post[]) {

    const title = "rafikhan's microblog"

    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
         <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
            <link rel="stylesheet" href="/simple.css">
        </head>
        <body>
        <h1>${title}</h1>
        <ul>
            ${posts.map(renderPost).join('')}
        </ul>
        </body>
    </html>
    `

}

export { index }