#!/bin/sh

# Run the SQLite command
sqlite3 app.db <<EOF
CREATE TABLE IF NOT EXISTS src_rk_seed (
id INTEGER PRIMARY KEY AUTOINCREMENT,
    c_src_code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
EOF

# Add source code to the table from a file
file="seed.c"
sqlite3 app.db <<EOF
INSERT INTO src_rk_seed (c_src_code) VALUES (readfile('$file'));
EOF


