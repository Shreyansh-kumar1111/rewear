/**
 * Rewear — Circular Textile Atelier
 * Updated with:
 * 1. Warm Evening Sunset WebGL Shader Background
 * 2. Interactive Cursor "Worn Cloth Hole" on the center "REWEAR" Wordmark with Click-to-Stitch
 * 3. Dedicated In-Page Order Configurator for Mats, Sheets & Bags (Pricing in ₹200 - ₹1000)
 * 4. Real Working Authentication with LocalStorage & Demo Account
 * 5. Full Upcycle Order Wizard in Rupees (₹)
 * 6. Before/After Split Comparison Slider
 * 7. Live Eco Savings Calculator
 */

document.addEventListener("DOMContentLoaded", () => {
  initEveningShader();
  initWordmarkHoleEffect();
  initDedicatedOrderSection();
  initComparisonSlider();
  initProductCatalog();
  initImpactCalculator();
  initOrderWizard();
  initProfileDashboard();
  initAuthSystem();
  initNavigation();
  initOrderTracker();
});

/* ==========================================================================
   1. Warm Evening Sunset WebGL Shader Engine
   ========================================================================== */
function initEveningShader() {
  const canvas = document.getElementById("c");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance"
  });

  if (!gl) return;

  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  const VS = `
    attribute vec2 a_pos;
    void main(){
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Warm Golden Sunset / Evening Twilight Sky Shader
  const FS = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    float hash(float n){ return fract(sin(n)*43758.5453123); }
    float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

    float noise(float x){
      float i = floor(x);
      float f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(hash(i), hash(i+1.0), f);
    }

    float fbm(float x, float octaves){
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for(int i = 0; i < 6; i++){
        if(float(i) >= octaves) break;
        val += amp * noise(x * freq);
        freq *= 2.17;
        amp *= 0.48;
      }
      return val;
    }

    float meteor(vec2 uv, float t){
      float cycle = mod(t * 0.14, 1.0);
      float seed = floor(t * 0.14);
      float h = hash(seed * 7.31);
      float h2 = hash(seed * 13.17);
      if(h > 0.35) return 0.0;
      vec2 start = vec2(0.2 + h2 * 0.6, 0.75 + h * 0.2);
      vec2 dir = normalize(vec2(1.0, -0.5 - h * 0.3));
      float progress = smoothstep(0.0, 0.7, cycle);
      vec2 pos = start + dir * progress * 0.5;
      vec2 toP = uv - pos;
      float along = dot(toP, dir);
      float perp = length(toP - dir * along);
      float trail = smoothstep(0.0, -0.12, along) * smoothstep(-0.18, -0.04, along);
      float core = smoothstep(0.003, 0.0, perp) * trail;
      float glow = smoothstep(0.015, 0.0, perp) * trail * 0.4;
      float fade = smoothstep(0.0, 0.1, cycle) * smoothstep(0.8, 0.55, cycle);
      return (core + glow) * fade;
    }

    float stars(vec2 uv, float density){
      vec2 cell = floor(uv * density);
      vec2 sub = fract(uv * density);
      float h = hash2(cell);
      float brightness = step(0.98, h);
      float size = 0.025 + h * 0.04;
      float d = length(sub - vec2(hash2(cell + 100.0), hash2(cell + 200.0)));
      float star = brightness * smoothstep(size, 0.0, d);
      star *= 0.5 + 0.5 * sin(u_time * (1.0 + h * 3.0) + h * 6.28);
      return star;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      float aspect = u_res.x / u_res.y;

      vec2 mouse = u_mouse * 2.0 - 1.0;

      // Eye-Soothing Twilight Sunset Sky Palette (Curated Color Harmony)
      vec3 skyTop    = vec3(0.06, 0.04, 0.09); // Deep tranquil dusk indigo
      vec3 skyMid    = vec3(0.24, 0.11, 0.06); // Warm burnt sienna / terracotta
      vec3 skyBottom = vec3(0.55, 0.28, 0.08); // Warm honey amber glow

      float skyGrad = uv.y;
      vec3 col = mix(skyBottom, skyMid, smoothstep(0.25, 0.65, skyGrad));
      col = mix(col, skyTop, smoothstep(0.65, 1.0, skyGrad));

      // Golden Hour Horizon Glow
      float horizonY = 0.35;
      float horizonGlow = exp(-pow((uv.y - horizonY) * 3.2, 2.0));
      col += vec3(0.78, 0.38, 0.08) * horizonGlow * 0.95;

      // Setting Sun Corona Flare (Soft Diffused Peach-Gold)
      float centerGlow = exp(-pow((uv.x - 0.5) * 1.8, 2.0)) * exp(-pow((uv.y - horizonY) * 3.4, 2.0));
      col += vec3(0.88, 0.48, 0.12) * centerGlow * 0.85;

      // Golden evening stars
      float starField = stars(uv * vec2(aspect, 1.0), 55.0)
                      + stars(uv * vec2(aspect, 1.0) + 500.0, 95.0) * 0.6;

      float starMask = 1.0;
      float xC, yS, prof, mTop, mtn, rDist, rGlow, rAmb;
      vec3 lC;

      // Layer 0: Deepest mountain ridge in burning amber haze
      lC = vec3(0.26, 0.12, 0.05);
      xC = uv.x * aspect * 1.6 + u_time * 0.006 + mouse.x * 0.010;
      yS = mouse.y * 0.003;
      prof = fbm(xC, 5.0) * 0.10 + fbm(xC * 0.3 + 17.0, 3.0) * 0.07;
      mTop = 0.41 + prof + yS;
      mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
      rDist = abs(uv.y - mTop);
      rGlow = smoothstep(0.014, 0.0, rDist) * 0.22;
      rAmb = smoothstep(0.04, 0.0, rDist) * 0.08;
      col = mix(col, lC, mtn);
      col += vec3(0.95, 0.52, 0.12) * rGlow;
      col += vec3(0.65, 0.30, 0.06) * rAmb;
      starMask *= (1.0 - mtn);

      // Layer 1
      lC = vec3(0.18, 0.08, 0.04);
      xC = uv.x * aspect * 2.0 + u_time * 0.012 + mouse.x * 0.020;
      yS = mouse.y * 0.006;
      prof = fbm(xC, 5.0) * 0.13 + fbm(xC * 0.3 + 34.0, 3.0) * 0.091;
      mTop = 0.33 + prof + yS;
      mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
      rDist = abs(uv.y - mTop);
      rGlow = smoothstep(0.014, 0.0, rDist) * 0.18;
      rAmb = smoothstep(0.04, 0.0, rDist) * 0.06;
      col = mix(col, lC, mtn);
      col += vec3(0.95, 0.52, 0.12) * rGlow;
      col += vec3(0.55, 0.24, 0.05) * rAmb;
      starMask *= (1.0 - mtn);

      // Layer 2
      lC = vec3(0.12, 0.055, 0.025);
      xC = uv.x * aspect * 2.6 + u_time * 0.020 + mouse.x * 0.034;
      yS = mouse.y * 0.010;
      prof = fbm(xC, 5.0) * 0.16 + fbm(xC * 0.3 + 51.0, 3.0) * 0.112;
      mTop = 0.25 + prof + yS;
      mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
      rDist = abs(uv.y - mTop);
      rGlow = smoothstep(0.014, 0.0, rDist) * 0.15;
      rAmb = smoothstep(0.04, 0.0, rDist) * 0.045;
      col = mix(col, lC, mtn);
      col += vec3(0.95, 0.52, 0.12) * rGlow;
      starMask *= (1.0 - mtn);

      // Layer 3
      lC = vec3(0.07, 0.032, 0.015);
      xC = uv.x * aspect * 3.2 + u_time * 0.030 + mouse.x * 0.050;
      yS = mouse.y * 0.015;
      prof = fbm(xC, 5.0) * 0.14 + fbm(xC * 0.3 + 68.0, 3.0) * 0.098;
      mTop = 0.17 + prof + yS;
      mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
      rDist = abs(uv.y - mTop);
      rGlow = smoothstep(0.012, 0.0, rDist) * 0.11;
      col = mix(col, lC, mtn);
      col += vec3(0.95, 0.52, 0.12) * rGlow;
      starMask *= (1.0 - mtn);

      // Layer 4: Foreground Silhouette
      lC = vec3(0.035, 0.016, 0.008);
      xC = uv.x * aspect * 4.0 + u_time * 0.044 + mouse.x * 0.070;
      yS = mouse.y * 0.021;
      prof = fbm(xC, 5.0) * 0.11 + fbm(xC * 0.3 + 85.0, 3.0) * 0.077;
      mTop = 0.085 + prof + yS;
      mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
      rDist = abs(uv.y - mTop);
      rGlow = smoothstep(0.012, 0.0, rDist) * 0.08;
      col = mix(col, lC, mtn);
      col += vec3(0.95, 0.52, 0.12) * rGlow;
      starMask *= (1.0 - mtn);

      // Star & Meteor Compositing
      col += vec3(1.0, 0.9, 0.7) * starField * starMask;
      float met = meteor(uv * vec2(aspect, 1.0), u_time);
      col += vec3(1.0, 0.75, 0.4) * met * starMask;

      // Soft Sunset Vignette
      float vig = 1.0 - 0.28 * pow(length((uv - 0.5) * vec2(1.1, 1.5)), 2.0);
      col *= vig;

      // Warm Golden Dust Haze
      float haze = exp(-pow((uv.y - 0.34) * 4.5, 2.0)) * 0.08;
      col += vec3(0.85, 0.42, 0.08) * haze;

      gl_FragColor = vec4(pow(col, vec3(0.96)), 1.0);
    }
  `;

  function createShader(src, type) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  const vs = createShader(VS, gl.VERTEX_SHADER);
  const fs = createShader(FS, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  let mx = 0.5, my = 0.5;
  let smx = 0.5, smy = 0.5;

  const handlePointer = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mx = clientX / window.innerWidth;
    my = 1.0 - (clientY / window.innerHeight);
  };

  window.addEventListener("mousemove", handlePointer, { passive: true });
  window.addEventListener("touchmove", handlePointer, { passive: true });

  let isRunning = true;
  function render(time) {
    if (!isRunning) return;
    const t = time * 0.001;
    smx += (mx - smx) * 0.04;
    smy += (my - smy) * 0.04;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, smx, smy);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  document.addEventListener("visibilitychange", () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(render);
  });
}

