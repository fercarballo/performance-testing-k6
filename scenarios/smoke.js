import { BASE_URL } from '../lib/config.js';
import { browseAndMaybeOrder } from '../lib/flow.js';

/**
 * SMOKE de performance: 1 usuario virtual, poca duración.
 *
 * No mide capacidad; verifica que el script y los endpoints funcionan y que la
 * latencia base es razonable, antes de invertir tiempo en una prueba de carga.
 */
export const options = {
  vus: 1,
  duration: '5s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  browseAndMaybeOrder(BASE_URL);
}
