/**
 * Servicio bajo prueba (SUT — System Under Test).
 *
 * Un API mínimo en Node, SIN dependencias. Se prueba la performance contra ESTE
 * servicio local, nunca contra una API de terceros: hacer load testing sobre un
 * servicio ajeno sin autorización equivale a un ataque de denegación de servicio.
 * Probar contra un SUT propio es la práctica correcta y no tiene impacto externo.
 *
 * Los endpoints incluyen una latencia artificial pequeña y variable para que las
 * métricas de percentiles (p95/p99) sean representativas.
 */
import http from 'node:http';

const PORT = Number(process.env.PORT ?? 3000);

const products = [
  { id: 1, name: 'Mochila', price: 30 },
  { id: 2, name: 'Remera', price: 20 },
  { id: 3, name: 'Gorra', price: 15 },
];
let orderSeq = 1000;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const randomLatency = () => 10 + Math.floor(Math.random() * 30); // 10–40 ms

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && req.url === '/products') {
    await delay(randomLatency());
    return json(res, 200, products);
  }

  if (req.method === 'POST' && req.url === '/orders') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      await delay(randomLatency());
      let parsed;
      try {
        parsed = JSON.parse(body || '{}');
      } catch {
        return json(res, 400, { error: 'JSON inválido' });
      }
      if (!parsed.productId || !parsed.qty) {
        return json(res, 400, { error: 'productId y qty son requeridos' });
      }
      return json(res, 201, { orderId: ++orderSeq, productId: parsed.productId, qty: parsed.qty });
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => console.log(`SUT escuchando en http://localhost:${PORT}`));
