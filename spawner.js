const fs = require('fs');
const { spawn } = require('child_process');

const logFile = "log.txt";
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function spawnChildScript() {
  const scriptToRun = 'main.js';

  const childProcess = spawn('node', [scriptToRun]);

  childProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
    logStream.write(`${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`Error from child script: ${data}`);
    logStream.write(`${data}`);
  });

  childProcess.on('exit', (code) => {
    console.log(`Child process exited with code ${code}, respawning...`);
    logStream.write(`Exited with code ${code}`);
    spawnChildScript();
  });
}
spawnChildScript();