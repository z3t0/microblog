# Usage
```sh
./scripts/build.sh
./build/microblog serve &
./build/microblog author &
```

The reader endpoint is on port 8000.
http://localhost:8000

The author endpoint is on port 8001.
http://localhost:8001
http://localhost:8001/backup to get copy of sqlite db


# Name
- z, for zero(config|bs)
- play on x.

# Design

- deno runtime
- sqlite persistence
- call cli for adding posts
- post: text, date, tags


# requirements:
- deno
- sqlite3

## future
- [ ] stable links 
- [ ] ipfs or related for redundancy