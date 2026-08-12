import { chromium } from "/usr/local/lib/python3.12/dist-packages/playwright/driver/package/index.mjs";

const baseUrl = "https://3000-i03nnbso5ggz1l56rx2i9-670b1a00.us2.manus.computer";
const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Par familles" }).hover();
await page.waitForTimeout(650);
await page.screenshot({ path: "/home/ubuntu/nav-categories-open.png" });

await page.locator(".product-bottle-frame").first().hover();
await page.waitForTimeout(650);
await page.screenshot({ path: "/home/ubuntu/product-bottle-reflect-hover.png" });

await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3200);
await page.screenshot({ path: "/home/ubuntu/hero-bottle-reveal.png" });
await page.locator("#craft").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: "/home/ubuntu/craft-section-visible.png" });

const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
await mobilePage.getByRole("button", { name: "Ouvrir le menu" }).click();
await mobilePage.getByRole("button", { name: "Par familles" }).click();
await mobilePage.waitForTimeout(450);
await mobilePage.screenshot({ path: "/home/ubuntu/nav-categories-mobile-open.png" });

await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(3200);
await mobilePage.screenshot({ path: "/home/ubuntu/hero-bottle-mobile.png" });

await browser.close();
