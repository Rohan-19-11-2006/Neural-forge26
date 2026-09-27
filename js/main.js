/**
 * NEURAL FORGE 2026 - MAIN JAVASCRIPT CONTROLLER
 * SRM TRP Engineering College • Code Crafters Club
 * 
 * Features:
 * - WebGL Procedural Circuit Background Animation with Interactive Mouse Coordinates
 * - Real-Time Sprint Countdown Engine
 * - Mobile Navigation Drawer & Keyboard Accessibility
 * - Tracks Domain Filter & Expandable Specialization Accordions
 * - Registration Form Validator, Local Storage Persistence & Receipt Modal Generator
 */

(function () {
  'use strict';

  /* ===================================================================
     1. LIVING COSMIC BACKGROUND ENGINE:
        - 3D-Shaded Moving Rocks & Asteroids (Floating, Tumbling, Parallax)
        - Episodic Green Thunderstorm Lightning ("Come and Goes")
        - Cloud Sheet Lightning & Background Bloom Synchronization
     =================================================================== */
  function initMovingBackground() {
    const dustContainers = document.querySelectorAll('.ambient-dust-container');
    const canvas = document.getElementById('cosmic-fx-canvas');

    // 1. Ambient Floating Luminous Energy Dust Motes
    dustContainers.forEach((container) => {
      if (container.children.length > 0) return;
      const dustCount = 24;
      for (let i = 0; i < dustCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-dust-particle';
        const size = Math.random() * 3.5 + 1.5;
        const left = Math.random() * 100;
        const duration = Math.random() * 14 + 10;
        const delay = Math.random() * 16;
        const opacity = Math.random() * 0.55 + 0.25;

        particle.style.width = `${size.toFixed(1)}px`;
        particle.style.height = `${size.toFixed(1)}px`;
        particle.style.left = `${left.toFixed(1)}%`;
        particle.style.animationDuration = `${duration.toFixed(1)}s`;
        particle.style.animationDelay = `-${delay.toFixed(1)}s`;
        particle.style.opacity = opacity.toFixed(2);

        const rand = Math.random();
        if (rand < 0.55) {
          particle.style.boxShadow = '0 0 8px rgba(74, 222, 128, 0.95)';
        } else if (rand < 0.85) {
          particle.style.boxShadow = '0 0 8px rgba(163, 230, 53, 0.9)';
        } else {
          particle.style.boxShadow = '0 0 7px rgba(251, 191, 36, 0.85)';
        }

        container.appendChild(particle);
      }
    });

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Smooth Interactive Mouse Parallax
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : width / 2);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : height / 2);
      targetParallaxX = ((clientX / width) - 0.5) * 35;
      targetParallaxY = ((clientY / height) - 0.5) * 22;
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    /* ===============================================================
       A. PROCEDURAL 3D-SHADED MOVING ROCKS & ASTEROIDS
       =============================================================== */
    class AsteroidRock {
      constructor(isForeground = false, zone = null) {
        this.reset(isForeground, true, zone);
      }

      reset(isForeground, initial = false, zone = null) {
        this.isForeground = isForeground;
        // z-depth: 1.0 (nearest foreground) down to 0.2 (distant asteroid belt)
        this.z = isForeground ? (0.75 + Math.random() * 0.25) : (0.2 + Math.random() * 0.5);
        this.radius = isForeground ? (Math.random() * 38 + 52) : (Math.random() * 22 + 10);

        // Positioning: distribute naturally across screen edges and cosmic nebula
        if (initial) {
          if (zone === 'top-left') {
            this.x = width * (Math.random() * 0.22 + 0.02);
            this.y = height * (Math.random() * 0.28 + 0.05);
          } else if (zone === 'bottom-left') {
            this.x = width * (Math.random() * 0.25 + 0.02);
            this.y = height * (Math.random() * 0.35 + 0.62);
          } else if (zone === 'top-right') {
            this.x = width * (Math.random() * 0.24 + 0.74);
            this.y = height * (Math.random() * 0.3 + 0.05);
          } else if (zone === 'bottom-right') {
            this.x = width * (Math.random() * 0.25 + 0.72);
            this.y = height * (Math.random() * 0.35 + 0.62);
          } else if (zone === 'mid-left') {
            this.x = width * (Math.random() * 0.28 + 0.08);
            this.y = height * (Math.random() * 0.35 + 0.32);
          } else if (zone === 'mid-right') {
            this.x = width * (Math.random() * 0.28 + 0.64);
            this.y = height * (Math.random() * 0.35 + 0.32);
          } else {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
          }
        } else {
          this.x = Math.random() < 0.5 ? -this.radius * 2 : width + this.radius * 2;
          this.y = Math.random() * height;
        }

        // Zero-gravity slow drift velocity
        const speed = (0.08 + Math.random() * 0.25) * (this.z * 0.8 + 0.4);
        const driftAngle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(driftAngle) * speed;
        this.vy = Math.sin(driftAngle) * speed;

        // Multi-axis rotation (tumbling effect)
        this.angle = Math.random() * Math.PI * 2;
        this.vAngle = (Math.random() - 0.5) * 0.005;
        this.tumbleX = Math.random() * Math.PI;
        this.vTumbleX = (Math.random() - 0.5) * 0.004;
        this.tumbleY = Math.random() * Math.PI;
        this.vTumbleY = (Math.random() - 0.5) * 0.004;

        // Harmonic zero-g floating bobbing
        this.bobPhase = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.0008 + Math.random() * 0.0014;
        this.bobAmp = 6 + Math.random() * 14 * this.z;

        // Generate jagged polygonal facets with craters and crevices
        this.numVertices = Math.floor(Math.random() * 5) + 11;
        this.baseVertices = [];
        this.craters = [];

        for (let i = 0; i < this.numVertices; i++) {
          const theta = (i / this.numVertices) * Math.PI * 2;
          const jitter = 0.72 + Math.random() * 0.48;
          this.baseVertices.push({
            rad: jitter,
            theta: theta
          });
        }

        // Internal facets for realistic 3D chiseled rock shading
        this.facets = [];
        for (let i = 0; i < this.numVertices; i++) {
          const next = (i + 1) % this.numVertices;
          const shade = 14 + Math.floor(Math.random() * 18);
          const greenTint = Math.floor(shade * 0.25);
          this.facets.push({
            i1: i,
            i2: next,
            baseColor: `rgb(${shade}, ${shade + greenTint}, ${shade + Math.floor(greenTint * 0.5)})`,
            normalOffset: (Math.random() - 0.5) * 0.6
          });
        }

        // Craters on larger rocks
        if (this.radius > 28) {
          const numCraters = Math.floor(Math.random() * 3) + 1;
          for (let c = 0; c < numCraters; c++) {
            this.craters.push({
              rDist: Math.random() * 0.55,
              rAngle: Math.random() * Math.PI * 2,
              cRadius: (Math.random() * 0.2 + 0.1) * this.radius
            });
          }
        }
      }

      update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.angle += this.vAngle * dt;
        this.tumbleX += this.vTumbleX * dt;
        this.tumbleY += this.vTumbleY * dt;
        this.bobPhase += this.bobSpeed * dt;

        const padding = this.radius * 2.5;
        if (this.x < -padding) this.x = width + padding;
        else if (this.x > width + padding) this.x = -padding;
        if (this.y < -padding) this.y = height + padding;
        else if (this.y > height + padding) this.y = -padding;
      }

      draw(ctx, thunderFlash, thunderOriginX, thunderOriginY) {
        const px = this.x + currentParallaxX * this.z;
        const py = this.y + currentParallaxY * this.z + Math.sin(this.bobPhase) * this.bobAmp;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(this.angle);

        // 3D tumble scaling projection
        const scaleX = Math.cos(this.tumbleX) * 0.35 + 0.65;
        const scaleY = Math.cos(this.tumbleY) * 0.35 + 0.65;
        ctx.scale(scaleX, scaleY);

        const points = [];
        for (let i = 0; i < this.numVertices; i++) {
          const v = this.baseVertices[i];
          const r = this.radius * v.rad;
          points.push({
            x: Math.cos(v.theta) * r,
            y: Math.sin(v.theta) * r
          });
        }

        // Direction to lightning strike for dynamic specular flash
        const dx = (thunderOriginX || width / 2) - px;
        const dy = (thunderOriginY || height / 2) - py;
        const angleToThunder = Math.atan2(dy, dx) - this.angle;

        // Draw rock facets
        for (let f = 0; f < this.facets.length; f++) {
          const facet = this.facets[f];
          const p1 = points[facet.i1];
          const p2 = points[facet.i2];

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const faceAngle = Math.atan2(midY, midX);

          const alignment = Math.max(0, Math.cos(faceAngle - angleToThunder));
          const thunderShine = alignment * thunderFlash;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();

          if (thunderShine > 0.08) {
            const glowGreen = Math.min(255, Math.floor(45 + thunderShine * 190));
            const glowEmerald = Math.min(255, Math.floor(30 + thunderShine * 225));
            const glowWhite = Math.min(255, Math.floor(20 + thunderShine * 230));
            ctx.fillStyle = `rgb(${Math.floor(glowWhite * 0.6)}, ${glowEmerald}, ${Math.floor(glowGreen * 0.7)})`;
          } else {
            ctx.fillStyle = facet.baseColor;
          }
          ctx.fill();

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw craters
        for (let c = 0; c < this.craters.length; c++) {
          const cr = this.craters[c];
          const cx = Math.cos(cr.rAngle) * this.radius * cr.rDist;
          const cy = Math.sin(cr.rAngle) * this.radius * cr.rDist;

          ctx.beginPath();
          ctx.arc(cx, cy, cr.cRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(5, 8, 6, 0.75)';
          ctx.fill();

          ctx.strokeStyle = thunderFlash > 0.2 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Outer silhouette rim glow
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        if (thunderFlash > 0.12) {
          ctx.strokeStyle = `rgba(134, 239, 172, ${(thunderFlash * 0.95).toFixed(2)})`;
          ctx.lineWidth = 1.8 + thunderFlash * 1.5;
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 12 * thunderFlash;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.18)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // Populate Asteroids
    const rocks = [];
    rocks.push(new AsteroidRock(true, 'top-left'));
    rocks.push(new AsteroidRock(true, 'bottom-left'));
    rocks.push(new AsteroidRock(true, 'top-right'));
    rocks.push(new AsteroidRock(true, 'bottom-right'));

    const midZones = ['mid-left', 'mid-right', 'top-left', 'bottom-left', 'top-right', 'bottom-right'];
    for (let i = 0; i < 10; i++) {
      rocks.push(new AsteroidRock(false, midZones[i % midZones.length]));
    }

    for (let i = 0; i < 14; i++) {
      const rock = new AsteroidRock(false, null);
      rock.radius = Math.random() * 8 + 4;
      rocks.push(rock);
    }

    /* ===============================================================
       B. EPISODIC GREEN THUNDERSTORM LIGHTNING ENGINE ("Come and Goes")
       =============================================================== */
    let thunderState = 'calm';
    let calmTimer = Math.random() * 3000 + 3500; // 3.5s to 6.5s calm anticipation
    let thunderFlash = 0; // Current intensity 0.0 to 1.0
    let strikeOrigin = { x: width * 0.25, y: height * 0.15 };
    let strikeTarget = { x: width * 0.35, y: height * 0.85 };
    let activeBolts = [];
    const activeSparks = [];

    // Realistic Multi-Stroke Lightning Keyframes: [timeMs, targetIntensity]
    const strikeFlickerPattern = [
      [0, 1.0],      // Initial blinding return stroke
      [40, 0.2],     // Fast decay
      [85, 0.95],    // Secondary return stroke
      [145, 0.35],   // Decay
      [210, 0.72],   // Third stroke
      [290, 0.25],   // Decay
      [360, 0.50],   // Micro-pulse
      [450, 0.12],   // Linger glow
      [580, 0.0]     // Return to darkness
    ];
    let strikeStartTime = 0;

    // Recursive Midpoint Displacement Fractal Lightning Bolt Generator
    function createLightningBranch(x1, y1, x2, y2, depth, maxDepth, branchProb = 0.35) {
      const segments = [];
      const dist = Math.hypot(x2 - x1, y2 - y1);

      if (dist < 14 || depth >= maxDepth) {
        return [{ x1, y1, x2, y2, depth }];
      }

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
      const displacement = (Math.random() - 0.5) * dist * 0.42;

      const newMidX = midX + Math.cos(angle) * displacement;
      const newMidY = midY + Math.sin(angle) * displacement;

      segments.push(...createLightningBranch(x1, y1, newMidX, newMidY, depth + 1, maxDepth, branchProb));
      segments.push(...createLightningBranch(newMidX, newMidY, x2, y2, depth + 1, maxDepth, branchProb));

      if (depth < maxDepth - 1 && Math.random() < branchProb) {
        const branchAngle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 0.9;
        const branchLen = dist * (0.35 + Math.random() * 0.4);
        const bx = newMidX + Math.cos(branchAngle) * branchLen;
        const by = newMidY + Math.sin(branchAngle) * branchLen;
        segments.push(...createLightningBranch(newMidX, newMidY, bx, by, depth + 1, maxDepth, 0.15));
      }

      return segments;
    }

    function triggerLightningStrike(forcedType = null) {
      const strikeTypes = ['left-nebula', 'right-rift', 'top-cross', 'coronal-core'];
      const chosenType = forcedType || strikeTypes[Math.floor(Math.random() * strikeTypes.length)];

      if (chosenType === 'left-nebula') {
        strikeOrigin = { x: width * (0.08 + Math.random() * 0.18), y: height * (0.05 + Math.random() * 0.15) };
        strikeTarget = { x: width * (0.18 + Math.random() * 0.22), y: height * (0.75 + Math.random() * 0.2) };
      } else if (chosenType === 'right-rift') {
        strikeOrigin = { x: width * (0.78 + Math.random() * 0.18), y: height * (0.06 + Math.random() * 0.15) };
        strikeTarget = { x: width * (0.65 + Math.random() * 0.2), y: height * (0.72 + Math.random() * 0.2) };
      } else if (chosenType === 'top-cross') {
        strikeOrigin = { x: width * (0.15 + Math.random() * 0.25), y: height * (0.1 + Math.random() * 0.1) };
        strikeTarget = { x: width * (0.65 + Math.random() * 0.25), y: height * (0.15 + Math.random() * 0.2) };
      } else {
        strikeOrigin = { x: width * 0.5 + (Math.random() - 0.5) * 60, y: height * 0.05 };
        strikeTarget = { x: width * 0.5 + (Math.random() - 0.5) * 80, y: height * 0.65 };
      }

      activeBolts = createLightningBranch(strikeOrigin.x, strikeOrigin.y, strikeTarget.x, strikeTarget.y, 0, 5, 0.38);

      for (let s = 0; s < 18; s++) {
        const seg = activeBolts[Math.floor(Math.random() * activeBolts.length)];
        activeSparks.push({
          x: seg.x2,
          y: seg.y2,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 0.3 + Math.random() * 0.4,
          maxLife: 0.7,
          color: Math.random() < 0.65 ? '#4ade80' : '#ffffff'
        });
      }

      thunderState = 'strike';
      strikeStartTime = performance.now();
      thunderFlash = 1.0;

      document.documentElement.style.setProperty('--flash-x', `${((strikeOrigin.x / width) * 100).toFixed(1)}%`);
      document.documentElement.style.setProperty('--flash-y', `${((strikeOrigin.y / height) * 100).toFixed(1)}%`);
    }

    // Expose global manual trigger for testing / dock button
    window.triggerThunderstormStrike = function () {
      triggerLightningStrike();
    };

    let lastTime = performance.now();
    let isRunning = true;

    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) lastTime = performance.now();
    });

    function renderLoop(now) {
      if (!isRunning) {
        requestAnimationFrame(renderLoop);
        return;
      }

      const dt = Math.min((now - lastTime) / 16.666, 3.0);
      lastTime = now;

      // Smooth mouse parallax lerp
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;
      document.documentElement.style.setProperty('--bg-parallax-x', `${currentParallaxX.toFixed(2)}px`);
      document.documentElement.style.setProperty('--bg-parallax-y', `${currentParallaxY.toFixed(2)}px`);

      // Thunderstorm state machine update
      if (thunderState === 'calm') {
        calmTimer -= dt * 16.666;
        thunderFlash = 0;
        if (calmTimer <= 0) {
          if (Math.random() < 0.28) {
            thunderState = 'pre-rumble';
            calmTimer = 350 + Math.random() * 250;
          } else {
            triggerLightningStrike();
          }
        }
      } else if (thunderState === 'pre-rumble') {
        calmTimer -= dt * 16.666;
        thunderFlash = Math.sin((1 - Math.max(0, calmTimer) / 500) * Math.PI) * 0.32;
        if (calmTimer <= 0) {
          triggerLightningStrike();
        }
      } else if (thunderState === 'strike') {
        const elapsed = now - strikeStartTime;
        let fVal = 0;
        if (elapsed >= strikeFlickerPattern[strikeFlickerPattern.length - 1][0]) {
          fVal = 0;
          thunderState = 'calm';
          calmTimer = Math.random() * 3200 + 3800; // Next strike in 3.8s to 7.0s
          activeBolts = [];
        } else {
          for (let k = 0; k < strikeFlickerPattern.length - 1; k++) {
            const [tA, vA] = strikeFlickerPattern[k];
            const [tB, vB] = strikeFlickerPattern[k + 1];
            if (elapsed >= tA && elapsed <= tB) {
              const prog = (elapsed - tA) / (tB - tA);
              fVal = vA + (vB - vA) * prog;
              break;
            }
          }
        }
        thunderFlash = Math.max(0, Math.min(1.0, fVal));
      }

      // Synchronize CSS custom properties with thunder flash
      document.documentElement.style.setProperty('--thunder-bloom-opacity', (thunderFlash * 0.95).toFixed(3));
      document.documentElement.style.setProperty('--thunder-ambient-flash', (thunderFlash * 0.42).toFixed(3));

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Active Thunderstorm Lightning Bolts
      if (activeBolts.length > 0 && thunderFlash > 0.05) {
        ctx.save();
        // Layer 1: Ambient Plasma Green Glow Corona
        ctx.strokeStyle = `rgba(34, 197, 94, ${(thunderFlash * 0.45).toFixed(2)})`;
        ctx.lineWidth = 16 * thunderFlash;
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 30 * thunderFlash;
        ctx.beginPath();
        for (let b = 0; b < activeBolts.length; b++) {
          const seg = activeBolts[b];
          if (seg.depth <= 2) {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
        }
        ctx.stroke();

        // Layer 2: Emerald Ionization Arc Channel
        ctx.strokeStyle = `rgba(74, 222, 128, ${(thunderFlash * 0.85).toFixed(2)})`;
        ctx.lineWidth = Math.max(2, 6 * thunderFlash);
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 15 * thunderFlash;
        ctx.beginPath();
        for (let b = 0; b < activeBolts.length; b++) {
          const seg = activeBolts[b];
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Layer 3: Blinding White-Hot Electric Core
        ctx.strokeStyle = `rgba(255, 255, 255, ${(thunderFlash * 0.95).toFixed(2)})`;
        ctx.lineWidth = Math.max(1, 2.2 * thunderFlash);
        ctx.shadowBlur = 0;
        ctx.beginPath();
        for (let b = 0; b < activeBolts.length; b++) {
          const seg = activeBolts[b];
          if (seg.depth <= 3) {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw & Update Electrical Spark Particles
      for (let s = activeSparks.length - 1; s >= 0; s--) {
        const sp = activeSparks[s];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.life -= (dt * 16.666) / 1000;
        if (sp.life <= 0) {
          activeSparks.splice(s, 1);
          continue;
        }
        const alpha = Math.max(0, sp.life / sp.maxLife);
        ctx.fillStyle = sp.color === '#ffffff' ? `rgba(255, 255, 255, ${alpha})` : `rgba(74, 222, 128, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.8 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & Draw Moving Asteroids / Space Rocks
      for (let r = 0; r < rocks.length; r++) {
        const rock = rocks[r];
        rock.update(dt);
        rock.draw(ctx, thunderFlash, strikeOrigin.x, strikeOrigin.y);
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }


  /* ===================================================================
     2. SPRINT COUNTDOWN TIMER ENGINE
     =================================================================== */
  function initCountdownTimer() {
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');

    if (!elDays || !elHours || !elMins || !elSecs) return;

    // Official Neural Forge '26 Kickoff Date & Time:
    // October 15, 2026 at 09:00:00 AM IST (UTC+05:30)
    // 5th Floor Seminar Hall, SRM TRP Engineering College
    const kickoffTarget = new Date('2026-10-15T09:00:00+05:30').getTime();

    // Clear any stale cached values
    try {
      localStorage.removeItem('nf_sprint_target');
    } catch (e) {}

    function update() {
      const now = Date.now();
      const diff = Math.max(0, kickoffTarget - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      elDays.textContent = String(d).padStart(2, '0');
      elHours.textContent = String(h).padStart(2, '0');
      elMins.textContent = String(m).padStart(2, '0');
      elSecs.textContent = String(s).padStart(2, '0');
    }

    setInterval(update, 1000);
    update();
  }

  /* ===================================================================
     3. NAVIGATION DRAWER & DIALOGS
     =================================================================== */
  function initNavigation() {
    const menuBtn = document.getElementById('menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    function openDrawer() {
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Close mobile drawer when clicking anchor links
    document.querySelectorAll('.drawer-link[href*="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    /* ===================================================================
       BULLETPROOF ACTIVE LINK INDICATOR & SCROLL SPY
       Ensures: ONLY the currently active section or page glows!
       =================================================================== */
    const navLinks = document.querySelectorAll(
      '.desktop-nav a[data-path], .mobile-drawer a[data-path], .bottom-nav a[data-path]'
    );

    function setActiveNav(activeKey) {
      if (!activeKey) return;
      navLinks.forEach((link) => {
        const path = link.getAttribute('data-path');
        if (path === activeKey) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Determine current page
    const rawPath = window.location.pathname.toLowerCase();
    const pageName = rawPath.split('/').pop() || 'index.html';

    // 1. Dedicated Multi-Page Routes: Keep ONLY that page's button active
    if (pageName === 'schedule.html') {
      setActiveNav('schedule');
      return;
    } else if (pageName === 'tracks.html') {
      setActiveNav('tracks');
      return;
    } else if (pageName === 'about.html') {
      setActiveNav('about');
      return;
    } else if (pageName === 'register.html') {
      setActiveNav('register');
      return;
    }

    // 2. Single-Page Portal on index.html: Section Scroll Spy & Click Handling
    const sectionIds = ['home', 'prizes', 'tracks', 'schedule', 'about'];
    const sectionElements = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((item) => item.el !== null);

    let isUserClicking = false;
    let clickTimeout = null;

    // A. Immediate instant active state when user clicks any in-page link
    document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
      anchor.addEventListener('click', () => {
        const href = anchor.getAttribute('href') || '';
        const hash = href.includes('#') ? href.split('#')[1] : '';
        if (hash && sectionIds.includes(hash)) {
          isUserClicking = true;
          clearTimeout(clickTimeout);
          setActiveNav(hash);

          // If on mobile drawer, ensure it closes
          closeDrawer();

          // Smooth scroll to target and re-enable scroll spy after scroll lands
          clickTimeout = setTimeout(() => {
            isUserClicking = false;
            updateScrollSpy();
          }, 900);
        }
      });
    });

    // B. High-Precision Scroll Position Spy
    function updateScrollSpy() {
      if (isUserClicking) return;
      if (sectionElements.length === 0) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Special case: At the very top of the page (Hero/Home)
      if (scrollY < 120) {
        setActiveNav('home');
        return;
      }

      // Special case: Scrolled to the very bottom of the page (About Us)
      if (scrollY + windowHeight >= documentHeight - 60) {
        setActiveNav(sectionElements[sectionElements.length - 1].id);
        return;
      }

      // Check which section occupies the viewport reading line (header height + buffer ~ 160px)
      const scanLine = 160; // px from top of viewport
      let currentActiveId = null;

      for (let i = 0; i < sectionElements.length; i++) {
        const item = sectionElements[i];
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= scanLine && rect.bottom > scanLine) {
          currentActiveId = item.id;
          break;
        }
      }

      // Fallback: If no section directly straddles scanLine, find the section closest above it
      if (!currentActiveId) {
        let closestDist = -Infinity;
        sectionElements.forEach((item) => {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= scanLine && rect.top > closestDist) {
            closestDist = rect.top;
            currentActiveId = item.id;
          }
        });
      }

      if (currentActiveId) {
        setActiveNav(currentActiveId);
      }
    }

    // Attach passive scroll and resize listeners
    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    window.addEventListener('resize', updateScrollSpy, { passive: true });

    // C. Initial check on page load (support direct url hash like #schedule)
    const initialHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    if (initialHash && sectionIds.includes(initialHash)) {
      setActiveNav(initialHash);
      setTimeout(() => {
        const target = document.getElementById(initialHash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      updateScrollSpy();
    }
  }

  /* ===================================================================
     4. TRACKS DOMAIN FILTER & ACCORDIONS
  /* ===================================================================
     4. TRACKS 3D FLIP CARDS & REAL-TIME SEARCH FILTER CONTROLLER
     =================================================================== */
  window.toggleTrackCard = function (card) {
    if (!card) return;
    card.classList.toggle('is-flipped');
  };

  // Backwards compatibility for any accordion callers
  window.toggleTrackSpec = function (trackId) {
    const card = document.getElementById(trackId)?.closest('.track-flip-card');
    if (card) window.toggleTrackCard(card);
  };

  function initTracksFilter() {
    const tabs = document.querySelectorAll('.tab-btn[data-filter]');
    const cards = document.querySelectorAll('.track-flip-card');
    const searchInput = document.getElementById('track-search-input');
    const noResults = document.getElementById('tracks-no-results');

    // If flip cards are present
    if (cards.length > 0) {
      let activeFilter = 'all';
      let searchQuery = '';

      // Click to flip interaction & Keyboard Accessibility
      cards.forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          window.toggleTrackCard(card);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.toggleTrackCard(card);
          }
        });
      });

      function applyFilterAndSearch() {
        let visibleCount = 0;
        cards.forEach((card) => {
          const category = card.getAttribute('data-category') || '';
          const title = (card.getAttribute('data-title') || '').toLowerCase();
          const tags = (card.getAttribute('data-tags') || '').toLowerCase();
          const desc = card.textContent.toLowerCase();

          const matchesCategory = activeFilter === 'all' || category === activeFilter;
          const matchesSearch = !searchQuery || title.includes(searchQuery) || tags.includes(searchQuery) || desc.includes(searchQuery);

          if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
          } else {
            card.style.display = 'none';
            card.classList.remove('is-flipped');
          }
        });

        if (noResults) {
          noResults.classList.toggle('visible', visibleCount === 0);
        }
      }

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          activeFilter = tab.getAttribute('data-filter') || 'all';
          applyFilterAndSearch();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim().toLowerCase();
          applyFilterAndSearch();
        });
      }
    } else {
      // Legacy fallback for classic track-cards if present
      const legacyCards = document.querySelectorAll('.track-card[data-category]');
      if (!tabs.length || !legacyCards.length) return;

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.getAttribute('data-filter');
          legacyCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  }

  /* ===================================================================
     5. REGISTRATION FORM CONTROLLER
     =================================================================== */
  function initRegistrationForm() {
    const form = document.getElementById('hackathon-reg-form');
    const modal = document.getElementById('receipt-modal');
    const closeReceiptBtn = document.getElementById('close-receipt-btn');
    const printReceiptBtn = document.getElementById('print-receipt-btn');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const teamName = (document.getElementById('teamName') || {}).value || 'Alpha Squad';
      const track = (document.getElementById('trackSelect') || {}).value || 'Track 01';
      const leaderName = (document.getElementById('leaderName') || {}).value || 'Team Lead';
      const leaderEmail = (document.getElementById('leaderEmail') || {}).value || '';
      const leaderPhone = (document.getElementById('leaderPhone') || {}).value || '';
      const leaderDept = (document.getElementById('leaderDept') || {}).value || 'CSE';
      const leaderYear = (document.getElementById('leaderYear') || {}).value || 'III Year';
      const member2 = (document.getElementById('member2') || {}).value || '';
      const member3 = (document.getElementById('member3') || {}).value || '';
      const member4 = (document.getElementById('member4') || {}).value || '';
      const ideaPitch = (document.getElementById('ideaPitch') || {}).value || '';

      const regId = 'NF26-' + Math.floor(1000 + Math.random() * 9000);
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      const record = {
        regId,
        teamName,
        track,
        leaderName,
        leaderEmail,
        leaderPhone,
        leaderDept,
        leaderYear,
        members: [member2, member3, member4].filter(Boolean),
        ideaPitch,
        registeredAt: timestamp
      };

      // Save record in localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('nf_registrations') || '[]');
        saved.push(record);
        localStorage.setItem('nf_registrations', JSON.stringify(saved));
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Populate Receipt Modal
      const elReceiptId = document.getElementById('rcpt-id');
      const elReceiptTeam = document.getElementById('rcpt-team');
      const elReceiptTrack = document.getElementById('rcpt-track');
      const elReceiptLead = document.getElementById('rcpt-lead');
      const elReceiptTime = document.getElementById('rcpt-time');

      if (elReceiptId) elReceiptId.textContent = regId;
      if (elReceiptTeam) elReceiptTeam.textContent = teamName;
      if (elReceiptTrack) elReceiptTrack.textContent = track;
      if (elReceiptLead) elReceiptLead.textContent = leaderName + ' (' + leaderDept + ' - ' + leaderYear + ')';
      if (elReceiptTime) elReceiptTime.textContent = timestamp + ' IST';

      if (modal) {
        modal.classList.add('active');
      }
    });

    if (closeReceiptBtn && modal) {
      closeReceiptBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        form.reset();
      });
    }

    if (printReceiptBtn) {
      printReceiptBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* ===================================================================
     6. LIQUID GLASS INTERACTIVE SPECULAR & CURSOR REFRACTION
     =================================================================== */
  function initLiquidGlassEffects() {
    const glassElements = document.querySelectorAll(
      '.glass-liquid, .glass-card, .countdown-card, .metric-card, .track-card, .btn-primary, .btn-secondary'
    );

    // Track mouse position across all liquid glass cards for interactive glare
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      glassElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.bottom >= -50 &&
          rect.top <= window.innerHeight + 50 &&
          rect.right >= -50 &&
          rect.left <= window.innerWidth + 50
        ) {
          const posX = ((mouseX - rect.left) / rect.width) * 100;
          const posY = ((mouseY - rect.top) / rect.height) * 100;
          el.style.setProperty('--mouse-x', `${posX.toFixed(1)}%`);
          el.style.setProperty('--mouse-y', `${posY.toFixed(1)}%`);
        }
      });
    }, { passive: true });
  }

  /* ===================================================================
     7. INTERACTIVE TOUCH & CLICK CYBER ENERGY EFFECTS
     =================================================================== */
  function initInteractiveTouchEffects() {
    if (window._cyberTouchInitialized) return;
    window._cyberTouchInitialized = true;

    let container = document.querySelector('.cyber-touch-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cyber-touch-container';
      document.body.appendChild(container);
    }

    const sparkColors = ['#4ade80', '#a3e635', '#22c55e', '#ffffff', '#fbbf24'];

    function spawnTouchEffect(x, y) {
      if (!container) return;

      // 1. Shockwave Ripple Ring
      const ring = document.createElement('div');
      ring.className = 'cyber-touch-ring';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      container.appendChild(ring);

      // 2. Central Core Flash
      const core = document.createElement('div');
      core.className = 'cyber-touch-core';
      core.style.left = `${x}px`;
      core.style.top = `${y}px`;
      container.appendChild(core);

      // 3. Cyber Sparks Burst (8 particles)
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'cyber-touch-spark';
        const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        spark.style.color = color;
        spark.style.backgroundColor = color;
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 30 + Math.random() * 55;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const duration = 0.45 + Math.random() * 0.25;

        spark.style.setProperty('--tx', `${tx.toFixed(1)}px`);
        spark.style.setProperty('--ty', `${ty.toFixed(1)}px`);
        spark.style.setProperty('--spark-duration', `${duration.toFixed(2)}s`);

        container.appendChild(spark);

        setTimeout(() => {
          spark.remove();
        }, duration * 1000 + 50);
      }

      setTimeout(() => {
        ring.remove();
        core.remove();
      }, 700);
    }

    let lastSpawn = 0;
    window.addEventListener('pointerdown', (e) => {
      const now = performance.now();
      if (now - lastSpawn < 30) return;
      lastSpawn = now;
      spawnTouchEffect(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* ===================================================================
     8. INTERACTIVE CURSOR MOVEMENT ANIMATION & TRAILING ENERGY DUST
     =================================================================== */
  function initCursorMovementAnimation() {
    // Only on pointer-fine devices (mouse/stylus), disabled on touch
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window._cursorEffectInitialized) return;
    window._cursorEffectInitialized = true;

    // 1. Glowing Follower Reticle
    let cursorGlow = document.querySelector('.cyber-cursor-glow');
    if (!cursorGlow) {
      cursorGlow = document.createElement('div');
      cursorGlow.className = 'cyber-cursor-glow';
      document.body.appendChild(cursorGlow);
    }

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let glowX = cursorX;
    let glowY = cursorY;
    let lastParticleTime = 0;

    const particleColors = [
      'rgba(74, 222, 128, 0.95)',
      'rgba(163, 230, 53, 0.95)',
      'rgba(34, 197, 94, 0.9)',
      'rgba(251, 191, 36, 0.85)',
      'rgba(255, 255, 255, 0.95)'
    ];

    window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorGlow.style.opacity = '1';

      // Spawn trailing cosmic particle stream
      const now = performance.now();
      if (now - lastParticleTime > 26) {
        lastParticleTime = now;
        spawnCursorParticle(cursorX, cursorY);
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    // Detect hover over interactive targets
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, input, textarea, .countdown-tile, .track-card, .btn-primary, .btn-secondary, .badge-pill, .timeline-tab-btn, .bg-motion-btn');
      cursorGlow.classList.toggle('is-hovering', !!interactive);
    }, { passive: true });

    function spawnCursorParticle(x, y) {
      const particle = document.createElement('div');
      particle.className = 'cursor-stream-particle';
      const size = Math.random() * 5 + 3;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];

      particle.style.width = `${size.toFixed(1)}px`;
      particle.style.height = `${size.toFixed(1)}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 10px ${color}`;

      // Jitter / drift
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 24 + 10;
      const vx = Math.cos(angle) * dist;
      const vy = Math.sin(angle) * dist;
      const life = (Math.random() * 0.3 + 0.35).toFixed(2);

      particle.style.setProperty('--vx', `${vx.toFixed(1)}px`);
      particle.style.setProperty('--vy', `${vy.toFixed(1)}px`);
      particle.style.setProperty('--life', `${life}s`);

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, parseFloat(life) * 1000 + 40);
    }

    // Smooth Lerp loop for reticle
    function renderCursor() {
      glowX += (cursorX - glowX) * 0.24;
      glowY += (cursorY - glowY) * 0.24;
      cursorGlow.style.left = `${glowX.toFixed(1)}px`;
      cursorGlow.style.top = `${glowY.toFixed(1)}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  /* ===================================================================
     9. BACKGROUND MOTION ENGINE (DISABLED PER USER REQUEST - COMPLETELY STATIC)
     =================================================================== */
  if (window._motionCycleTimer) {
    clearTimeout(window._motionCycleTimer);
  }

  window.setBgMotionPreset = function (presetId) {
    const bgLayers = document.querySelectorAll('.moving-bg-layer');
    const bloomLayers = document.querySelectorAll('.thunderstorm-bloom-layer');
    const allLayers = [...bgLayers, ...bloomLayers];
    const presets = ['orbit', 'warp', 'pulse', 'drift', 'scanner'];

    allLayers.forEach((layer) => {
      presets.forEach((p) => layer.classList.remove(`motion-${p}`));
      if (presetId && presetId !== 'default') {
        layer.classList.add(`motion-${presetId}`);
      }
    });
  };

  /* ===================================================================
     FAQ ACCORDION CONTROLLER
     Interactive expand/collapse toggling with smooth CSS grid animation
     =================================================================== */
  function initFaqAccordion() {
    const faqCards = document.querySelectorAll('.faq-card');
    if (!faqCards.length) return;

    faqCards.forEach((card) => {
      const btn = card.querySelector('.faq-question-btn');
      if (!btn) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyActive = card.classList.contains('active');

        // Close other cards for clean single-accordion behavior (matching reference image)
        faqCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove('active');
            const otherBtn = otherCard.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked card state
        if (isCurrentlyActive) {
          card.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          card.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ===================================================================
     EVENT COORDINATORS INTERACTIVE SHOWCASE CONTROLLER
     Synchronizes hover & touch feedback between group photo hotspots & cards
     =================================================================== */
  function initCoordinatorsShowcase() {
    const showcases = document.querySelectorAll('.event-coordinators-showcase');
    if (!showcases.length) return;

    showcases.forEach((showcase) => {
      const hotspots = showcase.querySelectorAll('.coord-hotspot');
      const cards = showcase.querySelectorAll('.coord-card');

      function setHighlight(personId, active) {
        hotspots.forEach((h) => {
          if (h.getAttribute('data-person') === personId) {
            h.classList.toggle('is-touched', active);
          }
        });
        cards.forEach((c) => {
          if (c.getAttribute('data-person') === personId) {
            c.classList.toggle('is-active', active);
          }
        });
      }

      hotspots.forEach((h) => {
        const pid = h.getAttribute('data-person');
        h.addEventListener('mouseenter', () => setHighlight(pid, true));
        h.addEventListener('mouseleave', () => setHighlight(pid, false));
        h.addEventListener('focus', () => setHighlight(pid, true));
        h.addEventListener('blur', () => setHighlight(pid, false));
      });

      cards.forEach((c) => {
        const pid = c.getAttribute('data-person');
        c.addEventListener('mouseenter', () => setHighlight(pid, true));
        c.addEventListener('mouseleave', () => setHighlight(pid, false));
        c.addEventListener('focus', () => setHighlight(pid, true));
        c.addEventListener('blur', () => setHighlight(pid, false));
      });
    });
  }

  /* ===================================================================
     INITIALIZE ON DOM CONTENT LOADED
     =================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initMovingBackground();
    initLiquidGlassEffects();
    initCountdownTimer();
    initNavigation();
    initTracksFilter();
    initRegistrationForm();
    initInteractiveTouchEffects();
    initCursorMovementAnimation();
    initFaqAccordion();
    initCoordinatorsShowcase();
  });

  /* ===================================================================
     TIMELINE DAY FILTER CONTROLLER
     =================================================================== */
  window.filterTimeline = function (day) {
    const rows = document.querySelectorAll('.cyber-timeline-row');
    const dividers = document.querySelectorAll('.timeline-day-divider');
    const buttons = document.querySelectorAll('.timeline-tab-btn');

    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === day);
    });

    rows.forEach((row) => {
      const rowDay = row.getAttribute('data-day');
      if (day === 'all' || rowDay === day) {
        row.classList.remove('is-hidden');
      } else {
        row.classList.add('is-hidden');
      }
    });

    dividers.forEach((divider) => {
      const divDay = divider.getAttribute('data-day');
      if (day === 'all' || divDay === day) {
        divider.classList.remove('is-hidden');
      } else {
        divider.classList.add('is-hidden');
      }
    });
  };

  /* ===================================================================
     RULEBOOK DOCUMENT MODAL CONTROLLER
     =================================================================== */
  window.openRulebookModal = function (tabKey) {
    const modal = document.getElementById('rulebook-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (tabKey) window.switchRulebookTab(tabKey);
  };

  window.closeRulebookModal = function () {
    const modal = document.getElementById('rulebook-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.switchRulebookTab = function (tabId) {
    const tabBtns = document.querySelectorAll('.rulebook-tab-btn');
    const sections = document.querySelectorAll('.rulebook-section-block');

    tabBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    sections.forEach((sec) => {
      if (tabId === 'all' || sec.getAttribute('data-tab') === tabId) {
        sec.style.display = 'flex';
      } else {
        sec.style.display = 'none';
      }
    });
  };

  /* ===================================================================
     OFFICIAL POSTER LIGHTBOX CONTROLLER (Hanging Eye Charm)
     =================================================================== */
  window.openPosterLightbox = function () {
    let modal = document.getElementById('poster-lightbox-modal');
    if (!modal) {
      // Dynamic self-healing injection: guarantees poster modal works on ANY page
      modal = document.createElement('div');
      modal.id = 'poster-lightbox-modal';
      modal.className = 'modal-overlay';
      modal.onclick = function (e) {
        if (e.target === this) window.closePosterLightbox();
      };
      modal.innerHTML = `
        <div class="poster-modal-card" role="dialog" aria-label="Official Event Poster">
          <div class="poster-modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); display: flex; align-items: center; justify-content: center; color: #38bdf8; font-size: 18px;">
                🧿
              </div>
              <div>
                <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; color: #f8fafc; letter-spacing: 0.04em;">
                  NEURAL FORGE '26 OFFICIAL POSTER
                </div>
                <div class="mono-label" style="font-size: 0.6875rem; color: #4ade80;">SRM TRP ENGINEERING COLLEGE • OCT 15-16, 2026</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <a href="assets/official_poster_v2.jpg" download="neural_forge_26_official_poster.jpg" class="btn-primary" style="padding: 7px 14px; font-size: 0.78rem; gap: 4px;">
                <span class="material-symbols-outlined text-[16px]">download</span>
                <span>Download</span>
              </a>
              <a href="assets/official_poster_v2.jpg" target="_blank" class="nav-cta-btn" style="padding: 7px 12px; font-size: 0.78rem; gap: 4px; background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.18); color: #cbd5e1;" title="Open full resolution in new tab">
                <span class="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
              <button type="button" class="track-unflip-btn" onclick="window.closePosterLightbox();" title="Close Poster">
                <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
              </button>
            </div>
          </div>
          <div class="poster-modal-body">
            <img src="assets/official_poster_v2.jpg" alt="Neural Forge '26 Hackathon Official Poster" class="poster-modal-img" />
          </div>
          <div class="poster-modal-footer">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--secondary); text-align: center;">
              DEPARTMENT OF CSE • CODE CRAFTERS CLUB • 5TH FLOOR SEMINAR HALL • REGISTRATION DEADLINE: 04.10.2026 • REGISTRATION FEE: ₹150
            </span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else if (modal.parentElement !== document.body) {
      // Ensure modal is ALWAYS mounted directly on document.body, never nested
      document.body.appendChild(modal);
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  };

  window.closePosterLightbox = function () {
    const modal = document.getElementById('poster-lightbox-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
    modal.style.display = '';
    document.body.style.overflow = '';
  };

  /* ===================================================================
     REGISTRATION WINDOW & SLOT CONFIRMATION MODAL CONTROLLER
     =================================================================== */
  window.openRegistrationModal = function () {
    let modal = document.getElementById('registration-modal');
    if (!modal) {
      // Dynamic self-healing injection: guarantees registration modal works on ANY page
      modal = document.createElement('div');
      modal.id = 'registration-modal';
      modal.className = 'modal-overlay';
      modal.onclick = function (e) {
        if (e.target === this) window.closeRegistrationModal();
      };
      modal.innerHTML = `
        <div class="registration-modal-card" role="dialog" aria-label="Hackathon Registration Window">
          <div class="reg-modal-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(74, 222, 128, 0.15); border: 1.5px solid rgba(74, 222, 128, 0.45); display: flex; align-items: center; justify-content: center; color: #4ade80;">
                <span class="material-symbols-outlined" style="font-size: 22px;">how_to_reg</span>
              </div>
              <div>
                <h3 style="font-family: 'Orbitron', var(--font-display); font-size: 1.15rem; font-weight: 800; color: #f8fafc; margin: 0; letter-spacing: 0.02em;">
                  Registration Window
                </h3>
                <div class="mono-label" style="font-size: 0.7rem; color: #86efac; margin-top: 2px;">
                  NEURAL FORGE '26 • CSE DEPT SRM TRP
                </div>
              </div>
            </div>
            <button type="button" class="track-unflip-btn" onclick="window.closeRegistrationModal();" title="Close Dialog">
              <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
            </button>
          </div>

          <div class="reg-modal-body">
            <!-- Timeline Dates Box -->
            <div class="reg-dates-grid">
              <div class="reg-date-box start-box">
                <span class="reg-date-label">
                  <span class="material-symbols-outlined" style="font-size: 16px;">calendar_month</span>
                  REGISTRATION STARTS
                </span>
                <span class="reg-date-val">28 September 2026</span>
                <span class="reg-date-sub">Portal Opens • Early Verification</span>
              </div>

              <div class="reg-date-box end-box">
                <span class="reg-date-label">
                  <span class="material-symbols-outlined" style="font-size: 16px;">event_busy</span>
                  REGISTRATION ENDS
                </span>
                <span class="reg-date-val">4 October 2026</span>
                <span class="reg-date-sub">11:59 PM IST • Strict Cutoff</span>
              </div>
            </div>

            <!-- Urgent Slots Notice -->
            <div class="reg-slots-notice">
              <div class="reg-slots-badge">
                <span class="pulse-dot" style="width: 7px; height: 7px; background: #fbbf24;"></span>
                <span>LIMITED TEAM SLOTS • MAKE YOUR SLOTS</span>
              </div>
              <p class="reg-slots-text">
                <strong>Make your slots early!</strong> Registration starts from <strong>28 September 2026</strong> and registration ends on <strong>4 October 2026</strong>. Limited team slots are available on a first-come, first-served basis. Make your slots or reserve your team's spot now before registrations close!
              </p>
            </div>

            <!-- Actions: Register Now Opens Google Form -->
            <div class="reg-modal-actions">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdPUSn6Qpd585HlKsup8jDA4SXCDRuiGuTqHe-YNZMvdJEjgA/viewform?usp=publish-editor"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="reg-btn-submit"
                 id="reg-modal-gform-btn"
                 onclick="window.closeRegistrationModal();">
                <span>Register Now</span>
                <span class="material-symbols-outlined" style="font-size: 20px;">open_in_new</span>
              </a>
              <button type="button" class="reg-btn-dismiss" onclick="window.closeRegistrationModal();">
                Maybe later, close window
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  };

  window.closeRegistrationModal = function () {
    const modal = document.getElementById('registration-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
    modal.style.display = '';
    document.body.style.overflow = '';
  };

  // Close modals when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof window.closeRulebookModal === 'function') window.closeRulebookModal();
      if (typeof window.closePosterLightbox === 'function') window.closePosterLightbox();
      if (typeof window.closeRegistrationModal === 'function') window.closeRegistrationModal();
    }
  });

  // Global delegation ensuring clicks on ANY part of the eye talisman or stick always open the poster
  document.addEventListener('click', (e) => {
    const eyeTarget = e.target.closest(
      '.hanging-eye-rig, .eye-sway-assembly, .eye-mount-stick, .eye-charm-disc, .eye-img, .stick-svg, #hanging-eye-charm'
    );
    if (eyeTarget) {
      e.preventDefault();
      e.stopPropagation();
      window.openPosterLightbox();
      return;
    }

    // Global delegation: Clicks on any "Register Now" or registration CTA triggers the Registration Modal
    if (e.target.closest('#reg-modal-gform-btn')) {
      // Don't intercept: Allow direct navigation to the Google Form from inside the modal!
      return;
    }

    const regTarget = e.target.closest(
      '[data-action="open-registration"], .btn-register-trigger, [data-path="register"], a[href*="docs.google.com/forms"]'
    );
    if (regTarget) {
      e.preventDefault();
      e.stopPropagation();
      window.openRegistrationModal();
    }
  });

  // Ensure hanging eye rig exists on document body if missing on any page
  function ensureHangingEyeRig() {
    if (!document.getElementById('hanging-eye-charm') && !document.querySelector('.hanging-eye-rig')) {
      const rig = document.createElement('div');
      rig.className = 'hanging-eye-rig';
      rig.id = 'hanging-eye-charm';
      rig.setAttribute('role', 'button');
      rig.setAttribute('tabindex', '0');
      rig.setAttribute('aria-label', 'Open Official Poster');
      rig.onclick = function () { window.openPosterLightbox(); };
      rig.title = '🧿 Click to view Official Poster';
      rig.innerHTML = `
        <div class="eye-mount-stick" onclick="window.openPosterLightbox();" style="cursor: pointer;">
          <svg width="90" height="38" viewBox="0 0 90 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="stick-svg">
            <defs>
              <linearGradient id="stickWoodGradDyn" x1="0" y1="0" x2="82" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#3d1e06" />
                <stop offset="25%" stop-color="#78350f" />
                <stop offset="55%" stop-color="#b45309" />
                <stop offset="85%" stop-color="#d97706" />
                <stop offset="100%" stop-color="#92400e" />
              </linearGradient>
              <linearGradient id="knotGradDyn" x1="64" y1="6" x2="74" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fde68a" />
                <stop offset="50%" stop-color="#d97706" />
                <stop offset="100%" stop-color="#78350f" />
              </linearGradient>
              <filter id="stickShadowFilterDyn" x="-4" y="-4" width="100" height="46" filterUnits="userSpaceOnUse">
                <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.85"/>
              </filter>
            </defs>
            <path d="M-4 -4 L-2 12 L70 16 Q76 16 78 13 Q80 10 73 8 L-2 -4 Z" fill="url(#stickWoodGradDyn)" filter="url(#stickShadowFilterDyn)" />
            <line x1="22" y1="0" x2="24" y2="13" stroke="#451a03" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
            <line x1="24" y1="0" x2="26" y2="13" stroke="#fef08a" stroke-width="1" stroke-linecap="round" opacity="0.45"/>
            <line x1="48" y1="4" x2="50" y2="15" stroke="#451a03" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
            <line x1="50" y1="4" x2="52" y2="15" stroke="#fef08a" stroke-width="1" stroke-linecap="round" opacity="0.45"/>
            <rect x="63" y="8" width="9" height="9" rx="2" fill="url(#knotGradDyn)" stroke="#451a03" stroke-width="0.8" />
            <line x1="64" y1="9" x2="70" y2="15" stroke="#78350f" stroke-width="1" />
            <line x1="68" y1="9" x2="72" y2="14" stroke="#fde68a" stroke-width="0.9" />
            <circle cx="67.5" cy="18.5" r="2.5" fill="none" stroke="#fbbf24" stroke-width="1.2" />
          </svg>
        </div>
        <div class="eye-sway-assembly" onclick="window.openPosterLightbox();" style="cursor: pointer;">
          <div class="eye-thread"></div>
          <div class="eye-hook-ring"></div>
          <div class="eye-charm-disc" onclick="window.openPosterLightbox();" style="cursor: pointer;">
            <img src="assets/evil_eye_amulet.jpg" alt="Evil Eye Talisman" class="eye-img" />
            <div class="eye-glass-reflection"></div>
            <div class="eye-energy-pulse"></div>
          </div>
          <div class="eye-tassel-wrap">
            <div class="eye-gold-bead"></div>
            <div class="eye-tassel-fringes"></div>
          </div>
          <div class="eye-badge-tooltip">
            <span class="pulse-dot" style="width: 5px; height: 5px; background: #38bdf8;"></span>
            <span>Click for Poster</span>
          </div>
        </div>
      `;
      document.body.appendChild(rig);
    }
  }

  /* ===================================================================
     CINEMATIC OPENING INTRO VIDEO CONTROLLER (NEURAL FORGE '26)
     - Controls playback, audio toggle, skip intro, time tracking & ESC key
     - Provides window.playOpeningVideo(), window.closeOpeningVideo(), 
       window.toggleOpeningAudio(), window.seekOpeningVideo()
     =================================================================== */
  function formatVideoTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function ensureOpeningVideoOverlayMarkup() {
    let overlay = document.getElementById('opening-video-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'opening-video-overlay';
      overlay.className = 'opening-video-overlay';
      overlay.setAttribute('aria-label', 'Neural Forge Opening Video');
      overlay.innerHTML = `
        <div class="opening-video-ambient-glow"></div>
        <div class="opening-video-container" id="opening-video-wrapper" title="Click to Toggle Sound / Play">
          <video
            id="opening-video"
            class="opening-video-player"
            src="assets/opening_video.mp4"
            playsinline
            autoplay
            muted
            preload="auto">
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div class="opening-video-vignette"></div>
        <div class="opening-video-topbar">
          <div class="opening-brand-badge">
            <div class="opening-brand-logo-wrap">
              <img src="assets/code_crafters_logo.png" alt="Code Crafters Club" class="opening-brand-logo">
            </div>
            <div class="opening-brand-meta">
              <span class="opening-brand-title">NEURAL FORGE '26</span>
              <span class="opening-brand-tagline">OFFICIAL HACKATHON TEASER</span>
            </div>
          </div>
          <div class="opening-actions-group">
            <button type="button" id="opening-audio-btn" class="opening-hud-btn audio-btn" aria-label="Toggle Sound" onclick="window.toggleOpeningAudio();">
              <span class="material-symbols-outlined" id="opening-audio-icon" style="font-size: 18px;">volume_off</span>
              <span id="opening-audio-label">Sound Off</span>
            </button>
            <button type="button" id="opening-skip-btn" class="opening-hud-btn skip-btn" aria-label="Skip Intro Video" onclick="window.closeOpeningVideo();">
              <span>Skip Intro</span>
              <span class="material-symbols-outlined" style="font-size: 18px;">fast_forward</span>
              <kbd class="opening-key-hint">ESC</kbd>
            </button>
          </div>
        </div>
        <div class="opening-video-bottombar">
          <div class="opening-progress-track" id="opening-progress-track" onclick="window.seekOpeningVideo(event);" title="Click to scrub timeline">
            <div class="opening-progress-bar" id="opening-progress-bar"></div>
          </div>
          <div class="opening-status-row">
            <div class="opening-hint-text">
              <span class="pulse-dot" style="width: 6px; height: 6px; background: #4ade80;"></span>
              <span id="opening-hint-label">Click video or "Sound Off" to unmute audio</span>
            </div>
            <div class="opening-time-display">
              <span id="opening-time-current">0:00</span> / <span id="opening-time-duration">0:00</span>
            </div>
          </div>
        </div>
      `;
      document.body.prepend(overlay);
    }
    return overlay;
  }

  function initOpeningVideoEngine() {
    let overlay = document.getElementById('opening-video-overlay');
    if (!overlay) return;

    const video = document.getElementById('opening-video');
    const audioBtn = document.getElementById('opening-audio-btn');
    const audioIcon = document.getElementById('opening-audio-icon');
    const audioLabel = document.getElementById('opening-audio-label');
    const hintLabel = document.getElementById('opening-hint-label');
    const progressBar = document.getElementById('opening-progress-bar');
    const timeCurrent = document.getElementById('opening-time-current');
    const timeDuration = document.getElementById('opening-time-duration');
    const videoWrapper = document.getElementById('opening-video-wrapper');

    if (!video) return;

    function updateAudioUI(isMuted) {
      if (!audioBtn) return;
      if (isMuted) {
        audioBtn.classList.remove('unmuted');
        if (audioIcon) audioIcon.textContent = 'volume_off';
        if (audioLabel) audioLabel.textContent = 'Sound Off';
        if (hintLabel) hintLabel.textContent = 'Click video or "Sound Off" to unmute audio';
      } else {
        audioBtn.classList.add('unmuted');
        if (audioIcon) audioIcon.textContent = 'volume_up';
        if (audioLabel) audioLabel.textContent = 'Sound On';
        if (hintLabel) hintLabel.textContent = 'Audio active • Enjoy the teaser';
      }
    }

    window.toggleOpeningAudio = function () {
      const vid = document.getElementById('opening-video');
      if (!vid) return;
      vid.muted = !vid.muted;
      updateAudioUI(vid.muted);
    };

    window.seekOpeningVideo = function (e) {
      const vid = document.getElementById('opening-video');
      if (!vid || !vid.duration) return;
      const track = document.getElementById('opening-progress-track');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      vid.currentTime = clickPos * vid.duration;
    };

    window.closeOpeningVideo = function () {
      const targetOverlay = document.getElementById('opening-video-overlay');
      if (!targetOverlay) return;
      targetOverlay.classList.add('closing');
      document.body.style.overflow = '';

      try {
        sessionStorage.setItem('nf26_intro_played', 'true');
      } catch (err) {}

      setTimeout(() => {
        targetOverlay.classList.add('hidden');
        targetOverlay.classList.remove('closing');
        const vid = document.getElementById('opening-video');
        if (vid) {
          vid.pause();
          vid.currentTime = 0;
        }
      }, 750);
    };

    window.playOpeningVideo = function (withSound) {
      const targetOverlay = ensureOpeningVideoOverlayMarkup();
      const vid = document.getElementById('opening-video');
      if (!vid) return;

      targetOverlay.classList.remove('hidden', 'closing');
      document.body.style.overflow = 'hidden';
      vid.currentTime = 0;

      if (withSound) {
        vid.muted = false;
        updateAudioUI(false);
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay unmuted restriction fallback
            vid.muted = true;
            updateAudioUI(true);
            vid.play().catch(() => {});
          });
        }
      } else {
        vid.muted = true;
        updateAudioUI(true);
        vid.play().catch(() => {});
      }
    };

    // Video events
    video.addEventListener('loadedmetadata', () => {
      if (timeDuration) timeDuration.textContent = formatVideoTime(video.duration);
    });

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (timeCurrent) timeCurrent.textContent = formatVideoTime(video.currentTime);
      }
    });

    video.addEventListener('ended', () => {
      window.closeOpeningVideo();
    });

    // Clicking the video screen directly toggles audio or unmutes
    if (videoWrapper) {
      videoWrapper.addEventListener('click', (e) => {
        if (e.target.closest('.opening-video-topbar') || e.target.closest('.opening-video-bottombar')) return;
        window.toggleOpeningAudio();
      });
    }

    // Keyboard ESC, Space, and M key handling
    window.addEventListener('keydown', (e) => {
      const currentOverlay = document.getElementById('opening-video-overlay');
      if (!currentOverlay || currentOverlay.classList.contains('hidden') || currentOverlay.classList.contains('closing')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        window.closeOpeningVideo();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const vid = document.getElementById('opening-video');
        if (vid) {
          if (vid.paused) {
            vid.play();
          } else {
            vid.pause();
          }
        }
      } else if (e.key && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        window.toggleOpeningAudio();
      }
    });

    // Title Style Switcher
    window.switchTitleStyle = function (styleId) {
      const buttons = document.querySelectorAll('.style-choice-btn');
      const panels = document.querySelectorAll('.title-variant-panel');

      buttons.forEach(btn => {
        if (btn.getAttribute('data-style') === styleId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      panels.forEach(panel => {
        if (panel.id === `title-${styleId}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      try {
        localStorage.setItem('nf26_title_style', styleId);
      } catch (e) {}
    };

    function initTitleStyleSwitcher() {
      let savedStyle = 'style-2';
      try {
        const stored = localStorage.getItem('nf26_title_style');
        if (stored) savedStyle = stored;
      } catch (e) {}
      window.switchTitleStyle(savedStyle);
    }

    // Start video on page load
    document.body.style.overflow = 'hidden';
    const initialPlay = video.play();
    if (initialPlay !== undefined) {
      initialPlay.catch((err) => {
        console.log('Video autoplay initial wait:', err);
      });
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureHangingEyeRig();
      initOpeningVideoEngine();
      if (typeof window.switchTitleStyle === 'function') {
        const stored = localStorage.getItem('nf26_title_style') || 'style-2';
        window.switchTitleStyle(stored);
      }
    });
  } else {
    ensureHangingEyeRig();
    initOpeningVideoEngine();
    if (typeof window.switchTitleStyle === 'function') {
      const stored = localStorage.getItem('nf26_title_style') || 'style-2';
      window.switchTitleStyle(stored);
    }
  }
})();



