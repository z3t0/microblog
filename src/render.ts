import { Post } from "./model.ts";
import { ga_tag } from "./ga.ts";

function interpretAsUTC(date: string) {
  return new Date(
    date.replace(" ", "T") + "Z")
}

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


function groupPostsByDate(posts: Post[]) {
  const grouped = new Map<string, Post[]>();

  // Group Posts by Date
  posts.map((post) => {
    function keyOfDay(date: Date) {
      // ignore hr, min and sec to bin by day only.
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)

      return date.toISOString()
    }

    const binKey = keyOfDay(interpretAsUTC(post.created_at))
    
    let datedPosts = grouped.get(binKey)
    if (!datedPosts) {
      datedPosts = []
      grouped.set(binKey, datedPosts)
    }

    datedPosts.push(post)
    datedPosts.sort((a: Post, b: Post) => {
      if (a.created_at < b.created_at) return -1;
      if (b.created_at < a.created_at) return 1;
      return 0;
    })
  })

  return grouped
}

function renderPost(post: Post) {
  const shortContent = post.content.length > 50 ? post.content.slice(0, 50) + '...' : post.content;
  return `<li><a href="/posts/${post.guid}">${shortContent}</a></li>`
}

function renderIndexForDate(dateBin: string, posts: Post[]) {
  function formatDate(date: Date) {
    return date.toUTCString()
  }

  const dateLabel =
    formatDate(new Date(dateBin))


  const rendered = posts.map(renderPost).join('\n')


  return (
    `<div>
      <h4> ${dateLabel}</h4>
      <ul>
      ${rendered}
      </ul>
    </div>`)
}

function index(posts: Post[]) {

  const title = "rafikhan's microblog"


  let processedPosts = groupPostsByDate(posts)

  console.log([processedPosts.keys()].length, posts.length)
  let index = ``

  processedPosts.forEach((posts: Post[], date, _) => {
    if (!posts) return
    
    index += renderIndexForDate(date, posts)
  })


  return wrapper(title, `
    <ul>
      ${index}
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

const _Testing = { groupPostsByDate }

export { Render, _Testing }