// app/api/exercises/route.ts

type CacheEntry = {
  data: any;
  expiry: number;
};

const cache = new Map<string, CacheEntry>();
const pending = new Map<string, Promise<any>>();

const TTL = 1000 * 60 * 60 * 24; // 24h

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(url: string) {
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  const res = await fetch(url);

  if (res.status === 429 && retries > 0) {
    await delay(1000);
    return fetchWithRetry(url, retries - 1);
  }

  if (!res.ok) {
    throw new Error(`Erro externo: ${res.status}`);
  }

  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let url = searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), {
      status: 400,
    });
  }

  url = normalizeUrl(url);

  const now = Date.now();

  // ✅ CACHE HIT
  const cached = cache.get(url);
  if (cached && cached.expiry > now) {
    return Response.json(cached.data);
  }

  // ✅ DEDUPE
  if (pending.has(url)) {
    const data = await pending.get(url);
    return Response.json(data);
  }

  const fetchPromise = (async () => {
    try {
      await delay(300);

      const data = await fetchWithRetry(url);

      if (!data) throw new Error("Empty response");

      // ✅ evita loop de paginação bugada
      if (data?.metadata?.nextPage === url) {
        data.metadata.nextPage = null;
      }

      cache.set(url, {
        data,
        expiry: now + TTL,
      });

      return data;
    } finally {
      pending.delete(url);
    }
  })();

  pending.set(url, fetchPromise);

  try {
    const data = await fetchPromise;
    return Response.json(data);
  } catch (err) {
    console.error("Proxy error:", err);

    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      status: 500,
    });
  }
}
