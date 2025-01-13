import { Post } from "./model.ts";


function renderPost(post: Post) {
    return `<li><a href="/posts/${post.guid}">${post.content}</a></li>`
}

function wrapper(title: string, content: string) {
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
        ${content}
        </body>
    </html>
    `
}

function index(posts: Post[]) {

    const title = "rafikhan's microblog"

    return wrapper(title, `

        <ul>
            ${posts.map(renderPost).join('')}
        </ul>

    `);

}

function author (posts: Post[]) {

    
    return wrapper("Author", `
        <h2>Create Post</h2>
        <form method="post" action="/create_post">
            <textarea name="content" placeholder="content"></textarea>
            <input type="text" name="tags" placeholder="emacs, lisp"  pattern="^([a-zA-Z0-9]+)(,[a-zA-Z0-9]+)*$">
            <button type="submit">Create Post</button>
        </form>
    `)
}

function message (message: string) {
    return wrapper("Message", `<p>${message}</p>`)
}

export { index, author, message};