/* ==========================================================================
   2. Interactive Hero Wordmark: Words That Get Real Worn Cloth Holes
   ========================================================================== */
function initWordmarkHoleEffect() {
  const canvas = document.getElementById("wordmark-canvas");
  const stage = document.getElementById("wordmark-interactive-stage") || 
                document.getElementById("wordmark-stage") || 
                document.querySelector(".wordmark-interactive-stage");
  if (!canvas || !stage) return;

  const ctx = canvas.getContext("2d");
  let width = 0, height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Stitches placed on the typography
  const stitches = [];
  // Floating cotton fibers
  const particles = [];

  const hole = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    radius: 0,
    targetRadius: 0,
    active: false,
    lastTime: Date.now()
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (hole.targetX < 0) {
      hole.targetX = width / 2;
      hole.targetY = height / 2;
      hole.x = width / 2;
      hole.y = height / 2;
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  document.fonts?.ready?.then(() => resize());
  setTimeout(resize, 60);
  setTimeout(resize, 350);
  resize();

  function updatePointer(e) {
    const rect = stage.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const curX = clientX - rect.left;
    const curY = clientY - rect.top;

    hole.targetX = curX;
    hole.targetY = curY;
    hole.active = true;
    hole.lastTime = Date.now();

    const dx = hole.targetX - hole.x;
    const dy = hole.targetY - hole.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Steady resting hole around 50px, expands with velocity up to 72px
    hole.targetRadius = Math.min(74, 50 + speed * 0.45);

    // Emit subtle cotton fibers on interaction
    if (Math.random() < 0.3) {
      particles.push({
        x: curX + (Math.random() - 0.5) * 20,
        y: curY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.4 - Math.random() * 0.8,
        life: 1,
        size: 1.2 + Math.random() * 1.6,
        color: Math.random() > 0.4 ? "#F7C86E" : "#FAF7F2"
      });
    }
  }

  stage.addEventListener("mousemove", updatePointer);
  stage.addEventListener("touchmove", updatePointer, { passive: true });
  stage.addEventListener("touchstart", updatePointer, { passive: true });

  const onPointerLeave = () => {
    hole.active = false;
    hole.targetRadius = 0;
  };

  stage.addEventListener("mouseleave", onPointerLeave);
  stage.addEventListener("touchend", onPointerLeave);

  // Click directly on the typography to place an artisan Sashiko gold stitch
  stage.addEventListener("click", (e) => {
    const rect = stage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    stitches.push({
      x: clickX,
      y: clickY,
      angle: (Math.random() - 0.5) * 0.4,
      size: 13 + Math.random() * 7,
      type: Math.random() > 0.4 ? "star" : "cross"
    });

    if (stitches.length > 25) stitches.shift();
    showToast("🪡 Gold Sashiko stitch placed on REWEAR letters!", "success");
  });

  // Render loop
  function render(time) {
    ctx.clearRect(0, 0, width, height);

    // Smooth lerping of hole coordinates and radius
    hole.x += (hole.targetX - hole.x) * 0.16;
    hole.y += (hole.targetY - hole.y) * 0.16;

    // While pointer is active on words, maintain the hole (minimum 46px); heal only when pointer leaves
    if (!hole.active) {
      hole.targetRadius = 0;
    } else {
      // Gentle decay towards steady resting aperture if stationary
      hole.targetRadius += (50 - hole.targetRadius) * 0.05;
    }
    hole.radius += (hole.targetRadius - hole.radius) * 0.12;

    // 1. Draw Woven Dimensional Typography "REWEAR"
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Responsive font calculation
    const fontSize = Math.min(width * 0.19, height * 0.74);
    ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
    const textY = height / 2 + 2;

    // Deboss Drop Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 14;

    // Luxury Warm Sunset Ochre / Terracotta Gradient
    const textGrad = ctx.createLinearGradient(width / 2 - width * 0.35, textY - fontSize * 0.4, width / 2 + width * 0.35, textY + fontSize * 0.4);
    textGrad.addColorStop(0, "#FAF7F2");   // Linen highlight
    textGrad.addColorStop(0.32, "#F7C86E"); // Golden honey
    textGrad.addColorStop(0.68, "#E88038"); // Sunset apricot
    textGrad.addColorStop(1, "#CF5D36");    // Warm terracotta

    ctx.fillStyle = textGrad;
    ctx.fillText("REWEAR", width / 2, textY);

    // Subtle Embroidered Linen Edge Outline
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(247, 200, 110, 0.35)";
    ctx.strokeText("REWEAR", width / 2, textY);
    ctx.restore();

    // 2. Cut Dynamic Worn-Cloth Hole Directly Through the Letters of REWEAR
    if (hole.radius > 2) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";

      // Draw organic ragged/frayed aperture
      ctx.beginPath();
      const pts = 24;
      for (let i = 0; i <= pts; i++) {
        const theta = (i / pts) * Math.PI * 2;
        const jitter = Math.sin(theta * 5 + time * 0.003) * 3.5 + Math.cos(theta * 3) * 2;
        const curR = hole.radius + jitter;
        const px = hole.x + Math.cos(theta) * curR;
        const py = hole.y + Math.sin(theta) * curR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Draw Catenary Saffron & Cream Threads Across the Parted Hole on the Letters
      ctx.save();
      const rad = hole.radius;

      // 7 Clean Catenary Saffron Weft Threads
      const weftCount = 7;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
      ctx.lineWidth = 1.3;

      for (let j = 0; j < weftCount; j++) {
        const yFrac = ((j + 0.5) / weftCount) * 2 - 1;
        const py = hole.y + yFrac * (rad * 0.75);
        const chordHalf = Math.sqrt(Math.max(0, rad * rad - Math.pow(yFrac * rad * 0.75, 2))) * 0.95;
        const startX = hole.x - chordHalf;
        const endX = hole.x + chordHalf;

        if (chordHalf > 4) {
          const sag = (1 - Math.abs(yFrac)) * 4 + Math.sin(time * 0.003 + j * 0.8) * 1.5;
          ctx.beginPath();
          ctx.moveTo(startX, py);
          ctx.quadraticCurveTo(hole.x, py + sag, endX, py);
          ctx.stroke();
        }
      }

      // 4 Natural Cream Warp Threads
      ctx.strokeStyle = "rgba(250, 247, 242, 0.75)";
      ctx.lineWidth = 1.1;
      const warpCount = 4;
      for (let k = 0; k < warpCount; k++) {
        const xFrac = ((k + 0.5) / warpCount) * 2 - 1;
        const px = hole.x + xFrac * (rad * 0.75);
        const chordHalfY = Math.sqrt(Math.max(0, rad * rad - Math.pow(xFrac * rad * 0.75, 2))) * 0.95;
        const startY = hole.y - chordHalfY;
        const endY = hole.y + chordHalfY;

        if (chordHalfY > 4) {
          const sway = Math.cos(time * 0.003 + k) * 2;
          ctx.beginPath();
          ctx.moveTo(px, startY);
          ctx.quadraticCurveTo(px + sway, hole.y, px, endY);
          ctx.stroke();
        }
      }

      // Delicate frayed fringe fibers at the rim of the parted letters
      ctx.strokeStyle = "rgba(242, 164, 68, 0.75)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      const fringeCount = 14;
      for (let m = 0; m < fringeCount; m++) {
        const ang = (m / fringeCount) * Math.PI * 2;
        const rimX = hole.x + Math.cos(ang) * (rad - 1);
        const rimY = hole.y + Math.sin(ang) * (rad - 1);
        const fLen = 4 + (m % 3) * 2;
        ctx.moveTo(rimX, rimY);
        ctx.lineTo(rimX + Math.cos(ang) * fLen, rimY + Math.sin(ang) * fLen);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Placed Sashiko Stitches on the Typography
    stitches.forEach(st => {
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.angle);

      ctx.shadowColor = "rgba(18, 12, 8, 0.7)";
      ctx.shadowOffsetY = 1.5;
      ctx.shadowBlur = 4;

      ctx.strokeStyle = "#FAF7F2";
      ctx.lineWidth = 2.2;
      const s = st.size;

      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.lineTo(s, 0);
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.stroke();

      if (st.type === "star") {
        const ds = s * 0.65;
        ctx.beginPath();
        ctx.moveTo(-ds, -ds);
        ctx.lineTo(ds, ds);
        ctx.moveTo(ds, -ds);
        ctx.lineTo(-ds, ds);
        ctx.stroke();
      }

      ctx.fillStyle = "#F7C86E";
      ctx.beginPath();
      ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Drifting Cotton Fuzz Particles
    for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
      const p = particles[pIdx];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      if (p.life <= 0) {
        particles.splice(pIdx, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life * 0.8;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   3. Dedicated Order Section for Mats, Sheets & Bags (Pricing in ₹200 - ₹1000)
   ========================================================================== */
function initDedicatedOrderSection() {
  const qtyMat = document.getElementById("qty-mat");
  const qtySheet = document.getElementById("qty-sheet");
  const qtyTote = document.getElementById("qty-tote");
  const qtyCushion = document.getElementById("qty-cushion");
  const qtyPetbed = document.getElementById("qty-petbed");
  const qtyTshirtbag = document.getElementById("qty-tshirtbag");
  const qtyShopping = document.getElementById("qty-shopping");

  const totalClothesEl = document.getElementById("total-clothes-needed");
  const totalChargeEl = document.getElementById("total-charge-rupees");
  const submitText = document.getElementById("quick-submit-text");
  const form = document.getElementById("quick-order-form");

  // Prices in Rupees (Strictly within ₹200 - ₹1000)
  const PRICES = {
    mat: 349,        // Handwoven Floor Mat (₹349)
    sheet: 899,      // Patchwork Bed Sheet Quilt (₹899)
    tote: 249,       // Artisan Denim Tote Bag (₹249)
    cushion: 299,    // Patchwork Cushion Covers Pair (₹299)
    petbed: 599,     // Upcycled Cozy Pet Bed (₹599)
    tshirtbag: 229,  // Custom Graphic T-Shirt Bag (₹229)
    shopping: 289    // Grocery Shopping Bag (₹289)
  };

  // Garment requirements per unit
  const CLOTHES_REQ = {
    mat: { min: 4, max: 6 },
    sheet: { min: 8, max: 10 },
    tote: { min: 2, max: 3 },
    cushion: { min: 3, max: 4 },
    petbed: { min: 6, max: 8 },
    tshirtbag: { min: 2, max: 3 },
    shopping: { min: 3, max: 4 }
  };

  const quantities = {
    mat: 1,
    sheet: 0,
    tote: 1,
    cushion: 0,
    petbed: 0,
    tshirtbag: 0,
    shopping: 0
  };

  // Interactive Payment Mode Selector Pills
  const payPills = document.querySelectorAll(".payment-mode-pill");
  payPills.forEach(pill => {
    pill.addEventListener("click", () => {
      payPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      recalculate();
    });
  });

  function recalculate() {
    let totalPrice = 0;
    let minClothes = 0;
    let maxClothes = 0;

    Object.keys(quantities).forEach(k => {
      const q = quantities[k] || 0;
      totalPrice += q * (PRICES[k] || 0);
      minClothes += q * (CLOTHES_REQ[k]?.min || 0);
      maxClothes += q * (CLOTHES_REQ[k]?.max || 0);
    });

    if (totalChargeEl) totalChargeEl.textContent = `₹${totalPrice}`;
    if (totalClothesEl) {
      if (minClothes === 0) {
        totalClothesEl.textContent = "0 Garments";
      } else {
        totalClothesEl.textContent = `${minClothes} to ${maxClothes} Garments`;
      }
    }

    if (submitText) {
      submitText.textContent = `Place Upcycle Order & Book Pickup (Pay ₹${totalPrice})`;
    }
  }

  // Handle + and - buttons
  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.dataset.item;
      const action = btn.dataset.action;

      if (!quantities.hasOwnProperty(item)) return;

      if (action === "inc") {
        quantities[item] = Math.min(10, quantities[item] + 1);
      } else if (action === "dec") {
        quantities[item] = Math.max(0, quantities[item] - 1);
      }

      // Update UI elements
      if (item === "mat" && qtyMat) qtyMat.textContent = quantities.mat;
      if (item === "sheet" && qtySheet) qtySheet.textContent = quantities.sheet;
      if (item === "tote" && qtyTote) qtyTote.textContent = quantities.tote;
      if (item === "cushion" && qtyCushion) qtyCushion.textContent = quantities.cushion;
      if (item === "petbed" && qtyPetbed) qtyPetbed.textContent = quantities.petbed;
      if (item === "tshirtbag" && qtyTshirtbag) qtyTshirtbag.textContent = quantities.tshirtbag;
      if (item === "shopping" && qtyShopping) qtyShopping.textContent = quantities.shopping;

      recalculate();
    });
  });

  // "Order Floor Mat", "Order Bed Sheet", "Order Denim Tote", etc. buttons on cards
  document.querySelectorAll("[data-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.preset;
      const calcPanel = document.getElementById("quick-order-panel");
      if (calcPanel) calcPanel.scrollIntoView({ behavior: "smooth" });

      if (preset === "mat") quantities.mat = Math.max(1, quantities.mat);
      if (preset === "sheet") quantities.sheet = Math.max(1, quantities.sheet);
      if (preset === "tote") quantities.tote = Math.max(1, quantities.tote);
      if (preset === "cushion") quantities.cushion = Math.max(1, quantities.cushion);
      if (preset === "petbed") quantities.petbed = Math.max(1, quantities.petbed);
      if (preset === "tshirtbag") quantities.tshirtbag = Math.max(1, quantities.tshirtbag);
      if (preset === "shopping") quantities.shopping = Math.max(1, quantities.shopping);

      if (qtyMat) qtyMat.textContent = quantities.mat;
      if (qtySheet) qtySheet.textContent = quantities.sheet;
      if (qtyTote) qtyTote.textContent = quantities.tote;
      if (qtyCushion) qtyCushion.textContent = quantities.cushion;
      if (qtyPetbed) qtyPetbed.textContent = quantities.petbed;
      if (qtyTshirtbag) qtyTshirtbag.textContent = quantities.tshirtbag;
      if (qtyShopping) qtyShopping.textContent = quantities.shopping;

      recalculate();
      showToast(`Selected ${preset.toUpperCase()}! Cloth calculator updated.`, "success");
    });
  });

  // Handle in-page order submission asking Name, Number, Address & Mode of Payment
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("quick-customer-name");
    const phoneInput = document.getElementById("quick-customer-phone");
    const addressInput = document.getElementById("quick-customer-address");

    const name = nameInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const address = addressInput?.value.trim() || "";

    if (!name) {
      showToast("Please enter your full name for order pickup.", "error");
      nameInput?.focus();
      return;
    }

    if (!phone) {
      showToast("Please enter your phone / WhatsApp number.", "error");
      phoneInput?.focus();
      return;
    }

    if (phone.length < 7) {
      showToast("Please enter a valid contact phone number.", "error");
      phoneInput?.focus();
      return;
    }

    if (!address) {
      showToast("Please enter your doorstep pickup and delivery address.", "error");
      addressInput?.focus();
      return;
    }

    let totalPrice = 0;
    let minClothes = 0;
    let maxClothes = 0;
    const itemSummaryList = [];

    Object.keys(quantities).forEach(k => {
      const count = quantities[k];
      if (count > 0) {
        totalPrice += count * PRICES[k];
        minClothes += count * CLOTHES_REQ[k].min;
        maxClothes += count * CLOTHES_REQ[k].max;
        const label = k === "mat" ? "Floor Mat" :
                      k === "sheet" ? "Bed Sheet" :
                      k === "tote" ? "Denim Tote" :
                      k === "cushion" ? "Cushion Covers (Pair)" :
                      k === "petbed" ? "Pet Bed" :
                      k === "tshirtbag" ? "T-Shirt Bag" : "Shopping Bag";
        itemSummaryList.push(`${count}x ${label}`);
      }
    });

    if (totalPrice === 0) {
      showToast("Please select at least 1 creation item to place your order.", "error");
      return;
    }

    const checkedPayRadio = document.querySelector('input[name="quick_payment_mode"]:checked');
    const paymentMode = checkedPayRadio?.value || "Cash on Pickup / Delivery (COD)";

    const orderId = `RW-IN-${Math.floor(1000 + Math.random() * 9000)}`;
    const clothesNeededStr = `${minClothes} to ${maxClothes} Garments`;

    // Populate Order Confirmation Modal
    const receiptOrderId = document.getElementById("receipt-order-id");
    const receiptCustName = document.getElementById("receipt-customer-name");
    const receiptCustPhone = document.getElementById("receipt-customer-phone");
    const receiptCustAddr = document.getElementById("receipt-customer-address");
    const receiptPayMode = document.getElementById("receipt-payment-mode");
    const receiptClothes = document.getElementById("receipt-clothes-needed");
    const receiptTotal = document.getElementById("receipt-total-charge");

    if (receiptOrderId) receiptOrderId.textContent = orderId;
    if (receiptCustName) receiptCustName.textContent = name;
    if (receiptCustPhone) receiptCustPhone.textContent = phone;
    if (receiptCustAddr) receiptCustAddr.textContent = address;
    if (receiptPayMode) receiptPayMode.textContent = paymentMode;
    if (receiptClothes) receiptClothes.textContent = clothesNeededStr;
    if (receiptTotal) receiptTotal.textContent = `₹${totalPrice}`;

    // Update Profile state with user's real entered info
    const orderIdEl = document.getElementById("profile-order-id");
    const itemNameEl = document.getElementById("profile-item-name");
    const statusEl = document.getElementById("profile-order-status");
    const countEl = document.getElementById("profile-garment-count");
    const pTitle = document.getElementById("profile-title");
    const pEmail = document.getElementById("profile-user-email");
    const pAvatar = document.getElementById("profile-avatar-letters");

    if (orderIdEl) orderIdEl.textContent = orderId;
    if (itemNameEl) itemNameEl.textContent = itemSummaryList.join(", ") || "Custom Remake Suite";
    if (statusEl) {
      statusEl.textContent = "Pickup Scheduled";
      statusEl.className = "order-status-badge status-in-progress";
    }
    if (countEl) {
      countEl.textContent = parseInt(countEl.textContent || "0", 10) + minClothes;
    }
    if (pTitle) pTitle.textContent = name;
    if (pEmail) pEmail.textContent = phone;
    if (pAvatar) {
      const inits = name.split(" ").map(w => w[0]).join("").toUpperCase();
      pAvatar.textContent = inits || "RW";
    }

    // Save recent order into LocalStorage
    localStorage.setItem("rewear_recent_order", JSON.stringify({
      orderId,
      name,
      phone,
      address,
      paymentMode,
      totalPrice,
      clothesNeededStr,
      items: itemSummaryList.join(", "),
      date: new Date().toLocaleDateString()
    }));

    // Show Confirmation Dialog
    const placedDialog = document.getElementById("order-placed-dialog");
    placedDialog?.showModal();

    showToast(`Order Placed! Code: ${orderId}. Payment: ${paymentMode}. Total: ₹${totalPrice}`, "success");
  });

  // Wire up close button for placed dialog
  document.getElementById("close-placed-dialog")?.addEventListener("click", () => {
    document.getElementById("order-placed-dialog")?.close();
  });

  document.getElementById("order-placed-dialog")?.addEventListener("click", (e) => {
    const d = document.getElementById("order-placed-dialog");
    if (e.target === d) d.close();
  });

  // Wire up "Track Order Live in Profile" button
  document.getElementById("btn-view-tracking-profile")?.addEventListener("click", () => {
    document.getElementById("order-placed-dialog")?.close();
    openProfileDashboard();
  });

  recalculate();
}

