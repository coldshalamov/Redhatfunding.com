#!/usr/bin/env node
const localtunnel = require('localtunnel');

async function main() {
  const port = Number(process.argv[2] || '5173');
  const subdomainArg = process.argv[3];
  const tunnel = await localtunnel({
    port,
    subdomain: subdomainArg && subdomainArg.trim() !== '' ? subdomainArg : undefined,
  });

  // Emit a single JSON line so callers can parse it easily.
  console.log(JSON.stringify({ url: tunnel.url }));

  // Keep the process alive until it's terminated.
  const cleanup = async () => {
    try {
      await tunnel.close();
    } catch (err) {
      console.error('Error closing tunnel:', err);
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.stdin.resume();
}

main().catch((err) => {
  console.error('Failed to start tunnel:', err);
  process.exit(1);
});
