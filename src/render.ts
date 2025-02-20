import { Post } from "./model.ts";
import { ga_tag } from "./ga.ts";


function wrapper(title: string, content: string) {
  const ga_tag_str = ga_tag()

    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
         <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/simple.css">
        <link rel="stylesheet" href="/index.css">
        ${ga_tag_str}
        </head>
        <body>
        <h1>${title}</h1>
        ${content}
        </body>
    </html>
    `
}

function post(post: Post) {
  return wrapper("", `
<p class="post-post-content">${post.content}</p>
<p>${post.tags}</p>
`)
}

function index(posts: Post[]) {

  const title = "rafikhan's microblog"

  function renderPost(post: Post) {
    const shortContent = post.content.length > 50 ? post.content.slice(0, 50) + '...' : post.content;
    return `<li><a href="/posts/${post.guid}">${shortContent}</a></li>`
  }

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

const Render =  { index, author, message, post};

export { Render }