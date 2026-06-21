import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../../hooks/useLanguage';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';

export default function TechOrbit() {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Storing computed projected labels state for display overlays
  const [orbitingLabels, setOrbitingLabels] = useState<{
    name: string;
    x: number;
    y: number;
    z: number; // depth for styling overlays (opacity, scale)
    visible: boolean;
  }[]>([]);

  const technologies = [
    'Next.js',
    'Flutter',
    '.NET Core',
    'Firebase',
    'React',
    'OpenAI',
    'Power BI',
    'Adobe CC'
  ];

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

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
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 24;

    // Light sources
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const directLight = new THREE.DirectionalLight(0x1B7FE8, 2);
    directLight.position.set(5, 10, 5);
    scene.add(directLight);

    const blueLight = new THREE.PointLight(0x0099A8, 12, 30);
    blueLight.position.set(-10, -5, 5);
    scene.add(blueLight);

    // Central Globe Mesh (Beautiful multi-layered wireframe)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dynamic Solid core glow sphere
    const coreGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x011333,
      emissive: 0x1B7FE8,
      emissiveIntensity: 0.15,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // Outer wireframe mesh representing the digital grid
    const wireGeometry = new THREE.SphereGeometry(4, 18, 18);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x1B7FE8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    globeGroup.add(wireMesh);

    // Globe rings
    const ringGeometry = new THREE.RingGeometry(4.2, 4.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099A8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 2.5;
    globeGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh2.rotation.y = Math.PI / 3;
    globeGroup.add(ringMesh2);

    // Technology satellites
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Config orbit states
    const orbitRadius = 10;
    const satellites = technologies.map((name, index) => {
      // Stagger initial orbital azimuth points
      const theta = (index / technologies.length) * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.8; // tilt range
      
      const speed = 0.003 + (index % 3) * 0.001; // staggered speed
      
      // Pivot indicator helper node
      const nodeGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x0099A8 });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      satelliteGroup.add(nodeMesh);

      return {
        name,
        theta,
        phi,
        speed,
        mesh: nodeMesh
      };
    });

    // Vector variables used for projection tracking calculations
    const vector = new THREE.Vector3();

    // Resize container bindings
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate the Central Globe
      globeGroup.rotation.y += 0.002;
      globeGroup.rotation.x += 0.001;

      // Rotate rings opposite
      ringMesh1.rotation.z -= 0.003;
      ringMesh2.rotation.z += 0.003;

      // Project Orbit nodes
      const labelsData = satellites.map((sat) => {
        sat.theta += sat.speed;
        
        // Compute 3D coords based on spherical angles
        const x = orbitRadius * Math.cos(sat.theta) * Math.cos(sat.phi);
        const y = orbitRadius * Math.sin(sat.phi);
        const z = orbitRadius * Math.sin(sat.theta) * Math.cos(sat.phi);

        // Update Three node position helper
        sat.mesh.position.set(x, y, z);

        // Map 3D positions to 2D HTML coordinate percentages on viewport
        vector.set(x, y, z);
        
        // Project onto normalized clip space
        vector.project(camera);

        // Translate normalized coordinates to % multipliers
        const screenX = (vector.x * .5 + .5) * width;
        const screenY = (-(vector.y) * .5 + .5) * height;

        // Is the technology behind the core globe (depth test safety)
        const isBehind = z < -2;

        return {
          name: sat.name,
          x: screenX,
          y: screenY,
          z,
          visible: !isBehind,
        };
      });

      setOrbitingLabels(labelsData);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup geometries
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="tech-orbit" className="relative py-24 bg-[#080d1f] border-t border-brand-blue/10 overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full w-fit mx-auto text-xs text-brand-teal font-extrabold uppercase tracking-wide mb-3"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AAT Stack</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-extrabold text-white"
          >
            {t('techOrbit.heading')}
          </motion.h2>
        </div>

        {/* Orbit Visualization Container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl h-[400px] md:h-[500px] rounded-3xl border border-brand-blue/10 bg-brand-navy/20 backdrop-blur-sm overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Render Projected Orbiting Labels as HTML Overlays */}
          {orbitingLabels.map((label, idx) => {
            // Compute scaling and alpha opacity based on deep-mesh Z axis coordinate
            // Closer elements are larger, darker elements behind are faint/shrank
            const scale = 0.8 + ((label.z + 10) / 20) * 0.4;
            const opacity = 0.3 + ((label.z + 10) / 20) * 0.7;

            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
                style={{
                  left: `${label.x}px`,
                  top: `${label.y}px`,
                  zIndex: label.z > 0 ? 30 : 10,
                  opacity: opacity,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-blue/30 bg-[#0c142c]/90 text-white font-mono text-xs font-bold shadow-lg shadow-black/40 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                  <span>{label.name}</span>
                </div>
              </div>
            );
          })}
          
        </div>

      </div>
    </section>
  );
}
