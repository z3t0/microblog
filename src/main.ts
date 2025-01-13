import { Database } from "jsr:@db/sqlite@0.12";
import * as uuid from "jsr:@std/uuid";
import { Post } from "./model.ts";
import { author, index } from "./render.ts";
import { simpleCss } from "./simpleCss.ts";

function create_table(db: Database) {
  const rawSql = `CREATE TABLE posts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
guid TEXT NOT NULL,
content TEXT NOT NULL,
tags TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

  db.prepare(rawSql).run();
}

function table_exists_p(db: Database) {
  const matches = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='posts';",
  ).all();

  if (matches.length === 0) {
    return false;
  } else {
    return true;
  }
}

function fs_exists(path: string) {
  try {
    Deno.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
}

function init_db({ create = false } = {}) {
  const dbPath = "./app.db";

  if (fs_exists(dbPath) && create) {
    console.error("./app.db already exists");
    Deno.exit(1);
  }

  if (!fs_exists(dbPath) && !create) {
    console.error("./app.db does not exist");
    Deno.exit(1);
  }

  const db = new Database(dbPath);

  if (!table_exists_p(db)) create_table(db);

  return db;
}

function get_posts(): Post[] {
  const db = init_db();
  const rows = db.prepare("SELECT * FROM posts").all();

  const posts = rows.map((post) => {
    return {
      guid: post.guid,
      content: post.content,
      tags: post.tags.split(","),
      created_at: post.created_at,
    };
  });

  db.close();

  return posts;
}

function add_post(content: string, tags: string[]) {
  // only allow alphanumeric for tags
  if (tags.some((tag) => !/^[a-zA-Z0-9]+$/.test(tag))) {
    throw new Error("tags should be alphanumeric");
  }

  const guid = crypto.randomUUID();

  const rawSql = `INSERT INTO posts (guid, content, tags) VALUES (?, ?, ?);`;

  const db = init_db();
  db.prepare(rawSql).run(guid, content, tags.join(","));

  console.log("post added");
}

function delete_post(guid: string) {
  const db = init_db();
  const rawSql = `DELETE FROM posts WHERE guid = ?;`;
  db.prepare(rawSql).run(guid);

  db.close();
}

function serve_app(db: Database, port: number) {
  Deno.serve({ port }, async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname == "/simple.css") {
      return new Response(simpleCss, {
        headers: { "content-type": "text/css; charset=UTF-8" },
      });
    }

    if (url.pathname == "/") {
      return new Response(index(get_posts()), {
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    } else {
      return new Response("not found", { status: 404 });
    }
  });
}

function serve_author(port: number) {
  Deno.serve({ port }, async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname == "/simple.css") {
      return new Response(simpleCss, {
        headers: { "content-type": "text/css; charset=UTF-8" },
      });
    }

    if (url.pathname == "/author") {
      return new Response(author(), {
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    if (url.pathname == "/create_post") {
      const formData = await req.formData();

      if (formData.has("content") && formData.has("tags")) {
        const content = formData.get("content");
        const tags = formData.get("tags");

        if (
          content && tags && typeof content === "string" &&
          typeof tags === "string"
        ) {
          add_post(content, tags.split(","));
          return new Response("post created", { status: 201 });
        }
      } else {
        return new Response("content and tags are required", { status: 400 });
      }
    } else {
      return new Response("not found", { status: 404 });
    }
  });
}

async function watch_app_db() {
  const watcher = Deno.watchFs("./app.db");

  for await (const event of watcher) {
    console.log("db changed", event);
  }
}

function main() {
  const args = Deno.args;

  if (args.length === 0) {
    console.log(`usage:
      ./microblog command
      
      commands:
      serve
      add <content> <tags>
      ls
      rm <guid>
      create_db`);
    Deno.exit(1);
  }

  if (args[0] === "serve") {
    const db = init_db();

    const port = 8000;

    serve_app(db, port);

    watch_app_db();
  }

  if (args[0] === "author") {
    const port = 8001;
    serve_author(port);
  }

  if (args[0] === "add") {
    const content = args[1];
    const tags = args[2];
    let tagsArr: string[] = [];

    if (!content) {
      console.log("content is required");
      Deno.exit(1);
    }

    if (tags) {
      tagsArr = tags.split(",");
    }

    add_post(content, tagsArr);
    Deno.exit(0);
  }

  if (args[0] === "ls") {
    console.log(get_posts());

    Deno.exit(0);
  }

  if (args[0] === "rm") {
    const id = args[1];

    if (!id) {
      console.log("id is required");
      Deno.exit(1);
    }

    delete_post(id);

    Deno.exit(0);
  }

  if (args[0] === "create_db") {
    const db = init_db({ create: true });
    db.close();
    Deno.exit(0);
  }
}

main();
