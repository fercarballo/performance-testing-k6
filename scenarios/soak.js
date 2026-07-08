import { BASE_URL, SLO } from '../lib/config.js';
import { browseAndMaybeOrder } from '../lib/flow.js';

/**
 * SOAK test: carga MEDIA sostenida durante mucho tiempo, para detectar problemas
 * que solo aparecen con el paso del tiempo (fugas de memoria, degradación
 * acumulada, agotamiento de conexiones).
 *
 * Acá la duración es corta (demo). Un soak real corre durante HORAS: se cambia
 * el `duration` de la etapa sostenida a algo como '2h'.
 */
export const options = {
  stages: [
    { duration: '10s', target: 15 },
    { duration: '40s', target: 15 }, // sostenido (en un soak real: horas)
    { duration: '10s', target: 0 },
  ],
  thresholds: SLO,
};

export default function () {
  browseAndMaybeOrder(BASE_URL);
}