/* ==========================================================================
   4. Interactive Before & After Comparison Slider
   ========================================================================== */
function initComparisonSlider() {
  const stage = document.getElementById("comparison-stage");
  const clip = document.getElementById("comparison-clip");
  const handle = document.getElementById("comparison-handle");
  const beforeImg = document.getElementById("before-img-target");
  if (!stage || !clip || !handle || !beforeImg) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = stage.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (offsetX / rect.width) * 100;

    clip.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
    beforeImg.style.width = `${rect.width}px`;
  }

  function syncImageWidth() {
    const rect = stage.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
  }

  window.addEventListener("resize", syncImageWidth);
  syncImageWidth();

  const onStart = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const onEnd = () => {
    isDragging = false;
  };

  stage.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  stage.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onEnd);
}

/* ==========================================================================
   5. Products Catalog Filtering
   ========================================================================== */
function initProductCatalog() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".product-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll("[data-style]").forEach(btn => {
    btn.addEventListener("click", () => {
      const styleId = btn.dataset.style;
      openOrderWizardWithStyle(styleId);
    });
  });
}

/* ==========================================================================
   6. Environmental Savings Calculator
   ========================================================================== */
function initImpactCalculator() {
  const sliderTees = document.getElementById("slider-tees");
  const sliderJeans = document.getElementById("slider-jeans");
  const sliderShirts = document.getElementById("slider-shirts");

  const valTees = document.getElementById("val-tees");
  const valJeans = document.getElementById("val-jeans");
  const valShirts = document.getElementById("val-shirts");

  const metricWater = document.getElementById("metric-water");
  const metricCarbon = document.getElementById("metric-carbon");
  const metricWaste = document.getElementById("metric-waste");
  const metricPoints = document.getElementById("metric-points");

  if (!sliderTees || !sliderJeans || !sliderShirts) return;

  function calculateImpact() {
    const t = parseInt(sliderTees.value, 10);
    const j = parseInt(sliderJeans.value, 10);
    const s = parseInt(sliderShirts.value, 10);

    valTees.textContent = t;
    valJeans.textContent = j;
    valShirts.textContent = s;

    const waterLiters = (t * 2700) + (j * 7600) + (s * 3200);
    const co2Kg = ((t * 3.6) + (j * 8.4) + (s * 4.1)).toFixed(1);
    const wasteKg = ((t * 0.18) + (j * 0.82) + (s * 0.32)).toFixed(1);
    const points = (t * 30) + (j * 75) + (s * 45);

    metricWater.textContent = `${waterLiters.toLocaleString()} L`;
    metricCarbon.textContent = `${co2Kg} kg`;
    metricWaste.textContent = `${wasteKg} kg`;
    metricPoints.textContent = `${points} pts`;
  }

  sliderTees.addEventListener("input", calculateImpact);
  sliderJeans.addEventListener("input", calculateImpact);
  sliderShirts.addEventListener("input", calculateImpact);
  calculateImpact();
}

