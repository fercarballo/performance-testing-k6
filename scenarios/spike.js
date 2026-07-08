import { BASE_URL } from '../lib/config.js';
import { browseAndMaybeOrder } from '../lib/flow.js';

/**
 * SPIKE test: un pico SÚBITO de carga (no gradual), para validar cómo reacciona
 * el sistema ante un salto repentino y si se recupera al bajar.
 *
 * Simula, por ejemplo, el instante en que se habilita una venta muy esperada y
 * entra una avalancha de usuarios de golpe.
 */
export const options = {
  stages: [
    { duration: '5s', target: 5 }, // línea de base tranquila
    { duration: '5s', target: 100 }, // ⚡ pico súbito
    { duration: '10s', target: 100 }, // se sostiene el pico
    { duration: '5s', target: 5 }, // vuelve a la base (¿se recupera?)
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  browseAndMaybeOrder(BASE_URL);
}
