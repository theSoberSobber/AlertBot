// apis that want to acces this server are to do from here
const GIST_ID = "844a4263a3ebc5cf8960ae12384aab90";
const GIST_FILENAME = "server.json";

async function getData() {
    const req = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const gist = await req.json();
    return JSON.parse(gist.files[GIST_FILENAME].content);
}

if (require.main === module) {
    (async () => {
        const data = await getData();
        console.log(data.ip);
    })();
}