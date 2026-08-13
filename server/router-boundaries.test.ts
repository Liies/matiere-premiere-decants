import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootRouterSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const cartRouterSource = readFileSync(new URL("./routers/cartRouter.ts", import.meta.url), "utf8");
const ordersRouterSource = readFileSync(new URL("./routers/ordersRouter.ts", import.meta.url), "utf8");

describe("frontières des routeurs", () => {
  it("compose les capacités panier et commandes depuis un point d’entrée léger", () => {
    expect(rootRouterSource).toContain('import { cartRouter } from "./routers/cartRouter"');
    expect(rootRouterSource).toContain('import { ordersRouter } from "./routers/ordersRouter"');
    expect(rootRouterSource).toContain("cart: cartRouter");
    expect(rootRouterSource).toContain("orders: ordersRouter");
  });

  it("garde les dépendances d’infrastructure hors du routeur de composition", () => {
    expect(cartRouterSource).toContain('from "../db"');
    expect(ordersRouterSource).toContain('from "../db"');
    expect(rootRouterSource).not.toContain("createReservedOrder");
    expect(rootRouterSource).not.toContain("addCartItem");
  });
});
