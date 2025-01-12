import { Database } from "jsr:@db/sqlite@0.12";
import * as uuid from "jsr:@std/uuid";
import { Post } from "./model.ts";
import { index } from "./render.ts";
import { simpleCss } from "./simpleCss.ts";

function create_table(db: Database) {
  const rawSql = `CREATE TABLE posts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
guid TEXT NOT NULL,
content TEXT NOT NULL,
tags TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

  db.prepare(rawSql).run()
}

function table_exists_p(db: Database) {
  const matches = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='posts';"
  ).all()

  if (matches.length === 0) {
    return false;
  } else {
    return true;
  }
}

function init_db() {
  const dbPath = "./app.db"

  const db = new Database(dbPath);

  if (!table_exists_p(db)) create_table(db)
 
  return db
}


function get_posts(db: Database): Post[] {
  const posts = db.prepare("SELECT * FROM posts").all()

  return posts.map(post => {
    return {
      guid: post.guid,
      content: post.content,
      tags: post.tags.split(","),
      created_at: post.created_at
    }
  })
}

function add_post(db: Database, content: string, tags: string[]) {
  // only allow alphanumeric for tags
  if (tags.some(tag => !/^[a-zA-Z0-9]+$/.test(tag))) {
    throw new Error("tags should be alphanumeric")
  }

  const guid = crypto.randomUUID();


  const rawSql = `INSERT INTO posts (guid, content, tags) VALUES (?, ?, ?);`

  db.prepare(rawSql).run(guid, content, tags.join(","))

  console.log("post added")
}

function delete_post(db: Database, guid: string) {
  const rawSql = `DELETE FROM posts WHERE guid = ?;`
  db.prepare(rawSql).run(guid)

}

function serve_app(db: Database, port: number) {

  Deno.serve({port}, async (req: Request) => {

    const url = new URL(req.url);
    console.log(url)

    if (url.pathname == "/simple.css") {
      return new Response(simpleCss, 
      {headers: {"content-type": "text/css; charset=UTF-8"}},)
    }
    
    if (url.pathname == "/") {
    return new Response( index(get_posts(db)), 
    {headers: {"content-type": "text/html; charset=UTF-8"}},)
    }

    else {
      return new Response("not found", {status: 404})
    }
  })
}

function main() {

  const args = Deno.args


  if (args[0] === "serve") {
    const db = init_db()

    const port = 8000;

    serve_app(db, port)
  }

  if (args[0] === "add") {
    const db = init_db()
    const content = args[1]
    const tags = args[2]
    let tagsArr: string[] = []

    if (!content) {
      console.log("content is required")
      Deno.exit(1)
    }

    if (tags) {
      tagsArr = tags.split(",")
    }

    add_post(db, content, tagsArr)
    db.close()
    Deno.exit(0)
  }

  if (args[0] === "ls") {
    const db = init_db()
    const posts = get_posts(db)
    console.log(posts)
    db.close()
    Deno.exit(0)
  }

  if (args[0] === "rm") {
    const db = init_db()
    const id = args[1]

    if (!id) {
      console.log("id is required")
      Deno.exit(1)
    }

    delete_post(db, id)
    db.close()
    Deno.exit(0)
  }

 }

main()