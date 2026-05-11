import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vTilt;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Continuous, almost imperceptible breathing motion
    pos.y += sin(uTime * 0.6 + pos.x * 1.5) * 0.004;

    vTilt = 0.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;
  varying float vTilt;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Chroma-key the studio white background to alpha
    float maxC = max(max(tex.r, tex.g), tex.b);
    float minC = min(min(tex.r, tex.g), tex.b);
    float sat = maxC - minC;
    float whiteness = maxC * (1.0 - sat * 4.0);
    float alpha = 1.0 - smoothstep(0.78, 0.97, whiteness);

    // Subtle warm tint to harmonize with parchment surroundings
    vec3 color = tex.rgb;
    color = mix(color, color * vec3(1.06, 1.0, 0.92), 0.35);

    // Sweep highlight that follows mouse — adds gilded sheen
    float sheen = smoothstep(0.18, 0.0, abs(uv.x - uMouse.x) + abs(uv.y - uMouse.y) * 0.3);
    color += vec3(0.18, 0.14, 0.06) * sheen * alpha;

    // Edge-tilt shading (depth illusion)
    color *= (1.0 - abs(vTilt) * 1.5);

    // Soft bottom contact-shadow gradient
    float shadow = smoothstep(0.0, 0.12, uv.y);
    color *= mix(0.85, 1.0, shadow);

    gl_FragColor = vec4(color, alpha);
  }
`;

interface ChairShowcaseProps {
  imageSrc?: string;
}

export default function ChairShowcase({ imageSrc = 'images/bonetti-1.jpg' }: ChairShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setCanvasReady(false);

    const rect0 = container.getBoundingClientRect();
    if (rect0.width < 2 || rect0.height < 2) return;

    const scene = new THREE.Scene();

    const cameraDistance = 5;
    const camera = new THREE.PerspectiveCamera(35, rect0.width / rect0.height, 0.1, 100);
    camera.position.z = cameraDistance;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(rect0.width, rect0.height);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(renderer.domElement);

    // ---------- Chair plane ----------
    const texLoader = new THREE.TextureLoader();
    const baseScale = { x: 2.2, y: 3 };
    const texture = texLoader.load(
      imageSrc,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        // Re-fit plane to texture aspect once it loads
        const aspect = (t.image && t.image.width) ? t.image.width / t.image.height : 0.7;
        const h = 3.0;
        baseScale.x = h * aspect;
        baseScale.y = h;
        planeMesh.scale.set(baseScale.x, baseScale.y, 1);
        // Allow the canvas to render a couple of frames before fading the fallback
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setCanvasReady(true));
        });
      },
      undefined,
      (err) => {
        // Texture missing — keep DOM fallback <img> visible (it'll also 404
        // if the file isn't there, but we still avoid hiding it)
        console.warn('[ChairShowcase] Could not load texture:', imageSrc, err);
      }
    );
    texture.anisotropy = 8;

    const planeGeom = new THREE.PlaneGeometry(1, 1, 60, 60);
    const planeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);
    planeMesh.scale.set(2.2, 3, 1);
    scene.add(planeMesh);

    // ---------- Floor contact shadow ----------
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(24, 12, 4, 0.45)');
    grad.addColorStop(0.55, 'rgba(24, 12, 4, 0.10)');
    grad.addColorStop(1, 'rgba(24, 12, 4, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.7), shadowMat);
    shadowMesh.position.set(0, -1.55, -0.05);
    scene.add(shadowMesh);

    // ---------- Gold dust particles ----------
    const PARTICLE_COUNT = 90;
    const pGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      speeds[i] = 0.0008 + Math.random() * 0.0018;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft circular sprite for dust
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 64;
    dustCanvas.height = 64;
    const dctx = dustCanvas.getContext('2d')!;
    const dgrad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    dgrad.addColorStop(0, 'rgba(168, 142, 113, 1)');
    dgrad.addColorStop(0.4, 'rgba(168, 142, 113, 0.4)');
    dgrad.addColorStop(1, 'rgba(168, 142, 113, 0)');
    dctx.fillStyle = dgrad;
    dctx.fillRect(0, 0, 64, 64);
    const dustTex = new THREE.CanvasTexture(dustCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      map: dustTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xc8b896,
      opacity: 0.85,
    });
    const points = new THREE.Points(pGeom, pMat);
    scene.add(points);

    // ---------- Mouse parallax ----------
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetMouseX = THREE.MathUtils.clamp((e.clientX - r.left) / r.width, 0, 1);
      targetMouseY = THREE.MathUtils.clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ---------- Render loop (no scroll-driven transforms; only ambient + mouse) ----------
    let raf = 0;
    const clock = new THREE.Clock();
    const mouseEased = { x: 0.5, y: 0.5 };

    const animate = () => {
      const t = clock.getElapsedTime();
      planeMat.uniforms.uTime.value = t;

      // Ease mouse for parallax
      mouseEased.x += (targetMouseX - mouseEased.x) * 0.06;
      mouseEased.y += (targetMouseY - mouseEased.y) * 0.06;
      planeMat.uniforms.uMouse.value.set(mouseEased.x, mouseEased.y);

      // Chair: gentle ambient breathing + subtle mouse parallax (no scroll-driven scale/rotation)
      planeMesh.rotation.y = (mouseEased.x - 0.5) * 0.10 + Math.sin(t * 0.3) * 0.012;
      planeMesh.rotation.x = -(mouseEased.y - 0.5) * 0.06 + Math.sin(t * 0.4) * 0.008;
      planeMesh.rotation.z = Math.sin(t * 0.28) * 0.005;

      planeMesh.scale.set(baseScale.x, baseScale.y, 1);
      planeMesh.position.x = (mouseEased.x - 0.5) * 0.06;
      planeMesh.position.y = Math.sin(t * 0.5) * 0.025;

      // Static-ish shadow that just tracks chair's tiny X drift
      shadowMesh.position.x = planeMesh.position.x;
      shadowMesh.position.y = -1.55;
      shadowMesh.scale.x = 1.0;
      shadowMesh.material.opacity = 0.78 - Math.abs(planeMesh.rotation.y) * 0.25;

      // Particles drift upward continuously (no scroll-tied intensity)
      const pos = pGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        pos[i * 3] += Math.sin(t * 0.5 + offsets[i]) * 0.0009;
        if (pos[i * 3 + 1] > 2.5) pos[i * 3 + 1] = -2.5;
      }
      pGeom.attributes.position.needsUpdate = true;
      points.rotation.y = (mouseEased.x - 0.5) * 0.15;

      // Subtle camera tilt
      camera.position.x = (mouseEased.x - 0.5) * 0.15;
      camera.position.y = (mouseEased.y - 0.5) * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // ---------- Resize ----------
    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      ro.disconnect();
      planeGeom.dispose();
      planeMat.dispose();
      texture.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      shadowMesh.geometry.dispose();
      pGeom.dispose();
      pMat.dispose();
      dustTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        // Radial spotlight backdrop to mimic studio photography
        background:
          'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(255, 248, 230, 0.55) 0%, rgba(240, 236, 215, 0) 70%)',
      }}
    >
      {/* DOM fallback — visible until WebGL canvas is ready, or if image is missing */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: '4%',
          opacity: canvasReady ? 0 : 1,
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          userSelect: 'none',
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
      />
    </div>
  );
}
