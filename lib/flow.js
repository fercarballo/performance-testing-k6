import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Flujo de usuario reutilizable, compartido por todos los escenarios.
 *
 * Modela un comportamiento REALISTA: la mayoría de los usuarios navega el
 * catálogo, y una fracción además concreta una compra. Incluye un "think time"
 * (pausa entre acciones) porque un usuario real no dispara requests sin pausa;
 * omitir el think time mediría un escenario irreal y saturaría de más.
 */
export function browseAndMaybeOrder(baseUrl) {
  // Todos los usuarios navegan el catálogo.
  const products = http.get(`${baseUrl}/products`);
  check(products, {
    'GET /products responde 200': (r) => r.status === 200,
    'catálogo no vacío': (r) => r.json().length > 0,
  });

  // El 20% de los usuarios además realiza una compra.
  if (Math.random() < 0.2) {
    const payload = JSON.stringify({ productId: 1, qty: 2 });
    const order = http.post(`${baseUrl}/orders`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(order, { 'POST /orders responde 201': (r) => r.status === 201 });
  }

  // Think time: pausa de 0.5 a 1.5 segundos, como un usuario real.
  sleep(Math.random() + 0.5);
}
