import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerStorageProxy } from "./storageProxy";

type RouteHandler = (req: { params: Record<string, string> }, res: ReturnType<typeof createResponse>) => Promise<void>;

function createResponse() {
  const response = {
    status: vi.fn(),
    set: vi.fn(),
    send: vi.fn(),
    redirect: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.set.mockReturnValue(response);
  response.redirect.mockReturnValue(response);
  return response;
}

describe("storage proxy cache", () => {
  let handler: RouteHandler | undefined;

  beforeEach(() => {
    vi.restoreAllMocks();
    const app = {
      get: vi.fn((_path: string, routeHandler: RouteHandler) => {
        handler = routeHandler;
      }),
    };
    registerStorageProxy(app as never, {
      forgeApiUrl: "https://forge.test",
      forgeApiKey: "forge-test-key",
    });
  });

  it("met en cache durable une image dont la clé est versionnée", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ url: "https://storage.test/perfume.png?signature=temporary" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "image/png" },
      }));
    const response = createResponse();

    await handler?.({ params: { 0: "perfumes/vanilla-powder_a69128dc.png" } }, response);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=31536000, immutable");
    expect(response.set).toHaveBeenCalledWith("Content-Type", "image/png");
    expect(response.send).toHaveBeenCalledWith(Buffer.from([1, 2, 3]));
    expect(response.redirect).not.toHaveBeenCalled();
  });

  it("refuse proprement une configuration absente", async () => {
    const app = { get: vi.fn((_path: string, routeHandler: RouteHandler) => {
      handler = routeHandler;
    }) };
    registerStorageProxy(app as never, { forgeApiUrl: "", forgeApiKey: "" });
    const response = createResponse();

    await handler?.({ params: { 0: "perfumes/vanilla.png" } }, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith("Storage proxy not configured");
  });

  it("ne met pas en cache durable les fichiers qui ne sont pas des images", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ url: "https://storage.test/catalog.pdf?signature=temporary" }), { status: 200 }));
    const response = createResponse();

    await handler?.({ params: { 0: "catalog/catalogue.pdf" } }, response);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(response.set).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(response.redirect).toHaveBeenCalledWith(307, "https://storage.test/catalog.pdf?signature=temporary");
  });
});
