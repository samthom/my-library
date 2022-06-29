const express = require("express");
const { createClient, AggregateGroupByReducers, AggregateSteps } = require("redis");
const app = express();
const port = 8000;

const client = createClient();
const index = "idx:books"

app.get("/", async (req, res) => {
    const search = String(req.query.search);

    const results = await client.ft.search(index, search);
    res.json(results);
});

app.get("/top", async (req, res) => {
    const results = await client.ft.search(index, "*", {
        SORTBY: {
            BY: "rating",
            DIRECTION: "DESC"
        },
        RETURN: ["name", "rating"]
    });
    res.json(results);
});

app.get("/most-read", async (req, res) => {
    const results = await client.ft.aggregate(index, "*", {
        STEPS: [{
            type: AggregateSteps.GROUPBY,
            properties: "@author",
            REDUCE: [{ 
                type: AggregateGroupByReducers.COUNT,
                AS: "no_of_books"
            }]
        }, {
            type: AggregateSteps.SORTBY,
            BY: {
                BY: "@no_of_books",
                DIRECTION: "DESC"
            }
        }, {
            type: AggregateSteps.LIMIT,
            from: 0,
            size: 5
        }]
    });

    res.json(results);
})

app.listen(port, async() => {
    await client.connect();
    console.log("Server listening at ", port);
});