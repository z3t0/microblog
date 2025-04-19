## Name
- z, for zero(config|bs)
- play on x.

## Design

- deno runtime
- sqlite persistence
- call cli for adding posts
- post: text, date, tags

---

## Requirements:

### Install [Nix](https://nixos.org)

```
# Answer 'y' for all questions
sh <(curl -L https://nixos.org/nix/install) --daemon --yes
```

Reader endpoint: 
http://localhost:8000

Author endpoint:
http://localhost:8001

Get SQLite DB copy:
http://localhost:8001/backup

## Planned
- [ ] produce a single, crossplatform binary
- [ ] target 5mb runtime? something small...
- [ ] add comprehensive tests
- [ ] stable links 
- [ ] ipfs or related for redundancy
