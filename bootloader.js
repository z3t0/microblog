const sqlite3 = require('sqlite3').verbose();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function getCallerFileAndLine(depth = 2) {
  const stack = new Error().stack.split("\n");
  const caller = stack[depth]; // Adjust depth to go higher in the stack
  const match = caller.match(/\((.*):(\d+):\d+\)$/); // Regex to extract file and line
  if (match) {
    const [_, file, line] = match;
    return { file, line };
  }
  return { file: "unknown", line: "unknown" };
}

log = (...something) => {
  const {file, line} = getCallerFileAndLine(depth=3)
  const shortFileName = file.split("/").slice(-1)[0]

  console.log(`[${shortFileName}:${line}]`, ...something)
}
l = log

apply = (fn) => {
  let t = () => "apply"

  l(fn)
  name = fn[0]
  func = fn[1]

  l(t(), {name, func})

  return (fn[1]) ()
}
a = apply

timeout = (fn, kill_in) => {
  let t = () => "fn.timeout"

  if (!kill_in) kill_in = 20

  name = fn[0]
  l(t(), fn[0], fn[1])

  return new Promise((res, rej) => {
    timeout = setTimeout(() => {
      if (!isDone()) {
        l(t(), `kill from ${fn[0]} after ${kill_in}`)
        process.exit(1)
      }
    }, kill_in)

    on_time = () =>  {
      clearTimeout(timeout)
      l(t(), `on_time ${name}`)
    }
    
    let ret = null
    isDone = () => ret

    ret = a(fn)
    on_time()
    res(ret)
  })
}


stm_sqlite_version = () => "SELECT sqlite_version();"

sqlite_health_check = (db) => {
  let t = ["t", ()=> "sqlite_health_check"]
  l(a(t), "in function")

  return new Promise((res, rej) => {
    db.serialize(() => {
      l(a(t), "in promise")
      l(a(t), stm_sqlite_version())
      l(a(t), {db})

      try {
        l(a(t), "before run")

        db.serialize(() => {
          db.get(stm_sqlite_version(), (err, row) => {
            l(a(t), "in run")
            if (err) {
              l(a(t), "error")
              rej(err)
            } else {
              l(a(t), "success")
              console.log(row)
              res(row)
            }
          })
        })

        l(a(t), "after run")
      } catch (err) {
        l(a(t), "error", {err})
        rej(err)
      }
    })
  })
}

function new_sqlite3() {
  db_path = () => "./app.db"
  permissions = () => sqlite3.OPEN_READ_WRITE

  l("path", db_path())

  // TODO: func fails silently if app.db is not a well-formed
  // sqlite3 database.

  // We only need to read the lua source code.
  // The bootloader itelf doesn't need write permissions.
  return new Promise((res, rej) => {
    try {
      l("before new sqlite3.Database")
      res(new sqlite3.Database(
        db_path(),
        permissions(), (err) => {
          if (err) {
            rej(err);
          }
        }))
      l("after new sqlite3.Database")
    } catch (err) {
      l("error", {err})
    }
  })
}

async function connect_to_sqlite() {
  const db = await new_sqlite3()

  return db
}

async function get_seed() {
  return fs.readFileSync(path.join(__dirname, "seed.c"), "utf8")
}

main = () => {
  return  ["main", async () => {
    let t = () => "main"
    db = await connect_to_sqlite()
    status = await sqlite_health_check(db)
    l({status})

    const c_src = await get_seed()
    run_tcc(c_src)




    l(t(), "done")
  }]
}

function ensure_dir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

run_tcc = (c_code) => {

  ensure_dir("./tmp")

  const now = Date.now().toString()
  const exe_file_path = "./tmp/${now}.x"
  const temp_file_path = `./tmp/${now}.c`
  fs.writeFileSync(temp_file_path, c_code)

  exec(`tcc -lm -o ${exe_file_path} ${temp_file_path}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Compilation error:", stderr);
      return;
    }

    console.log("Compilation successful!");

    // print location
    // Step 3: Run the compiled program
    exec("./" + exe_file_path, (err, stdout, stderr) => {
      if (err) {
        console.error("Execution error:", stderr);
        return;
      }
      console.log("Program output:", stdout);
    });
  });
}

(async function () {
  try {
    timeout(main())
  }
  catch (e) {
    console.error(e)
  }
})()