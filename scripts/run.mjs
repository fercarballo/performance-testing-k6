/**
 * Orquestador: levanta el SUT, espera a que esté sano, corre el escenario de k6
 * y apaga el SUT al terminar. Propaga el código de salida de k6, de modo que si
 * un threshold falla, este proceso también falla (y el pipeline lo detecta).
 *
 * Uso:  node scripts/run.mjs scenarios/load.js
 */
import { spawn, execSync } from 'node:child_process';
import http from 'node:http';

const scenario = process.argv[2];
if (!scenario) {
  console.error('Uso: node scripts/run.mjs <ruta-al-escenario.js>');
  process.exit(1);
}

const PORT = 3000;

function waitForHealth(timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(`http://localhost:${PORT}/health`, () => resolve())
        .on('error', () => {
          if (Date.now() - start > timeoutMs) reject(new Error('el SUT no arrancó'));
          else setTimeout(attempt, 200);
        });
    };
    attempt();
  });
}

const service = spawn('node', ['service/server.mjs'], {
  stdio: 'ignore',
  env: { ...process.env, PORT: String(PORT) },
});

let exitCode = 0;
try {
  await waitForHealth();
  execSync(`k6 run ${scenario}`, {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: `http://localhost:${PORT}` },
  });
} catch {
  // k6 salió con código != 0 (por ejemplo, un threshold no se cumplió).
  exitCode = 1;
} finally {
  service.kill();
}

process.exit(exitCode);
