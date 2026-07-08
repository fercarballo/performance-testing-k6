import { BASE_URL } from '../lib/config.js';
import { browseAndMaybeOrder } from '../lib/flow.js';

/**
 * STRESS test: llevar el sistema POR ENCIMA de su carga normal hasta encontrar
 * su punto de quiebre y observar CÓMO se degrada.
 *
 * A diferencia del load test, acá no gateamos la latencia (esperamos que suba):
 * el objetivo es conocer el límite. Solo verificamos que el sistema no colapse
 * en errores (degradación elegante, no caída total).
 */
export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 200 }, // muy por encima de lo esperado
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // Bajo estrés se toleran más errores, pero no un colapso.
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  browseAndMaybeOrder(BASE_URL);
}
