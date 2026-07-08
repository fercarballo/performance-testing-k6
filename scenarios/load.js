import { BASE_URL, SLO } from '../lib/config.js';
import { browseAndMaybeOrder } from '../lib/flow.js';

/**
 * LOAD test: la carga ESPERADA en producción.
 *
 * Valida que el sistema cumple sus SLOs en condiciones normales. El patrón de
 * "stages" hace un ramp-up gradual (no toda la carga de golpe), un período
 * sostenido, y un ramp-down. Los thresholds son el gate: si el p95 supera el
 * SLO, k6 falla y el pipeline lo refleja.
 */
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // ramp-up gradual a 20 usuarios
    { duration: '20s', target: 20 }, // carga sostenida
    { duration: '5s', target: 0 }, // ramp-down
  ],
  thresholds: SLO,
};

export default function () {
  browseAndMaybeOrder(BASE_URL);
}
