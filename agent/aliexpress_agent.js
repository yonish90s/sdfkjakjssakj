/**
 * AliExpress import agent (Node).
 *
 * Pulls high-selling products from the pool, applies a +20% markup over the
 * AliExpress price, keeps the original image and details, and writes them to
 * aliexpress_products.json (which the site serves at /api/ali-products).
 *
 * Runs on a daily cron from server.js and can be triggered manually via the
 * admin endpoint POST /api/run-ali-agent.
 *
 * To plug in the REAL AliExpress affiliate API later, replace loadPool() with
 * a fetch to the Dropshipping/Affiliate API (needs an app key + tracking id)
 * — the rest of the pipeline (markup, high-sales filter, output) stays the same.
 */
const fs = require('fs');
const path = require('path');

const MARKUP = 1.20;            // +20% over the AliExpress price
const USD_RATE = 0.54;         // pool prices are in the source currency; normalize to USD
const MIN_ORDERS = 3000;       // "high sales" threshold
const SHOP_FILE = 'aliexpress_products.json';
const POOL_FILE = path.join(__dirname, 'aliexpress_pool.json');
const STATE_FILE = 'product_pool_state.json';

function loadPool() {
  try {
    return JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));
  } catch (e) {
    console.error('[ali-agent] could not read pool:', e.message);
    return [];
  }
}

// Turn a raw pool product into a shop product: keep image/title/details,
// apply the +20% markup, and show the original AliExpress price as a strikethrough.
function toShopProduct(p) {
  const base = +(p.aliPrice * USD_RATE).toFixed(2);     // AliExpress price in USD
  const price = +(base * MARKUP).toFixed(2);            // our price (+20%)
  return {
    id: p.id,
    title: p.title,
    cat: p.cat,
    desc: p.desc,
    img: p.img,                                          // same image
    price: `$${price.toFixed(2)}`,
    aliPrice: base,                                      // original AliExpress price (USD)
    originalPrice: `$${base.toFixed(2)}`,                // strikethrough = the cheaper Ali price
    markup: '20%',
    orders: p.orders,                                    // sales count (for the "high sales" badge)
    rating: p.rating,
    aliUrl: p.aliUrl
  };
}

/**
 * Import `count` new high-selling products into the active shop, rotating
 * through the pool so the shop keeps refreshing. Returns a summary.
 */
function runAliExpressImport(opts = {}) {
  const root = opts.projectRoot || process.cwd();
  const count = opts.count || 2;
  const shopPath = path.join(root, SHOP_FILE);
  const statePath = path.join(root, STATE_FILE);

  // only keep products that actually sell well
  const pool = loadPool().filter(p => (p.orders || 0) >= MIN_ORDERS);
  // best sellers first
  pool.sort((a, b) => (b.orders || 0) - (a.orders || 0));

  if (pool.length === 0) {
    return { ok: false, message: 'No high-sales products in pool', added: 0 };
  }

  let active = [];
  try { active = JSON.parse(fs.readFileSync(shopPath, 'utf8')); } catch (e) { active = []; }

  let state = { order: pool.map(p => p.id), index: 0 };
  try {
    const s = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    if (s && Array.isArray(s.pool)) state = { order: s.pool, index: s.index || 0 };
    else if (s && Array.isArray(s.order)) state = s;
  } catch (e) {}

  // make sure every high-sales product is represented in the rotation order
  const orderSet = new Set(state.order);
  pool.forEach(p => { if (!orderSet.has(p.id)) state.order.push(p.id); });

  const byId = Object.fromEntries(pool.map(p => [p.id, p]));
  const activeIds = new Set(active.map(p => p.id));
  let added = 0;

  for (let i = 0; i < count; i++) {
    if (state.index >= state.order.length) state.index = 0; // loop the pool
    let guard = 0;
    // find the next pooled product not already in the shop
    while (guard < state.order.length) {
      const pid = state.order[state.index];
      state.index++;
      if (state.index >= state.order.length) state.index = 0;
      guard++;
      if (byId[pid] && !activeIds.has(pid)) {
        active.push(toShopProduct(byId[pid]));
        activeIds.add(pid);
        added++;
        break;
      }
    }
  }

  fs.writeFileSync(shopPath, JSON.stringify(active, null, 2), 'utf8');
  fs.writeFileSync(statePath, JSON.stringify({ pool: state.order, index: state.index }, null, 2), 'utf8');

  const msg = `[ali-agent] ${new Date().toISOString()} — added ${added} high-sales product(s) (+20% markup). Shop total: ${active.length}`;
  console.log(msg);
  return { ok: true, added, total: active.length, message: msg };
}

/** First-time setup: fill the shop with the top high-sellers. */
function initAliExpressShop(opts = {}) {
  const root = opts.projectRoot || process.cwd();
  const initialCount = opts.count || 12;
  const pool = loadPool().filter(p => (p.orders || 0) >= MIN_ORDERS)
    .sort((a, b) => (b.orders || 0) - (a.orders || 0));
  const active = pool.slice(0, initialCount).map(toShopProduct);
  fs.writeFileSync(path.join(root, SHOP_FILE), JSON.stringify(active, null, 2), 'utf8');
  fs.writeFileSync(path.join(root, STATE_FILE),
    JSON.stringify({ pool: pool.map(p => p.id), index: initialCount }, null, 2), 'utf8');
  const msg = `[ali-agent] init — ${active.length} high-sales products imported (+20% markup)`;
  console.log(msg);
  return { ok: true, added: active.length, total: active.length, message: msg };
}

module.exports = { runAliExpressImport, initAliExpressShop, toShopProduct, MARKUP };

// allow running directly:  node agent/aliexpress_agent.js [--init] [--count N]
if (require.main === module) {
  const args = process.argv.slice(2);
  const count = (() => { const i = args.indexOf('--count'); return i >= 0 ? parseInt(args[i + 1]) : undefined; })();
  if (args.includes('--init')) initAliExpressShop({ count: count || 12 });
  else runAliExpressImport({ count: count || 2 });
}
