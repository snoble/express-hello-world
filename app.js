const express = require("express");
const app = express();
const connectionString = require('./secrets.js').connectionString;
const port = process.env.PORT || 3001;

const pgp = require('pg-promise')(/* options */)
const db = pgp(connectionString)


app.get("/", (req, res) => {
    db.none('CREATE SCHEMA IF NOT EXISTS cnt').then(d1 => {
        db.none('CREATE TABLE IF NOT EXISTS cnt (cnt integer, key integer UNIQUE)').then(d2 => {
            db.one("INSERT INTO cnt.cnt (cnt, key) VALUES (1, 0) \
            ON CONFLICT (key) DO UPDATE SET cnt=cnt.cnt+1 WHERE cnt.key=0 \
            RETURNING cnt"
            ).then(count => {
                res.send("There are " + count.cnt + " visits")
            })
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));