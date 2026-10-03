# Rewear — Circular Textile Atelier 🌅🧵

> An editorial circular textile studio web platform where worn-out garments (t-shirts, jeans, shirts) are handcrafted into **braided floor mats**, **patchwork bed sheets**, and **everyday carry tote bags** with transparent pricing between **₹200 and ₹1000**.

---

## 🌟 Senior UI/UX & Creative Engineering Highlights

### 1. Curated Color Theory & Eye-Soothing Twilight Sunset Palette 🌇
- **60-30-10 Harmony Rule**:
  - **60% Dominant (Canvas & Deep Atmosphere)**: Deep twilight obsidian (`#120E0B`) with warm espresso undertones that prevent retina fatigue.
  - **30% Secondary (Surfaces & Glass)**: Translucent dusk amber glass (`rgba(28, 20, 15, 0.74)`) with `backdrop-filter: blur(24px)`, warm linen headings (`#FAF7F2`), oatmeal body text (`#E5DBD1`), and dusk sand metadata (`#B8A89A`).
  - **10% Accent (Focal Energy)**: Warm sunset apricot (`#E88038`), golden honey (`#F7C86E`), and burnished terracotta (`#CF5D36`).
- **WebGL Evening Sunset Engine**: Procedural fragment shader generating an ambient twilight sky with diffused peach-gold horizon flare, smooth mountain ridges in warm atmospheric haze, and soft, gentle evening stars without harsh strobing.

### 2. Bespoke Luxury Atelier Brandmark (Clean & Professional) ♾️
- Precision-engineered vector emblem featuring a seamless **Möbius ribbon loop** of woven textile yarn, symbolizing infinite circular remaking.
- Pair with clean, tracked modern typography: **`REWEAR`** (`letter-spacing: 0.10em`) & **`CIRCULAR ATELIER`** (`letter-spacing: 0.16em`).

### 3. Tactile Atelier Cloth Swatch Lab & Real Thread Tear Simulation ✂️🪡
- **Authentic Woven Fabric Base**: Procedural diagonal twill texture with perimeter running sashiko seam hem and corner tailor marks.
- **Dimensional Embossed Typography**: The central **REWEAR** brandmark is crafted like luxury jacquard textile embroidery with debossed fabric shadow, warm sunset gold-apricot gradient, and linen stitch outlines (NOT flat white text).
- **Physical Cloth Tear Engine**:
  - Moving/dragging cursor over the fabric cuts organic ragged tear paths using `destination-out` with sinusoidal fiber jitter.
  - **Exposes Real Warp & Weft Threads**: Horizontal dyed saffron yarn and vertical natural cream cotton fibers spanning across the void, with snapped threads realistically curling and swaying.
  - **Cotton Fuzz Particles**: Drifting micro-particles of loose cotton fluff burst gently outward during tears.
  - **Interactive Atelier Tools**:
    - `[✂️ Hover to Fray Cloth]`: Active tearing cursor mode.
    - `[🪡 Click to Sashiko Stitch]`: Places high-contrast white-gold Japanese Sashiko cross (`+`) and star (`*`) repair stitches with authentic thread knots and drop shadows.
    - `[🔄 Restore Weave]`: Triggers a golden shuttle sweep beam that reweaves the fabric back to pristine condition.
    - Live condition badge: `PRISTINE FABRIC` → `WORN & FRAYED` → `REPAIRED (N STITCHES)`.

### 4. Dedicated Remake Order Section for Mats, Sheets & Bags (₹200 – ₹1000) 🧵
| Creation | Old Clothes Needed from You | Artisan Tailoring Fee |
| :--- | :--- | :--- |
| **Handwoven Braided Floor Mat (3ft)** | **4 to 6** Old T-shirts, Tops or Kurtis | **₹349** (Fixed) |
| **Patchwork Bed Sheet Quilt (Queen 90"×100")** | **8 to 10** Old Cotton Shirts, Flannels or Kurtas | **₹899** (Fixed) |
| **Artisan Denim Everyday Carry Tote Bag (18L)** | **2 to 3** Old T-shirts or 1 Pair of Worn Jeans | **₹249** (Fixed) |
| **Market Grocery Shopping Bag** | **3 to 4** Old T-shirts | **₹289** (Fixed) |

- **Live In-Page Calculator**: `+` / `-` pickers calculate exact old clothes needed and total charge in Rupees (`₹`), with instant doorstep pickup booking.

### 5. Working Authentication & Order Tracking 🔑
- Modal dialog with email/password authentication and a 1-click demo sign-in as *Elena Vance* (`elena.vance@example.com`).
- `localStorage` persistence, live header sync ("Elena" / "EV"), and customer tracking drawer.

---

## 🚀 Running Locally & Deploying to Vercel

### Running Locally
```bash
npm start
# or
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in any modern browser.

### Deploying to Vercel
This repository is pre-configured with:
- `vercel.json` — Edge CDN caching for assets and security headers.
- `.vercelignore` — Prevents Vercel from treating `server.js` as an unexported serverless function (which previously caused `500 FUNCTION_INVOCATION_FAILED`).
- `package.json` — Scripts for local dev and build hooks.
- Dual-mode `server.js` — Compatible with both local Node execution and serverless exports.

Simply push to your GitHub repository or run `vercel` to redeploy.
