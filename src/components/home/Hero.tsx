import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../../hooks/useLanguage';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t, language } = useLanguage();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track mouse coordinates for subtle parallax interactive shifts
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    // Light sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x1B7FE8, 15, 60);
    pointLight1.position.set(15, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0099A8, 12, 60);
    pointLight2.position.set(-15, -10, 10);
    scene.add(pointLight2);

    const goldLight = new THREE.PointLight(0xC9A227, 4, 30);
    goldLight.position.set(0, 5, -5);
    scene.add(goldLight);

    // Floating Geometries
    const geometries = [
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
      new THREE.TorusGeometry(1.8, 0.6, 16, 100),
      new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16),
      new THREE.OctahedronGeometry(2)
    ];

    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: 0x1B7FE8,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        flatShading: true
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x0099A8,
        roughness: 0.2,
        metalness: 0.9,
        transmission: 0.4,
        thickness: 1.5,
        clearcoat: 0.8
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xC9A227,
        roughness: 0.1,
        metalness: 0.95,
        clearcoat: 1.0
      })
    ];

    const meshes: {
      mesh: THREE.Mesh;
      baseY: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      radiusRange: number;
      angleSpeed: number;
      angle: number;
    }[] = [];

    // Instantiate 3D geometric meshes
    const meshCount = 8;
    for (let i = 0; i < meshCount; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);
      
      const angle = (i / meshCount) * Math.PI * 2;
      const radiusRange = 10 + Math.random() * 8;
      
      mesh.position.x = Math.cos(angle) * radiusRange;
      mesh.position.y = (Math.random() - 0.5) * 12;
      mesh.position.z = (Math.random() - 0.5) * 10;
      
      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);
      
      scene.add(mesh);
      meshes.push({
        mesh,
        baseY: mesh.position.y,
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        speedZ: (Math.random() - 0.5) * 0.005,
        radiusRange,
        angleSpeed: 0.001 + Math.random() * 0.002,
        angle
      });
    }

    // Dynamic 3D Drifting Star Particle System
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;     // X
      positions[i + 1] = (Math.random() - 0.5) * 30; // Y
      positions[i + 2] = (Math.random() - 0.5) * 20; // Z
      particleSpeeds[i/3] = 0.02 + Math.random() * 0.05;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture creation using Canvas
    const createCircleTexture = () => {
      const matCanvas = document.createElement('canvas');
      matCanvas.width = 16;
      matCanvas.height = 16;
      const ctx = matCanvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(27, 127, 232, 0.6)');
        gradient.addColorStop(1, 'rgba(13, 27, 62, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(matCanvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.6,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interactive event listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic Refitting on container resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      width = entry.contentRect.width || container.clientWidth;
      height = entry.contentRect.height || container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    resizeObserver.observe(container);

    // Physics Update Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow orbital drift
      meshes.forEach((item) => {
        item.angle += item.angleSpeed;
        item.mesh.position.x = Math.cos(item.angle) * item.radiusRange;
        item.mesh.position.y = item.baseY + Math.sin(elapsedTime * 0.5 + item.angle) * 1.5;
        
        // Rotational spins
        item.mesh.rotation.x += 0.005;
        item.mesh.rotation.y += 0.006;
        item.mesh.rotation.z += 0.002;
      });

      // Slowly drift particle field
      const positionAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const array = positionAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] -= particleSpeeds[i] * 0.1; // slide downwards
        if (array[i * 3 + 1] < -15) {
          array[i * 3 + 1] = 15; // wrap around top
        }
      }
      positionAttr.needsUpdate = true;

      // Apply subtle interactive camera shifts
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Memory Allocation Cleanups
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      
      // Dispose Geometries & Materials
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={canvasContainerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a1228] pt-12 md:pt-0 border-b border-brand-blue/10"
    >
      {/* Three.js Canvas Backdrop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-80"
      />

      {/* Decorative Vector Islamic Mesh overlay */}
      <div className="absolute inset-0 islamic-grid-premium z-0 pointer-events-none" />

      {/* Radiant Glow Lights */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-brand-blue/15 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-brand-teal/10 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }} />

      {/* Ambient gradient top-bottom veil */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-navy via-brand-navy/30 to-transparent pointer-events-none" />

      {/* Center Hero Information */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center mt-8 md:mt-0">
        
        {/* Dynamic Partner Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(27,127,232,0.15)]"
        >
          <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
          <span className="text-[10px] md:text-xs font-black tracking-widest text-brand-light uppercase font-sans">
            {t('hero.established')}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green border border-green-300" />
          <span className="text-[10px] md:text-xs font-bold text-green-400">
            {t('hero.visionBadge')}
          </span>
        </motion.div>

        {/* Catchpoint Display Titles */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight ${
              language === 'ar' ? 'font-cairo' : 'font-sans'
            }`}
          >
            <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              {t('hero.titleStrong')}
            </span>
            <br />
            <span className="text-brand-blue bg-gradient-to-r from-brand-blue via-brand-teal to-brand-gold bg-clip-text text-transparent">
              {t('hero.titleNormal')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>
        </div>

        {/* CTA Interlocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <button
            id="hero-cta-start"
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-teal hover:to-brand-blue shadow-xl shadow-brand-blue/20 hover:shadow-brand-teal/30 hover:scale-[1.04] transition-all border border-brand-teal/25 cursor-pointer"
          >
            {t('hero.ctaStart')}
          </button>
          
          <button
            id="hero-cta-services"
            onClick={() => onNavigate('services')}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide text-gray-200 bg-brand-navy/60 hover:bg-brand-blue/15 border border-brand-blue/25 hover:border-brand-teal cursor-pointer backdrop-blur-sm transition-all"
          >
            {t('hero.ctaServices')}
          </button>
        </motion.div>

        {/* Slow Animated Scroll Down Indicator Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-6 inset-x-0 mx-auto flex flex-col items-center gap-1.5 cursor-pointer w-fit z-20"
          onClick={() => onNavigate('services')}
        >
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
            {t('hero.scroll')}
          </span>
          <ChevronDown className="w-4 h-4 text-brand-blue" />
        </motion.div>

      </div>
    </section>
  );
}