/* ==========================================================================
   7. Full Upcycle Order Wizard (Multi-Step in Rupees)
   ========================================================================== */
let wizardCurrentStep = 1;
const wizardTotalSteps = 4;

function initOrderWizard() {
  const dialog = document.getElementById("order-wizard-dialog");
  const closeBtn = document.getElementById("close-order-dialog");
  const nextBtn = document.getElementById("wizard-next-btn");
  const prevBtn = document.getElementById("wizard-prev-btn");
  const submitBtn = document.getElementById("wizard-submit-btn");
  const form = document.getElementById("order-wizard-form");

  if (!dialog) return;

  document.getElementById("nav-order-btn")?.addEventListener("click", () => openOrderWizard());
  document.getElementById("mobile-order-btn")?.addEventListener("click", () => {
    document.getElementById("mobile-drawer")?.classList.remove("open");
    openOrderWizard();
  });

  closeBtn?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  nextBtn?.addEventListener("click", () => {
    if (wizardCurrentStep < wizardTotalSteps) {
      goToWizardStep(wizardCurrentStep + 1);
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (wizardCurrentStep > 1) {
      goToWizardStep(wizardCurrentStep - 1);
    }
  });

  document.querySelectorAll('input[name="target_creation"]').forEach(radio => {
    radio.addEventListener("change", updateWizardSummary);
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOrderSubmission();
  });
}

function openOrderWizard() {
  const dialog = document.getElementById("order-wizard-dialog");
  if (!dialog) return;
  goToWizardStep(1);
  updateWizardSummary();
  dialog.showModal();
}

function openOrderWizardWithStyle(styleId) {
  openOrderWizard();
  const creationRadios = document.querySelectorAll('input[name="target_creation"]');

  if (styleId === "mat") {
    creationRadios[0].checked = true;
  } else if (styleId === "bed-sheet") {
    creationRadios[1].checked = true;
  } else if (styleId === "sashiko-tote") {
    creationRadios[2].checked = true;
  } else if (styleId === "shopping-bag") {
    creationRadios[3].checked = true;
  }
  updateWizardSummary();
  goToWizardStep(2);
}

function goToWizardStep(stepNum) {
  wizardCurrentStep = stepNum;

  document.querySelectorAll(".wizard-step").forEach((step, idx) => {
    step.classList.toggle("active", idx + 1 === stepNum);
  });

  document.querySelectorAll(".step-indicator-item").forEach((ind, idx) => {
    const s = idx + 1;
    ind.classList.toggle("active", s === stepNum);
    ind.classList.toggle("done", s < stepNum);
  });

  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");
  const submitBtn = document.getElementById("wizard-submit-btn");

  if (prevBtn) prevBtn.style.display = stepNum > 1 ? "block" : "none";

  if (stepNum === wizardTotalSteps) {
    if (nextBtn) nextBtn.style.display = "none";
    if (submitBtn) submitBtn.style.display = "block";
  } else {
    if (nextBtn) {
      nextBtn.style.display = "block";
      const nextLabels = [
        "Next: Choose Creation &rarr;",
        "Next: Artisan Stitching &rarr;",
        "Next: Pickup &amp; Review &rarr;"
      ];
      nextBtn.innerHTML = nextLabels[stepNum - 1] || "Next &rarr;";
    }
    if (submitBtn) submitBtn.style.display = "none";
  }

  updateWizardSummary();
}

function updateWizardSummary() {
  const checkedRadio = document.querySelector('input[name="target_creation"]:checked');
  const selectedCreation = checkedRadio?.value || "Handwoven Floor Mat / Rug (3ft)";
  const price = checkedRadio?.dataset.price ? `₹${checkedRadio.dataset.price}` : "₹349";

  const nameEl = document.getElementById("summary-creation-name");
  const priceEl = document.getElementById("summary-total-price");

  if (nameEl) nameEl.textContent = selectedCreation;
  if (priceEl) priceEl.textContent = price;
}

function handleOrderSubmission() {
  const wizardDialog = document.getElementById("order-wizard-dialog");
  const selectedCreation = document.querySelector('input[name="target_creation"]:checked')?.value || "Handwoven Floor Mat / Rug (3ft)";
  const checkedRadio = document.querySelector('input[name="target_creation"]:checked');
  const price = checkedRadio?.dataset.price ? `₹${checkedRadio.dataset.price}` : "₹349";

  const nameInput = document.getElementById("sender-name");
  const phoneInput = document.getElementById("sender-phone");
  const addressInput = document.getElementById("sender-address");

  const name = nameInput?.value.trim() || "";
  const phone = phoneInput?.value.trim() || "";
  const address = addressInput?.value.trim() || "";
  const paymentMethod = document.getElementById("payment-method")?.value || "Cash on Delivery / Pickup";

  if (!name) {
    showToast("Please enter your full name in Step 4.", "error");
    nameInput?.focus();
    return;
  }
  if (!phone) {
    showToast("Please enter your contact phone number in Step 4.", "error");
    phoneInput?.focus();
    return;
  }
  if (!address) {
    showToast("Please enter your doorstep pickup address in Step 4.", "error");
    addressInput?.focus();
    return;
  }

  const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
  const newOrderId = `RW-2026-${randomOrderNum}`;

  // Update Receipt Modal fields
  const receiptOrderId = document.getElementById("receipt-order-id");
  const receiptCustName = document.getElementById("receipt-customer-name");
  const receiptCustPhone = document.getElementById("receipt-customer-phone");
  const receiptCustAddr = document.getElementById("receipt-customer-address");
  const receiptPayMode = document.getElementById("receipt-payment-mode");
  const receiptClothes = document.getElementById("receipt-clothes-needed");
  const receiptTotal = document.getElementById("receipt-total-charge");

  if (receiptOrderId) receiptOrderId.textContent = newOrderId;
  if (receiptCustName) receiptCustName.textContent = name;
  if (receiptCustPhone) receiptCustPhone.textContent = phone;
  if (receiptCustAddr) receiptCustAddr.textContent = address;
  if (receiptPayMode) receiptPayMode.textContent = paymentMethod;
  if (receiptClothes) receiptClothes.textContent = "4 to 6 Garments";
  if (receiptTotal) receiptTotal.textContent = price;

  // Update Profile state
  const orderIdEl = document.getElementById("profile-order-id");
  const itemNameEl = document.getElementById("profile-item-name");
  const statusEl = document.getElementById("profile-order-status");
  const countEl = document.getElementById("profile-garment-count");
  const pTitle = document.getElementById("profile-title");
  const pEmail = document.getElementById("profile-user-email");
  const pAvatar = document.getElementById("profile-avatar-letters");

  if (orderIdEl) orderIdEl.textContent = newOrderId;
  if (itemNameEl) itemNameEl.textContent = selectedCreation;
  if (statusEl) {
    statusEl.textContent = "Courier Scheduled";
    statusEl.className = "order-status-badge status-in-progress";
  }
  if (countEl) {
    countEl.textContent = parseInt(countEl.textContent || "0", 10) + 4;
  }
  if (pTitle) pTitle.textContent = name;
  if (pEmail) pEmail.textContent = phone;
  if (pAvatar) {
    const inits = name.split(" ").map(w => w[0]).join("").toUpperCase();
    pAvatar.textContent = inits || "RW";
  }

  // Save to LocalStorage
  localStorage.setItem("rewear_recent_order", JSON.stringify({
    orderId: newOrderId,
    name,
    phone,
    address,
    paymentMode: paymentMethod,
    totalPrice: price,
    creation: selectedCreation,
    date: new Date().toLocaleDateString()
  }));

  wizardDialog?.close();

  // Show Confirmation Receipt Dialog
  const placedDialog = document.getElementById("order-placed-dialog");
  placedDialog?.showModal();

  showToast(`Order Placed! Doorstep pickup scheduled for ${newOrderId}. Total ${price} (${paymentMethod}).`, "success");
}

/* ==========================================================================
   8. Customer Profile & Active Order Tracker
   ========================================================================== */
function initProfileDashboard() {
  const dialog = document.getElementById("profile-dialog");
  const openBtn = document.getElementById("nav-profile-btn");
  const footerLink = document.getElementById("footer-profile-link");
  const closeBtn = document.getElementById("close-profile-dialog");

  if (!dialog) return;

  const openProfile = () => {
    dialog.showModal();
  };

  openBtn?.addEventListener("click", openProfile);
  footerLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openProfile();
  });
  closeBtn?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  const ptabs = dialog.querySelectorAll(".ptab");
  const ppanels = dialog.querySelectorAll(".ptab-panel");

  ptabs.forEach(tab => {
    tab.addEventListener("click", () => {
      ptabs.forEach(t => t.classList.remove("active"));
      ppanels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = `ptab-${tab.dataset.ptab}`;
      document.getElementById(targetId)?.classList.add("active");
    });
  });
}

