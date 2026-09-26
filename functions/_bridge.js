export async function bridge(request, env, handler) {
  globalThis.__CF_ENV__ = env;

  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }

  const isBodyless = request.method === "GET" || request.method === "HEAD";
  const body = isBodyless ? "" : (await request.text()) || "";

  const event = {
    httpMethod: request.method,
    body,
    headers,
  };

  const result = await handler(event);

  const responseHeaders = {};
  const sourceHeaders = result.headers || {};
  for (const [key, value] of Object.entries(sourceHeaders)) {
    responseHeaders[key] = Array.isArray(value) ? value.join(", ") : String(value);
  }

  return new Response(result.body, {
    status: result.statusCode || 200,
    headers: responseHeaders,
  });
}