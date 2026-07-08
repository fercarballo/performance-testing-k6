/**
 * Configuración compartida por todos los escenarios de k6.
 *
 * Los `thresholds` (umbrales) son la pieza clave: convierten la prueba de
 * performance en un QUALITY GATE. Si el p95 supera el SLO o la tasa de error
 * sube, k6 termina con código distinto de cero y el pipeline falla.
 */

// La URL del SUT se puede sobreescribir por variable de entorno (k6 usa __ENV).
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// SLO (Service Level Objective) de referencia para carga normal.
export const SLO = {
  // Menos del 1% de las requests puede fallar.
  http_req_failed: ['rate<0.01'],
  // El 95% debe responder en menos de 500ms; el 99% en menos de 800ms.
  // Se usa p95/p99 y NO el promedio, que esconde la cola de latencia.
  http_req_duration: ['p(95)<500', 'p(99)<800'],
};
