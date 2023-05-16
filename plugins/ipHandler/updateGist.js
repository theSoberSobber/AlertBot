require('dotenv').config();
const TOKEN = process.env.PAT;
const GIST_ID = "844a4263a3ebc5cf8960ae12384aab90";
const GIST_FILENAME = "server.json";

async function setData(data) {
  const req = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data),
        },
      },
    }),
  });
  return req.json();
}

module.exports = {
    setData
}