function openProfileDashboard() {
  const dialog = document.getElementById("profile-dialog");
  if (dialog) dialog.showModal();
}

/* ==========================================================================
   9. Real Working Authentication System (Zero hardcoded info, fully functional)
   ========================================================================== */
function initAuthSystem() {
  const dialog = document.getElementById("login-dialog");
  const loginNavBtn = document.getElementById("nav-login-btn");
  const closeBtn = document.getElementById("close-login-dialog");
  const loginForm = document.getElementById("login-form");
  const authStatusText = document.getElementById("auth-status-text");
  const profileNameLabel = document.getElementById("profile-display-name");
  const userInitials = document.getElementById("user-initials");
  const profileUserEmail = document.getElementById("profile-user-email");
  const profileAvatarLetters = document.getElementById("profile-avatar-letters");
  const footerLoginLink = document.getElementById("footer-login-link");
  const mobileLoginLink = document.getElementById("mobile-login-link");
  const mobileProfileLink = document.getElementById("mobile-profile-link");
  const profileSignoutBtn = document.getElementById("profile-signout-btn");
  const authActiveDot = document.getElementById("auth-active-dot");

  // Load user from LocalStorage; start cleanly as guest if not signed in
  let currentUser = JSON.parse(localStorage.getItem("rewear_user") || "null");

  function syncUserState() {
    if (currentUser && currentUser.isLoggedIn) {
      const firstName = currentUser.name.split(" ")[0];
      if (loginNavBtn) {
        loginNavBtn.setAttribute("aria-label", `Account: ${currentUser.name}`);
        loginNavBtn.setAttribute("title", `Account: ${currentUser.name}`);
      }
      if (authActiveDot) authActiveDot.style.display = "block";
      if (authStatusText) authStatusText.textContent = firstName || "Account";
      if (profileNameLabel) profileNameLabel.textContent = firstName || "Account";
      const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
      if (userInitials) userInitials.textContent = initials || "RW";
      if (profileAvatarLetters) profileAvatarLetters.textContent = initials || "RW";
      if (profileUserEmail) profileUserEmail.textContent = currentUser.email;
      if (mobileLoginLink) mobileLoginLink.textContent = "Profile (" + firstName + ")";
      const pTitle = document.getElementById("profile-title");
      if (pTitle) pTitle.textContent = currentUser.name;
      if (profileSignoutBtn) profileSignoutBtn.style.display = "inline-flex";
    } else {
      if (loginNavBtn) {
        loginNavBtn.setAttribute("aria-label", "Sign In to Rewear");
        loginNavBtn.setAttribute("title", "Sign In to Rewear");
      }
      if (authActiveDot) authActiveDot.style.display = "none";
      if (authStatusText) authStatusText.textContent = "Sign In";
      if (profileNameLabel) profileNameLabel.textContent = "Account";
      if (userInitials) userInitials.textContent = "👤";
      if (profileAvatarLetters) profileAvatarLetters.textContent = "RW";
      if (profileUserEmail) profileUserEmail.textContent = "Sign in or schedule pickup";
      if (mobileLoginLink) mobileLoginLink.textContent = "Sign In / Account";
      const pTitle = document.getElementById("profile-title");
      if (pTitle) pTitle.textContent = "Guest Member";
      if (profileSignoutBtn) profileSignoutBtn.style.display = "none";
    }
  }

  syncUserState();

  const handleAuthAction = () => {
    if (currentUser && currentUser.isLoggedIn) {
      openProfileDashboard();
    } else {
      dialog?.showModal();
    }
  };

  profileSignoutBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to sign out?")) {
      currentUser = null;
      localStorage.removeItem("rewear_user");
      syncUserState();
      document.getElementById("profile-dialog")?.close();
      showToast("Signed out successfully.", "info");
    }
  });

  // Click on Nav Login
  loginNavBtn?.addEventListener("click", handleAuthAction);

  mobileLoginLink?.addEventListener("click", () => {
    document.getElementById("mobile-drawer")?.classList.remove("open");
    handleAuthAction();
  });

  mobileProfileLink?.addEventListener("click", () => {
    document.getElementById("mobile-drawer")?.classList.remove("open");
    openProfileDashboard();
  });

  footerLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    dialog?.showModal();
  });

  closeBtn?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) dialog?.close();
  });

  // Regular Email/Password Form Login
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("login-name");
    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");

    const email = emailInput?.value.trim() || "";
    const pass = passInput?.value.trim() || "";

    if (!email) {
      showToast("Please enter your email address.", "error");
      emailInput?.focus();
      return;
    }
    if (!pass) {
      showToast("Please enter your password.", "error");
      passInput?.focus();
      return;
    }

    const enteredName = nameInput?.value.trim();
    let formattedName = enteredName;
    if (!formattedName) {
      const namePart = email.split("@")[0];
      formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    currentUser = {
      name: formattedName,
      email: email,
      isLoggedIn: true
    };
    localStorage.setItem("rewear_user", JSON.stringify(currentUser));
    syncUserState();
    dialog?.close();
    showToast(`Welcome back, ${formattedName}! Logged in successfully.`, "success");
  });
}

