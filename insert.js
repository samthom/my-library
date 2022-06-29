const { createClient } = require("redis");
const path = require("path");
const fs = require("fs");


async function insertJSON() {
  try {
    if (process.argv.length < 3) {
        console.error("json filepath to be provided.")
        process.exit(1);
    }

    // read json file
    let buf = fs.readFileSync(path.join(__dirname, process.argv[2]));
    let JSONStr = buf.toString();
    let books = JSON.parse(JSONStr);

    const client = createClient();
    await client.connect();

    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const key = "book:" + book.name.toLowerCase().replaceAll(" ", "_");
        let r = await client.json.set(key, '.', book);
        console.log(key, " - ", r);
    }

    await client.quit();
  } catch (e) {
    console.error(e);
  }
}

insertJSON();
