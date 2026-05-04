const { execFileSync } = require('child_process');

const port = process.env.PORT || '4000';

function getListeningPids(targetPort) {
  try {
    const output = execFileSync('lsof', ['-ti', `tcp:${targetPort}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => Number(value))
      .filter(Number.isFinite);
  } catch (error) {
    return [];
  }
}

function killPids(pids, targetPort) {
  if (!pids.length) {
    console.log(`[dev] Port ${targetPort} is free.`);
    return;
  }

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
      console.log(`[dev] Stopped process ${pid} on port ${targetPort}.`);
    } catch (error) {
      try {
        process.kill(pid, 'SIGKILL');
        console.log(`[dev] Force stopped process ${pid} on port ${targetPort}.`);
      } catch (killError) {
        console.warn(`[dev] Could not stop process ${pid} on port ${targetPort}: ${killError.message}`);
      }
    }
  }
}

const listeningPids = getListeningPids(port);
killPids(listeningPids, port);