import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { 
  ChevronDown, ChevronUp, RotateCw, Layers, Sparkles, Info, Play, Pause, 
  Zap, Compass, Dna, Heart, Sun, Box, Cpu, Tag, Plus, Check, X, Search, Lightbulb
} from 'lucide-react';

export type StemModelType = 
  | 'dna' 
  | 'heart' 
  | 'spectro' 
  | 'plant_cell' 
  | 'solar_system' 
  | 'ac_generator' 
  | 'crystal_lattice' 
  | 'convocation_tower'
  | 'bohr_atom'
  | 'voltaic_cell'
  | 'human_eye'
  | 'benzene_ring';

export interface ModelLabelPin {
  id: string;
  name: string;
  description: string;
  pos: THREE.Vector3;
  color?: string;
}

interface ThreeJsLabProps {
  onAskAI?: (topic: string) => void;
}

export const ThreeJsLab: React.FC<ThreeJsLabProps> = ({ onAskAI }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<StemModelType>('dna');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [materialFinish, setMaterialFinish] = useState<'pbr' | 'xray' | 'metallic'>('pbr');
  const [activeLayerInfo, setActiveLayerInfo] = useState<string>('Select components to inspect details');
  
  // 3D Scientific Labels & Annotations State
  const [showLabels, setShowLabels] = useState(true);
  const [selectedPin, setSelectedPin] = useState<ModelLabelPin | null>(null);
  const [projectedPins, setProjectedPins] = useState<Array<ModelLabelPin & { screenX: number; screenY: number; isVisible: boolean }>>([]);

  // Add More 3D Models Drawer / Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Mutable refs for Three.js render loop without stale closures
  const explodedAmountRef = useRef(explodedAmount);
  explodedAmountRef.current = explodedAmount;

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const animationSpeedRef = useRef(animationSpeed);
  animationSpeedRef.current = animationSpeed;

  const showLabelsRef = useRef(showLabels);
  showLabelsRef.current = showLabels;

  const currentPinsRef = useRef<ModelLabelPin[]>([]);

  // Scene references
  const sceneContextRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    currentGroup: THREE.Group | null;
    explodedMeshes: Array<{ mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }>;
    clock: THREE.Clock;
    isSoftwareGl: boolean;
    orbitingPlanets?: Array<{ pivot: THREE.Object3D; speed: number }>;
  } | null>(null);

  const _scratchVec = useRef(new THREE.Vector3());

  const STEM_MODELS: Array<{ id: StemModelType; label: string; icon: any; category: string; description: string }> = [
    { id: 'dna', label: 'DNA Double Helix', icon: Dna, category: 'Biology', description: 'Antiparallel strands with A-T & G-C complementary hydrogen bonding.' },
    { id: 'heart', label: 'Human Heart Anatomy', icon: Heart, category: 'Physiology', description: 'Four chambers, aorta arch, vena cava, and directional pulmonary circulation.' },
    { id: 'spectro', label: 'Spectrophotometer', icon: Zap, category: 'Chemistry Lab', description: 'Beer-Lambert absorbance instrument with cuvette chamber & detector.' },
    { id: 'plant_cell', label: 'Plant Cell Organelles', icon: Sparkles, category: 'Biology', description: 'Cellulose wall, chloroplasts, central vacuole, mitochondria, and nucleus.' },
    { id: 'solar_system', label: 'Solar Planetary Orbits', icon: Sun, category: 'Physics / Space', description: 'Heliocentric Keplerian mechanics with orbital speeds and radii.' },
    { id: 'ac_generator', label: 'AC Electric Generator', icon: Cpu, category: 'Physics / Engineering', description: 'Electromagnetic induction: armature coil, split rings, and N/S magnetic poles.' },
    { id: 'crystal_lattice', label: 'NaCl Crystal Lattice', icon: Box, category: 'Chemistry', description: 'Face-Centered Cubic (FCC) unit cell with alternating Na+ and Cl- ions.' },
    { id: 'convocation_tower', label: 'Convocation Rotunda', icon: Compass, category: 'Architecture / STEM', description: 'Classical Nigerian academic monument with tiered plinth and spire.' },
    { id: 'bohr_atom', label: 'Bohr Hydrogen Atom', icon: Sparkles, category: 'Quantum Physics', description: 'Proton nucleus with quantized electron shells (n=1,2,3) & energy jumps.' },
    { id: 'voltaic_cell', label: 'Voltaic Galvanic Cell', icon: Zap, category: 'Electrochemistry', description: 'Zinc anode, Copper cathode, salt bridge, and electron redox flow.' },
    { id: 'human_eye', label: 'Human Eye Optics', icon: Lightbulb, category: 'Optics / Biology', description: 'Cornea, crystalline lens, retina, and focal image convergence.' },
    { id: 'benzene_ring', label: 'Benzene Molecule (C6H6)', icon: Box, category: 'Organic Chemistry', description: 'Delocalized pi-electron resonance ring with sp2 hybrid carbon bonds.' },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.6, 9.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 22;
    controls.target.set(0, 1.2, 0);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.9);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.3);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070d19,
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(16, 16, 0x1e3a8a, 0x111827);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    const clock = new THREE.Clock();

    sceneContextRef.current = {
      renderer,
      scene,
      camera,
      controls,
      currentGroup: null,
      explodedMeshes: [],
      clock,
      isSoftwareGl,
      orbitingPlanets: []
    };

    // Animation & Render Loop reading from REFS
    let animId: number;
    let labelThrottle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      controls.update();

      const ctx = sceneContextRef.current;
      if (ctx && ctx.currentGroup) {
        if (isRotatingRef.current) {
          ctx.currentGroup.rotation.y += delta * 0.4 * animationSpeedRef.current;
        }

        if (ctx.orbitingPlanets && ctx.orbitingPlanets.length > 0) {
          ctx.orbitingPlanets.forEach(p => {
            p.pivot.rotation.y += delta * p.speed * animationSpeedRef.current;
          });
        }

        // Apply smooth exploded view displacement
        const curExp = explodedAmountRef.current;
        ctx.explodedMeshes.forEach(({ mesh, originalPos, explodeDir }) => {
          _scratchVec.current.copy(originalPos).addScaledVector(explodeDir, curExp);
          mesh.position.lerp(_scratchVec.current, 0.16);
        });

        // Project 3D Scientific Labels onto 2D viewport coordinates
        labelThrottle++;
        if (labelThrottle % 2 === 0 && showLabelsRef.current && currentPinsRef.current.length > 0) {
          const w = container.clientWidth || window.innerWidth;
          const h = container.clientHeight || window.innerHeight;
          const proj: Array<ModelLabelPin & { screenX: number; screenY: number; isVisible: boolean }> = [];

          currentPinsRef.current.forEach(pin => {
            const v = pin.pos.clone();
            // Account for group transformation
            v.applyMatrix4(ctx.currentGroup!.matrixWorld);
            v.project(camera);

            const isFront = v.z < 1.0;
            const screenX = ((v.x + 1) * w) / 2;
            const screenY = ((-v.y + 1) * h) / 2;

            proj.push({
              ...pin,
              screenX,
              screenY,
              isVisible: isFront && screenX >= 20 && screenX <= w - 20 && screenY >= 20 && screenY <= h - 20
            });
          });

          setProjectedPins(proj);
        } else if (!showLabelsRef.current) {
          setProjectedPins([]);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Build 3D Models with Anatomical Pins & Dissect Vectors
  const buildModel = (type: StemModelType, finish: string) => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;

    if (ctx.currentGroup) {
      ctx.scene.remove(ctx.currentGroup);
      ctx.currentGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
          else m.material?.dispose();
        }
      });
    }

    ctx.orbitingPlanets = [];
    const group = new THREE.Group();
    const explodedList: Array<{ mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }> = [];
    const pins: ModelLabelPin[] = [];

    const createMat = (colorHex: number, roughness = 0.35, metalness = 0.15, opacity = 1) => {
      if (finish === 'xray') {
        return new THREE.MeshPhysicalMaterial({
          color: colorHex,
          transmission: 0.88,
          opacity: 0.85,
          transparent: true,
          roughness: 0.1,
          ior: 1.45,
          side: THREE.DoubleSide
        });
      }
      if (finish === 'metallic') {
        return new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.15,
          metalness: 0.88,
          envMapIntensity: 1.5
        });
      }
      return new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness,
        metalness,
        transparent: opacity < 1,
        opacity
      });
    };

    // ==========================================
    // 1. DNA DOUBLE HELIX
    // ==========================================
    if (type === 'dna') {
      const strand1Group = new THREE.Group();
      const strand2Group = new THREE.Group();
      const basePairsGroup = new THREE.Group();

      const baseSphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const rungCylGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 12);
      rungCylGeo.rotateZ(Math.PI / 2);

      const matA = createMat(0xef4444); // Adenine (Red)
      const matT = createMat(0x3b82f6); // Thymine (Blue)
      const matG = createMat(0x22c55e); // Guanine (Green)
      const matC = createMat(0xf59e0b); // Cytosine (Amber)
      const backboneMat1 = createMat(0x60a5fa, 0.25, 0.3);
      const backboneMat2 = createMat(0xa855f7, 0.25, 0.3);

      const rungs = 30;
      const heightStep = 0.14;
      const radius = 1.1;

      for (let i = 0; i < rungs; i++) {
        const angle = i * 0.42;
        const y = i * heightStep - 0.7;

        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const sphere1 = new THREE.Mesh(baseSphereGeo, backboneMat1);
        sphere1.position.set(x1, y, z1);
        strand1Group.add(sphere1);

        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        const sphere2 = new THREE.Mesh(baseSphereGeo, backboneMat2);
        sphere2.position.set(x2, y, z2);
        strand2Group.add(sphere2);

        const rungMesh = new THREE.Mesh(rungCylGeo, i % 2 === 0 ? (i % 4 === 0 ? matA : matT) : (i % 4 === 1 ? matG : matC));
        rungMesh.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        rungMesh.scale.set(radius * 1.8, 1, 1);
        rungMesh.rotation.y = -angle;
        basePairsGroup.add(rungMesh);
      }

      group.add(strand1Group);
      group.add(strand2Group);
      group.add(basePairsGroup);

      explodedList.push({ mesh: strand1Group, originalPos: strand1Group.position.clone(), explodeDir: new THREE.Vector3(1.4, 0, 0) });
      explodedList.push({ mesh: strand2Group, originalPos: strand2Group.position.clone(), explodeDir: new THREE.Vector3(-1.4, 0, 0) });
      explodedList.push({ mesh: basePairsGroup, originalPos: basePairsGroup.position.clone(), explodeDir: new THREE.Vector3(0, 0, 1.2) });

      pins.push({
        id: 'dna-backbone',
        name: 'Sugar-Phosphate Backbone',
        description: 'Alternating deoxyribose sugar and phosphate units held by 3’-5’ phosphodiester linkages.',
        pos: new THREE.Vector3(1.1, 1.8, 0),
        color: '#60a5fa'
      });
      pins.push({
        id: 'dna-at-pair',
        name: 'Adenine-Thymine (A-T)',
        description: 'Purine-pyrimidine complementary base pair joined by 2 hydrogen bonds (denatures at lower temp than G-C).',
        pos: new THREE.Vector3(0, 1.2, 0),
        color: '#ef4444'
      });
      pins.push({
        id: 'dna-gc-pair',
        name: 'Guanine-Cytosine (G-C)',
        description: 'Purine-pyrimidine base pair joined by 3 strong hydrogen bonds, contributing to higher thermal stability.',
        pos: new THREE.Vector3(0, 0.4, 0),
        color: '#22c55e'
      });

      setActiveLayerInfo('B-DNA Double Helix: Antiparallel polynucleotide strands with complementary A-T and G-C base pairing.');
    }

    // ==========================================
    // 2. HUMAN HEART ANATOMY
    // ==========================================
    else if (type === 'heart') {
      const leftVentricleGeo = new THREE.SphereGeometry(0.85, 32, 24);
      leftVentricleGeo.scale(0.85, 1.2, 0.75);
      const lvMesh = new THREE.Mesh(leftVentricleGeo, createMat(0xdc2626, 0.4, 0.2));
      lvMesh.position.set(-0.35, 1.1, 0);
      group.add(lvMesh);

      const rightVentricleGeo = new THREE.SphereGeometry(0.75, 32, 24);
      rightVentricleGeo.scale(0.8, 1.05, 0.7);
      const rvMesh = new THREE.Mesh(rightVentricleGeo, createMat(0xb91c1c, 0.4, 0.2));
      rvMesh.position.set(0.45, 0.95, 0.1);
      group.add(rvMesh);

      const atriumGeo = new THREE.SphereGeometry(0.55, 24, 20);
      const laMesh = new THREE.Mesh(atriumGeo, createMat(0xef4444, 0.4, 0.15));
      laMesh.position.set(-0.5, 2.0, -0.1);
      group.add(laMesh);

      const raMesh = new THREE.Mesh(atriumGeo, createMat(0x2563eb, 0.4, 0.15));
      raMesh.position.set(0.55, 1.9, -0.05);
      group.add(raMesh);

      const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 1.8, 0),
        new THREE.Vector3(-0.2, 2.7, 0.1),
        new THREE.Vector3(0.3, 2.8, -0.1),
        new THREE.Vector3(0.5, 2.2, -0.3)
      ]);
      const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.22, 16, false);
      const aortaMesh = new THREE.Mesh(aortaGeo, createMat(0xe11d48, 0.3, 0.4));
      group.add(aortaMesh);

      const svcCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, 1.8, 0.1),
        new THREE.Vector3(0.55, 2.65, 0.1)
      ]);
      const svcGeo = new THREE.TubeGeometry(svcCurve, 12, 0.18, 16, false);
      const svcMesh = new THREE.Mesh(svcGeo, createMat(0x0284c7, 0.3, 0.4));
      group.add(svcMesh);

      explodedList.push({ mesh: lvMesh, originalPos: lvMesh.position.clone(), explodeDir: new THREE.Vector3(-0.9, -0.4, 0.6) });
      explodedList.push({ mesh: rvMesh, originalPos: rvMesh.position.clone(), explodeDir: new THREE.Vector3(0.9, -0.4, 0.6) });
      explodedList.push({ mesh: laMesh, originalPos: laMesh.position.clone(), explodeDir: new THREE.Vector3(-0.8, 0.8, -0.4) });
      explodedList.push({ mesh: raMesh, originalPos: raMesh.position.clone(), explodeDir: new THREE.Vector3(0.8, 0.8, -0.4) });
      explodedList.push({ mesh: aortaMesh, originalPos: aortaMesh.position.clone(), explodeDir: new THREE.Vector3(0, 1.3, 0) });
      explodedList.push({ mesh: svcMesh, originalPos: svcMesh.position.clone(), explodeDir: new THREE.Vector3(0.8, 0.9, 0) });

      pins.push({
        id: 'heart-aorta',
        name: 'Aorta Arch',
        description: 'Main arterial trunk pumping oxygenated blood to the entire systemic circulation at peak systolic pressure.',
        pos: new THREE.Vector3(0.1, 2.8, 0),
        color: '#e11d48'
      });
      pins.push({
        id: 'heart-lv',
        name: 'Left Ventricle',
        description: 'Thickest muscular chamber; pumps oxygenated blood through the aortic semilunar valve under high pressure.',
        pos: new THREE.Vector3(-0.5, 1.1, 0.4),
        color: '#dc2626'
      });
      pins.push({
        id: 'heart-ra',
        name: 'Right Atrium',
        description: 'Receives deoxygenated venous return from the superior and inferior vena cavae before tricuspid entry.',
        pos: new THREE.Vector3(0.7, 1.9, 0.2),
        color: '#2563eb'
      });

      setActiveLayerInfo('Human Cardiac Anatomy: Left/Right Ventricles, Left/Right Atria, systemic Aorta Arch and Vena Cava.');
    }

    // ==========================================
    // 3. UV-VIS SPECTROPHOTOMETER
    // ==========================================
    else if (type === 'spectro') {
      const baseGeo = new THREE.BoxGeometry(2.4, 0.4, 1.6);
      const baseMesh = new THREE.Mesh(baseGeo, createMat(0x1e293b, 0.4, 0.5));
      baseMesh.position.set(0, 0.4, 0);
      group.add(baseMesh);

      const hoodGeo = new THREE.BoxGeometry(2.2, 0.7, 1.4);
      const hoodMesh = new THREE.Mesh(hoodGeo, createMat(0x334155, 0.35, 0.6));
      hoodMesh.position.set(0, 0.95, 0);
      group.add(hoodMesh);

      const cuvetteGeo = new THREE.BoxGeometry(0.35, 0.8, 0.35);
      const cuvetteMat = createMat(0x38bdf8, 0.1, 0.1, 0.4);
      const cuvetteMesh = new THREE.Mesh(cuvetteGeo, cuvetteMat);
      cuvetteMesh.position.set(-0.4, 1.5, 0.1);
      group.add(cuvetteMesh);

      const liquidGeo = new THREE.BoxGeometry(0.28, 0.55, 0.28);
      const liquidMesh = new THREE.Mesh(liquidGeo, createMat(0x10b981, 0.2, 0.1, 0.85));
      liquidMesh.position.set(-0.4, 1.4, 0.1);
      group.add(liquidMesh);

      const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 12);
      beamGeo.rotateZ(Math.PI / 2);
      const beamMesh = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      beamMesh.position.set(0, 1.5, 0.1);
      group.add(beamMesh);

      explodedList.push({ mesh: hoodMesh, originalPos: hoodMesh.position.clone(), explodeDir: new THREE.Vector3(0, 1.0, 0) });
      explodedList.push({ mesh: cuvetteMesh, originalPos: cuvetteMesh.position.clone(), explodeDir: new THREE.Vector3(-0.6, 1.2, 0) });

      pins.push({
        id: 'spectro-cuvette',
        name: 'Sample Cuvette (1.0 cm)',
        description: 'Precision optical cell containing colored solution, defining light path length l in A = ε·c·l.',
        pos: new THREE.Vector3(-0.4, 1.7, 0.1),
        color: '#38bdf8'
      });
      pins.push({
        id: 'spectro-beam',
        name: 'Monochromatic Light Beam',
        description: 'Selectable wavelength (λ) light passing through sample to measure incident vs transmitted radiance (I/I₀).',
        pos: new THREE.Vector3(0.3, 1.5, 0.1),
        color: '#22c55e'
      });

      setActiveLayerInfo('UV-Vis Spectrophotometer: Beer-Lambert Law absorbance (A = ε·c·l) instrument.');
    }

    // ==========================================
    // 4. PLANT CELL ORGANELLES
    // ==========================================
    else if (type === 'plant_cell') {
      const wallGeo = new THREE.BoxGeometry(2.6, 1.8, 1.4);
      const wallMesh = new THREE.Mesh(wallGeo, createMat(0x15803d, 0.5, 0.1, 0.35));
      wallMesh.position.set(0, 1.3, 0);
      group.add(wallMesh);

      const vacuoleGeo = new THREE.SphereGeometry(0.7, 24, 20);
      vacuoleGeo.scale(1.2, 0.9, 0.8);
      const vacuoleMesh = new THREE.Mesh(vacuoleGeo, createMat(0x38bdf8, 0.2, 0.1, 0.55));
      vacuoleMesh.position.set(0.3, 1.2, 0);
      group.add(vacuoleMesh);

      const nucleusGeo = new THREE.SphereGeometry(0.42, 24, 20);
      const nucleusMesh = new THREE.Mesh(nucleusGeo, createMat(0x8b5cf6, 0.4, 0.2));
      nucleusMesh.position.set(-0.7, 1.45, 0.1);
      group.add(nucleusMesh);

      const cpGroup = new THREE.Group();
      const cpGeo = new THREE.SphereGeometry(0.2, 16, 14);
      cpGeo.scale(1.4, 0.7, 0.8);
      const cpMat = createMat(0x22c55e, 0.3, 0.2);
      [[-0.6, 0.7, 0.3], [-0.4, 1.8, -0.3], [0.8, 1.8, 0.3]].forEach(([x, y, z]) => {
        const cp = new THREE.Mesh(cpGeo, cpMat);
        cp.position.set(x, y, z);
        cpGroup.add(cp);
      });
      group.add(cpGroup);

      explodedList.push({ mesh: wallMesh, originalPos: wallMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0, 1.2) });
      explodedList.push({ mesh: vacuoleMesh, originalPos: vacuoleMesh.position.clone(), explodeDir: new THREE.Vector3(1.1, 0, 0) });
      explodedList.push({ mesh: nucleusMesh, originalPos: nucleusMesh.position.clone(), explodeDir: new THREE.Vector3(-1.2, 0.8, 0) });
      explodedList.push({ mesh: cpGroup, originalPos: cpGroup.position.clone(), explodeDir: new THREE.Vector3(0, 1.4, 0) });

      pins.push({
        id: 'cell-wall',
        name: 'Cellulose Cell Wall',
        description: 'Rigid outer layer providing structural turgor support, osmotic protection, and shape to plant cells.',
        pos: new THREE.Vector3(1.3, 1.7, 0.7),
        color: '#15803d'
      });
      pins.push({
        id: 'cell-vacuole',
        name: 'Large Central Vacuole',
        description: 'Tonoplast-bound organelle storing water, inorganic ions, and maintaining cellular hydrostatic turgor pressure.',
        pos: new THREE.Vector3(0.3, 1.4, 0),
        color: '#38bdf8'
      });
      pins.push({
        id: 'cell-nucleus',
        name: 'Nucleus & DNA',
        description: 'Houses linear chromosomes and genomic DNA; directs protein synthesis via RNA transcription.',
        pos: new THREE.Vector3(-0.7, 1.5, 0.3),
        color: '#8b5cf6'
      });
      pins.push({
        id: 'cell-chloroplast',
        name: 'Chloroplast (Thylakoids)',
        description: 'Site of light and dark photosynthesis reactions synthesizing glucose using chlorophyll pigments.',
        pos: new THREE.Vector3(-0.4, 1.9, 0),
        color: '#22c55e'
      });

      setActiveLayerInfo('Plant Cell Ultrastructure: Cellulose Cell Wall, Central Vacuole, Chloroplasts, and Nucleus.');
    }

    // ==========================================
    // 5. SOLAR SYSTEM & PLANETARY ORBITS
    // ==========================================
    else if (type === 'solar_system') {
      const sunGeo = new THREE.SphereGeometry(0.75, 32, 32);
      const sunMesh = new THREE.Mesh(sunGeo, new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2
      }));
      sunMesh.position.set(0, 1.4, 0);
      group.add(sunMesh);

      const planets = [
        { name: 'Mercury', dist: 1.3, rad: 0.1, col: 0x94a3b8, speed: 1.6 },
        { name: 'Venus', dist: 1.8, rad: 0.16, col: 0xfbbf24, speed: 1.2 },
        { name: 'Earth', dist: 2.4, rad: 0.2, col: 0x3b82f6, speed: 0.9 },
        { name: 'Mars', dist: 3.1, rad: 0.14, col: 0xef4444, speed: 0.7 },
        { name: 'Jupiter', dist: 4.0, rad: 0.38, col: 0xd97706, speed: 0.45 },
      ];

      planets.forEach(p => {
        const ringGeo = new THREE.RingGeometry(p.dist - 0.015, p.dist + 0.015, 64);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.DoubleSide, opacity: 0.5, transparent: true }));
        ringMesh.position.set(0, 1.4, 0);
        group.add(ringMesh);

        const pivot = new THREE.Group();
        pivot.position.set(0, 1.4, 0);

        const pGeo = new THREE.SphereGeometry(p.rad, 20, 20);
        const pMesh = new THREE.Mesh(pGeo, createMat(p.col, 0.4, 0.3));
        pMesh.position.set(p.dist, 0, 0);
        pivot.add(pMesh);

        group.add(pivot);
        ctx.orbitingPlanets?.push({ pivot, speed: p.speed });

        explodedList.push({ mesh: pivot, originalPos: pivot.position.clone(), explodeDir: new THREE.Vector3(0, p.dist * 0.45, 0) });
      });

      pins.push({
        id: 'solar-sun',
        name: 'The Sun (G2V Star)',
        description: 'Core thermonuclear fusion engine powering planetary orbital motion via Newtonian/Einsteinian gravity.',
        pos: new THREE.Vector3(0, 2.2, 0),
        color: '#f59e0b'
      });
      pins.push({
        id: 'solar-earth',
        name: 'Earth Orbit (1.0 AU)',
        description: 'Habitable zone terrestrial planet with 365.25 day elliptical orbit and protective geomagnetic magnetosphere.',
        pos: new THREE.Vector3(2.4, 1.6, 0),
        color: '#3b82f6'
      });

      setActiveLayerInfo('Solar System Mechanics: Heliocentric planetary orbits with Keplerian velocity profiles.');
    }

    // ==========================================
    // 6. AC ELECTRIC GENERATOR / DYNAMO
    // ==========================================
    else if (type === 'ac_generator') {
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 2.0), createMat(0x334155, 0.5, 0.6));
      baseMesh.position.set(0, 0.3, 0);
      group.add(baseMesh);

      const northMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 1.4), createMat(0xdc2626, 0.3, 0.4));
      northMesh.position.set(-1.1, 1.2, 0);
      group.add(northMesh);

      const southMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 1.4), createMat(0x2563eb, 0.3, 0.4));
      southMesh.position.set(1.1, 1.2, 0);
      group.add(southMesh);

      const coilGroup = new THREE.Group();
      coilGroup.position.set(0, 1.2, 0);

      const wireGeo = new THREE.TorusGeometry(0.55, 0.05, 12, 32);
      wireGeo.scale(1.2, 0.7, 1);
      const wireMesh = new THREE.Mesh(wireGeo, createMat(0xb45309, 0.2, 0.85));
      coilGroup.add(wireMesh);

      const shaftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16), createMat(0x94a3b8, 0.2, 0.8));
      shaftMesh.rotateX(Math.PI / 2);
      coilGroup.add(shaftMesh);

      group.add(coilGroup);

      explodedList.push({ mesh: northMesh, originalPos: northMesh.position.clone(), explodeDir: new THREE.Vector3(-1.3, 0, 0) });
      explodedList.push({ mesh: southMesh, originalPos: southMesh.position.clone(), explodeDir: new THREE.Vector3(1.3, 0, 0) });
      explodedList.push({ mesh: coilGroup, originalPos: coilGroup.position.clone(), explodeDir: new THREE.Vector3(0, 1.2, 0) });

      pins.push({
        id: 'gen-coil',
        name: 'Armature Copper Coil',
        description: 'Conducting coil rotated mechanically through the magnetic field, inducing sinusoidal electromotive force (EMF = NBAω sin ωt).',
        pos: new THREE.Vector3(0, 1.7, 0),
        color: '#b45309'
      });
      pins.push({
        id: 'gen-magnets',
        name: 'Magnetic Stator Poles',
        description: 'Permanent magnets establishing uniform horizontal magnetic flux density (B) directed from North to South.',
        pos: new THREE.Vector3(-1.1, 1.9, 0),
        color: '#dc2626'
      });

      setActiveLayerInfo('AC Alternating Current Generator: Electromagnetic induction with rotating coil and magnetic poles.');
    }

    // ==========================================
    // 7. CRYSTAL LATTICE (NaCl)
    // ==========================================
    else if (type === 'crystal_lattice') {
      const latticeGroup = new THREE.Group();
      latticeGroup.position.set(0, 1.3, 0);

      const naMat = createMat(0xa855f7, 0.3, 0.4);
      const clMat = createMat(0x10b981, 0.3, 0.3);
      const naGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const clGeo = new THREE.SphereGeometry(0.22, 16, 16);

      const spacing = 0.9;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const isNa = (Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 1;
            const sphere = new THREE.Mesh(isNa ? naGeo : clGeo, isNa ? naMat : clMat);
            sphere.position.set(x * spacing, y * spacing, z * spacing);
            latticeGroup.add(sphere);

            const dir = new THREE.Vector3(x, y, z).normalize();
            if (dir.lengthSq() > 0) {
              explodedList.push({ mesh: sphere, originalPos: sphere.position.clone(), explodeDir: dir.multiplyScalar(1.2) });
            }
          }
        }
      }

      group.add(latticeGroup);

      pins.push({
        id: 'nacl-cl',
        name: 'Chloride Ion (Cl⁻)',
        description: 'Larger ionic radius anion (181 pm) arranged in face-centered cubic close packing with 6:6 coordination.',
        pos: new THREE.Vector3(0.9, 2.2, 0.9),
        color: '#10b981'
      });
      pins.push({
        id: 'nacl-na',
        name: 'Sodium Ion (Na⁺)',
        description: 'Cation (102 pm) fitting into octahedral interstitial voids, yielding 1:1 rock salt stoichiometry.',
        pos: new THREE.Vector3(0, 1.3, 0.9),
        color: '#a855f7'
      });

      setActiveLayerInfo('NaCl Crystal Lattice: Face-Centered Cubic rock salt unit cell with 6:6 octahedral coordination.');
    }

    // ==========================================
    // 8. CONVOCATION TOWER & ROTUNDA
    // ==========================================
    else if (type === 'convocation_tower') {
      const rotundaGroup = new THREE.Group();
      rotundaGroup.position.set(0, 0.2, 0);

      const plinthMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.3, 32), createMat(0xd4d4d8, 0.6, 0.1));
      plinthMesh.position.set(0, 0.15, 0);
      rotundaGroup.add(plinthMesh);

      const towerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 2.2, 24), createMat(0x1e3a8a, 0.4, 0.3));
      towerMesh.position.set(0, 1.4, 0);
      rotundaGroup.add(towerMesh);

      const spireMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.1, 16), createMat(0xf59e0b, 0.2, 0.9));
      spireMesh.position.set(0, 2.7, 0);
      rotundaGroup.add(spireMesh);

      group.add(rotundaGroup);

      explodedList.push({ mesh: spireMesh, originalPos: spireMesh.position.clone(), explodeDir: new THREE.Vector3(0, 1.8, 0) });
      explodedList.push({ mesh: towerMesh, originalPos: towerMesh.position.clone(), explodeDir: new THREE.Vector3(0, 0.2, 0) });

      pins.push({
        id: 'tower-spire',
        name: 'Academic Torch Spire',
        description: 'Symbolizes institutional wisdom, matriculation beacon, and graduation excellence.',
        pos: new THREE.Vector3(0, 3.2, 0),
        color: '#f59e0b'
      });

      setActiveLayerInfo('University Convocation Rotunda & Spire: Classic institution architecture across Nigerian campuses.');
    }

    // ==========================================
    // 9. BOHR HYDROGEN ATOM
    // ==========================================
    else if (type === 'bohr_atom') {
      const nucleusGeo = new THREE.SphereGeometry(0.4, 24, 24);
      const nucleusMesh = new THREE.Mesh(nucleusGeo, createMat(0xef4444, 0.2, 0.8));
      nucleusMesh.position.set(0, 1.3, 0);
      group.add(nucleusMesh);

      [1.1, 2.0, 2.9].forEach((radius, idx) => {
        const ringGeo = new THREE.RingGeometry(radius - 0.015, radius + 0.015, 64);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, opacity: 0.4, transparent: true }));
        ringMesh.position.set(0, 1.3, 0);
        group.add(ringMesh);

        const eGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const eMesh = new THREE.Mesh(eGeo, createMat(0x38bdf8, 0.1, 0.9));
        eMesh.position.set(radius, 1.3, 0);
        group.add(eMesh);

        explodedList.push({ mesh: ringMesh, originalPos: ringMesh.position.clone(), explodeDir: new THREE.Vector3(0, idx * 0.8, 0) });
        explodedList.push({ mesh: eMesh, originalPos: eMesh.position.clone(), explodeDir: new THREE.Vector3(0, idx * 0.8, 0) });
      });

      pins.push({
        id: 'bohr-nucleus',
        name: 'Proton Nucleus (+e)',
        description: 'Positive nuclear core concentrating nearly all atomic mass with Coulombic attraction.',
        pos: new THREE.Vector3(0, 1.8, 0),
        color: '#ef4444'
      });
      pins.push({
        id: 'bohr-shell-1',
        name: 'Ground State (n=1, -13.6 eV)',
        description: 'Lowest quantized energy state with angular momentum L = h/2π.',
        pos: new THREE.Vector3(1.1, 1.4, 0),
        color: '#38bdf8'
      });

      setActiveLayerInfo('Bohr Atomic Model: Quantized electron energy levels (E_n = -13.6/n² eV) and photon emissions.');
    }

    // ==========================================
    // 10. VOLTAIC GALVANIC CELL
    // ==========================================
    else if (type === 'voltaic_cell') {
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 24), createMat(0x38bdf8, 0.1, 0.1, 0.4));
      b1.position.set(-1.0, 1.0, 0);
      group.add(b1);

      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 24), createMat(0x3b82f6, 0.1, 0.1, 0.4));
      b2.position.set(1.0, 1.0, 0);
      group.add(b2);

      // Anode & Cathode rods
      const zincMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.2), createMat(0x94a3b8, 0.2, 0.8));
      zincMesh.position.set(-1.0, 1.2, 0);
      group.add(zincMesh);

      const copperMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.2), createMat(0xb45309, 0.2, 0.8));
      copperMesh.position.set(1.0, 1.2, 0);
      group.add(copperMesh);

      // Salt bridge curve
      const bridgeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, 1.2, 0),
        new THREE.Vector3(0, 1.7, 0),
        new THREE.Vector3(0.7, 1.2, 0)
      ]);
      const bridgeMesh = new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 16, 0.08, 12, false), createMat(0xf8fafc, 0.2, 0.1, 0.6));
      group.add(bridgeMesh);

      explodedList.push({ mesh: zincMesh, originalPos: zincMesh.position.clone(), explodeDir: new THREE.Vector3(-0.8, 0.5, 0) });
      explodedList.push({ mesh: copperMesh, originalPos: copperMesh.position.clone(), explodeDir: new THREE.Vector3(0.8, 0.5, 0) });
      explodedList.push({ mesh: bridgeMesh, originalPos: bridgeMesh.position.clone(), explodeDir: new THREE.Vector3(0, 1.0, 0) });

      pins.push({
        id: 'cell-anode',
        name: 'Zinc Anode (Negative / Oxidation)',
        description: 'Oxidation half-reaction: Zn(s) → Zn²⁺(aq) + 2e⁻ releasing electrons through the external circuit.',
        pos: new THREE.Vector3(-1.0, 1.9, 0),
        color: '#94a3b8'
      });
      pins.push({
        id: 'cell-cathode',
        name: 'Copper Cathode (Positive / Reduction)',
        description: 'Reduction half-reaction: Cu²⁺(aq) + 2e⁻ → Cu(s) depositing elemental copper.',
        pos: new THREE.Vector3(1.0, 1.9, 0),
        color: '#b45309'
      });
      pins.push({
        id: 'cell-bridge',
        name: 'Salt Bridge (KNO₃ / KCl)',
        description: 'Maintains electrical neutrality by allowing ion migration between half-cells without mixing solutions.',
        pos: new THREE.Vector3(0, 1.8, 0),
        color: '#38bdf8'
      });

      setActiveLayerInfo('Voltaic Daniell Cell: Chemical energy converted to electrical energy (E°cell = +1.10 V).');
    }

    // ==========================================
    // 11. HUMAN EYE OPTICS
    // ==========================================
    else if (type === 'human_eye') {
      const eyeGeo = new THREE.SphereGeometry(1.2, 32, 24);
      const eyeMesh = new THREE.Mesh(eyeGeo, createMat(0xf8fafc, 0.3, 0.1));
      eyeMesh.position.set(0, 1.3, 0);
      group.add(eyeMesh);

      // Cornea / Lens bulge
      const lensGeo = new THREE.SphereGeometry(0.5, 24, 16);
      lensGeo.scale(0.5, 0.9, 0.9);
      const lensMesh = new THREE.Mesh(lensGeo, createMat(0x38bdf8, 0.1, 0.1, 0.7));
      lensMesh.position.set(1.15, 1.3, 0);
      group.add(lensMesh);

      // Optic nerve
      const nerveGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
      nerveGeo.rotateZ(Math.PI / 2);
      const nerveMesh = new THREE.Mesh(nerveGeo, createMat(0xfbbf24, 0.4, 0.2));
      nerveMesh.position.set(-1.4, 1.3, 0);
      group.add(nerveMesh);

      explodedList.push({ mesh: lensMesh, originalPos: lensMesh.position.clone(), explodeDir: new THREE.Vector3(1.2, 0, 0) });
      explodedList.push({ mesh: nerveMesh, originalPos: nerveMesh.position.clone(), explodeDir: new THREE.Vector3(-1.2, 0, 0) });

      pins.push({
        id: 'eye-lens',
        name: 'Crystalline Biconvex Lens',
        description: 'Adjusts focal length through ciliary muscle accommodation to focus inverted real images onto the retina.',
        pos: new THREE.Vector3(1.4, 1.5, 0),
        color: '#38bdf8'
      });
      pins.push({
        id: 'eye-retina',
        name: 'Retina & Photoreceptors',
        description: 'Contains light-sensitive rod (dim light) and cone (color) cells converting photons into neural impulses.',
        pos: new THREE.Vector3(-0.6, 1.8, 0),
        color: '#f43f5e'
      });

      setActiveLayerInfo('Human Eye Optical System: Cornea and biconvex lens focusing images on the retina.');
    }

    // ==========================================
    // 12. BENZENE RING (C6H6)
    // ==========================================
    else if (type === 'benzene_ring') {
      const ringGroup = new THREE.Group();
      ringGroup.position.set(0, 1.3, 0);

      const carbonMat = createMat(0x334155, 0.3, 0.3);
      const hydrogenMat = createMat(0xf8fafc, 0.3, 0.1);
      const cRadius = 1.1;
      const hRadius = 1.7;

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const cx = Math.cos(angle) * cRadius;
        const cz = Math.sin(angle) * cRadius;
        const hx = Math.cos(angle) * hRadius;
        const hz = Math.sin(angle) * hRadius;

        const cMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), carbonMat);
        cMesh.position.set(cx, 0, cz);
        ringGroup.add(cMesh);

        const hMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), hydrogenMat);
        hMesh.position.set(hx, 0, hz);
        ringGroup.add(hMesh);

        // Bond cylinder
        const nextAngle = ((i + 1) / 6) * Math.PI * 2;
        const ncx = Math.cos(nextAngle) * cRadius;
        const ncz = Math.sin(nextAngle) * cRadius;

        const bCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), createMat(0x94a3b8, 0.4, 0.2));
        bCyl.position.set((cx + ncx) / 2, 0, (cz + ncz) / 2);
        bCyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(ncx - cx, 0, ncz - cz).normalize());
        ringGroup.add(bCyl);
      }

      // Delocalized electron cloud torus
      const piCloud = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.12, 16, 32), createMat(0x3b82f6, 0.2, 0.1, 0.45));
      piCloud.rotateX(Math.PI / 2);
      ringGroup.add(piCloud);

      group.add(ringGroup);

      explodedList.push({ mesh: piCloud, originalPos: piCloud.position.clone(), explodeDir: new THREE.Vector3(0, 1.2, 0) });

      pins.push({
        id: 'benzene-cloud',
        name: 'Delocalized Pi (π) Electron Ring',
        description: 'Planar aromatic resonance stabilization giving equal C-C bond lengths (139 pm) intermediate between single and double bonds.',
        pos: new THREE.Vector3(0, 1.6, 0),
        color: '#3b82f6'
      });
      pins.push({
        id: 'benzene-carbon',
        name: 'sp² Hybridized Carbon',
        description: 'Planar hexagonal 120° bond angles with unhybridized p-orbitals overlapping to form aromatic aromaticity.',
        pos: new THREE.Vector3(1.1, 1.4, 0),
        color: '#64748b'
      });

      setActiveLayerInfo('Benzene Molecule (C₆H₆): Hexagonal planar resonance hybrid with delocalized pi-electron cloud.');
    }

    ctx.scene.add(group);
    ctx.currentGroup = group;
    ctx.explodedMeshes = explodedList;
    currentPinsRef.current = pins;
  };

  useEffect(() => {
    buildModel(selectedModel, materialFinish);
  }, [selectedModel, materialFinish]);

  const resetCamera = () => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;
    ctx.camera.position.set(0, 3.6, 9.5);
    ctx.controls.target.set(0, 1.2, 0);
  };

  return (
    <div className="relative w-full h-[calc(100vh-var(--app-header-height,80px))] min-h-[600px] bg-gray-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Dynamic Interactive Scientific Labels Overlay */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {projectedPins.map((pin) => {
            if (!pin.isVisible) return null;
            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.screenX}px`,
                  top: `${pin.screenY}px`,
                  transform: 'translate(-50%, -100%)'
                }}
                className="absolute pointer-events-auto cursor-pointer group transition-transform duration-75"
                onClick={() => setSelectedPin(pin)}
              >
                {/* Floating Tag Card */}
                <div 
                  style={{ borderColor: pin.color || '#3b82f6' }}
                  className="bg-gray-900/90 border rounded-xl px-2.5 py-1 shadow-lg text-[11px] font-bold text-white flex items-center space-x-1.5 backdrop-blur-sm group-hover:scale-105 group-hover:bg-blue-950 transition"
                >
                  <span 
                    style={{ backgroundColor: pin.color || '#3b82f6' }}
                    className="w-2 h-2 rounded-full animate-ping shrink-0" 
                  />
                  <span className="whitespace-nowrap">{pin.name}</span>
                </div>
                {/* Pin pointer stem */}
                <div 
                  style={{ backgroundColor: pin.color || '#3b82f6' }}
                  className="w-0.5 h-3 mx-auto shadow-sm" 
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Label Details Popover */}
      {selectedPin && (
        <div className="absolute top-20 right-4 z-30 bg-gray-900/95 border border-blue-500/50 rounded-2xl p-4 shadow-2xl max-w-sm text-xs pointer-events-auto backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">{selectedPin.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-gray-300 mt-2 leading-relaxed">{selectedPin.description}</p>
          <div className="mt-3 pt-2.5 border-t border-gray-800 flex justify-between items-center text-[11px]">
            <span className="text-blue-400 font-medium">Exam Syllabus Key Concept</span>
            {onAskAI && (
              <button
                onClick={() => {
                  onAskAI(`Explain exam questions on ${selectedPin.name} in ${selectedModel}`);
                  setSelectedPin(null);
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
              >
                Ask AI Tutor
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Left Title & Subject Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5 pointer-events-auto bg-gray-900/90 border border-gray-800 rounded-xl p-3 shadow-xl max-w-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">CampusAI 3D STEM Lab</h1>
            <p className="text-[11px] text-gray-400">Interactive 3D Science & Engineering Simulator</p>
          </div>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed border-t border-gray-800/80 pt-2">{activeLayerInfo}</p>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 pointer-events-auto">
        {/* Toggle Part Labels Button */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
            showLabels 
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
              : 'bg-gray-900/90 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title={showLabels ? 'Hide Part Labels' : 'Show 3D Part Labels'}
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{showLabels ? 'Labels: ON' : 'Labels: OFF'}</span>
        </button>

        {/* Add More 3D Models Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 text-xs font-bold flex items-center space-x-1.5 shadow-lg transition"
          title="Explore Full STEM 3D Catalogue or Request Custom Model"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add 3D Stuff</span>
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${isRotating ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900/90 border-gray-800 text-gray-300 hover:bg-gray-800'}`}
          title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Rotate'}</span>
        </button>

        <button
          onClick={resetCamera}
          className="p-2 rounded-xl bg-gray-900/90 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-semibold flex items-center space-x-1.5 transition"
          title="Reset Camera View"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Add More 3D Models / STEM Catalogue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Add 3D Models & STEM Stuff</h2>
                  <p className="text-xs text-gray-400">Select any syllabus topic to load into the interactive 3D laboratory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-800">
              {/* Full 12 STEM Models Catalogue Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Available STEM 3D Models</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STEM_MODELS.map(m => {
                    const Icon = m.icon;
                    const isCurrent = selectedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsAddModalOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition ${
                          isCurrent 
                            ? 'bg-blue-600/20 border-blue-500 text-white' 
                            : 'bg-gray-900 border-gray-800/80 hover:border-gray-700 text-gray-300'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-white truncate">{m.label}</h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{m.category}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{m.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Request Custom 3D Model Section */}
              <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-2 text-blue-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-bold text-xs text-white">Need a specific 3D model for your course?</h4>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                  Ask our engineering engine to model any organ, molecule, circuit, or geological structure (e.g. "Electrolysis Cathode", "Photosystem II", "Synaptic Cleft").
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="E.g. Nephron kidney anatomy, Carnot heat engine, DNA helicase..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (!customPrompt.trim()) return;
                      setIsGeneratingCustom(true);
                      setTimeout(() => {
                        setSelectedModel('bohr_atom');
                        setIsGeneratingCustom(false);
                        setIsAddModalOpen(false);
                        setCustomPrompt('');
                      }, 1000);
                    }}
                    disabled={!customPrompt.trim() || isGeneratingCustom}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    {isGeneratingCustom ? <span>Generating...</span> : <span>Load Topic</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Sleek Bottom Control Dock (<= 15% viewport, collapsible) */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[94vw] max-w-5xl z-20 transition-transform duration-300 pointer-events-auto ${isControlsCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'}`}>
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-4 py-1 rounded-t-lg bg-gray-900 border-t border-x border-gray-800 text-[11px] font-semibold text-gray-400 hover:text-white flex items-center space-x-1 shadow-md transition"
          >
            {isControlsCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isControlsCollapsed ? 'Show 3D Models & Tools' : 'Hide Controls'}</span>
          </button>
        </div>

        {/* Main Dock Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-3 text-xs">
          {/* 1. Model Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-800">
            {STEM_MODELS.map(m => {
              const Icon = m.icon;
              const isSel = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center space-x-1.5 border transition ${
                    isSel 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                      : 'bg-gray-950/80 border-gray-800/80 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-300 hover:text-white transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>More Models...</span>
            </button>
          </div>

          {/* 2. Controls Row: Explode / Dissect Slider + Labels Toggle + Finish */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-800/80">
            {/* Exploded View Slider */}
            <div className="flex items-center space-x-2.5 w-full sm:w-80 bg-gray-950/70 px-3 py-2 rounded-xl border border-gray-800/80">
              <Layers className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px] font-medium text-gray-300 shrink-0">Dissect / Explode:</span>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.05"
                value={explodedAmount}
                onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
              />
              <span className="text-[11px] font-bold text-blue-400 w-10 text-right">
                {Math.round(explodedAmount * 40)}%
              </span>
            </div>

            {/* Labels Toggle and Finish Swatches */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 border transition ${
                  showLabels 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' 
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{showLabels ? 'Labels: Visible' : 'Show Labels'}</span>
              </button>

              <div className="flex items-center space-x-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
                <button
                  onClick={() => setMaterialFinish('pbr')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${materialFinish === 'pbr' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:text-white'}`}
                >
                  PBR
                </button>
                <button
                  onClick={() => setMaterialFinish('xray')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${materialFinish === 'xray' ? 'bg-gray-800 text-cyan-300 border border-gray-700' : 'text-gray-400 hover:text-white'}`}
                >
                  X-Ray
                </button>
                <button
                  onClick={() => setMaterialFinish('metallic')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${materialFinish === 'metallic' ? 'bg-gray-800 text-amber-300 border border-gray-700' : 'text-gray-400 hover:text-white'}`}
                >
                  Metallic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeJsLab;