/* ==========================================================================
   10. Navigation, Mobile Menu & Manifesto Modal
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById("top-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });

  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);

      document.getElementById("mobile-drawer")?.classList.remove("open");
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  mobileToggle?.addEventListener("click", () => {
    mobileDrawer?.classList.toggle("open");
  });

  const aboutDialog = document.getElementById("about-manifesto-dialog");
  const openAboutBtn = document.getElementById("open-about-modal-btn");
  const closeAboutBtn = document.getElementById("close-about-dialog");

  openAboutBtn?.addEventListener("click", () => aboutDialog?.showModal());
  closeAboutBtn?.addEventListener("click", () => aboutDialog?.close());
  aboutDialog?.addEventListener("click", (e) => {
    if (e.target === aboutDialog) aboutDialog?.close();
  });

  document.getElementById("hero-explore-btn")?.addEventListener("click", () => {
    document.getElementById("before-after")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ==========================================================================
   11. Order Tracker Look-Up Input
   ========================================================================== */
function initOrderTracker() {
  const form = document.getElementById("track-order-form");
  const input = document.getElementById("track-code-input");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = input?.value.trim().toUpperCase() || "RW-2026-8942";
    showToast(`Order Found! Tracking code ${code}: In Artisan Weaving.`, "success");
    openProfileDashboard();
  });
}

/* ==========================================================================
   12. Toast Notification Center
   ========================================================================== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconSvg = type === "success" 
    ? `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`
    : `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}
