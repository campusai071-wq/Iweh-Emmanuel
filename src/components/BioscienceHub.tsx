import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, BookOpen, ExternalLink, Dna, Activity, ShieldAlert, CheckCircle2, ChevronRight, Layers, FileText, Download, RotateCw, Play, Info, Beaker } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface BioscienceHubProps {
  onAskAI?: (prompt: string) => void;
}

export const BioscienceHub: React.FC<BioscienceHubProps> = ({ onAskAI }) => {
  const [searchTarget, setSearchTarget] = useState('HBB');
  const [proteinData, setProteinData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [literatureList, setLiteratureList] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [aiMentorQuery, setAiMentorQuery] = useState('');
  const [aiMentorResponse, setAiMentorResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'structure' | 'sequence' | 'literature' | 'genetics'>('structure');

  const canvasRef = useRef<HTMLDivElement>(null);
  const threeContextRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    ribbonMesh: THREE.Object3D | null;
  } | null>(null);

  // Canonical Quick-Try Example Pills (Pre-loaded real biological identifiers)
  const QUICK_EXAMPLES = [
    { gene: 'HBB', name: 'Hemoglobin β (Sickle Cell)', accession: 'P68871', clinical: 'Pathogenic HbS' },
    { gene: 'TP53', name: 'Tumor Protein p53', accession: 'P04637', clinical: 'Somatic Cancer' },
    { gene: 'INS', name: 'Insulin Precursor', accession: 'P01308', clinical: 'Metabolic Diabetes' },
    { gene: 'BRCA1', name: 'Breast Cancer Type 1', accession: 'P38398', clinical: 'DNA Double Strand Repair' },
    { gene: 'EGFR', name: 'Epidermal Growth Factor Rec.', accession: 'P00533', clinical: 'Tyrosine Kinase' },
    { gene: 'PCSK9', name: 'PCSK9 (Cholesterol)', accession: 'Q8NBP7', clinical: 'Cardiovascular' }
  ];

  // Fetch protein structure & UniProt metadata
  const fetchProtein = async (query: string) => {
    setIsLoading(true);
    setAiMentorResponse(null);
    try {
      const res = await fetch(`/api/science/protein/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProteinData(data.data);
        if (data.data.domains?.length > 0) {
          setSelectedDomain(data.data.domains[0]);
        }
      }
    } catch (e) {
      console.error('[Bioscience Fetch Error]', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch biomedical literature from Europe PMC proxy
  const fetchLiterature = async (query: string) => {
    try {
      const res = await fetch(`/api/science/literature?q=${encodeURIComponent(query + ' Nigeria biomedical')}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLiteratureList(data.data);
      }
    } catch (e) {
      console.error('[Literature Fetch Error]', e);
    }
  };

  // Ask AI Mentor for clinical & exam breakdown
  const handleAskMentor = async (queryOverride?: string) => {
    const q = queryOverride || aiMentorQuery;
    if (!q.trim()) return;
    setIsAskingAi(true);
    try {
      const res = await fetch('/api/science/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          target: proteinData?.gene || searchTarget,
          topic: 'molecular genetics & JAMB/WAEC Biology syllabus'
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAiMentorResponse(data.answer);
      }
    } catch (e) {
      console.error('[AI Mentor Error]', e);
    } finally {
      setIsAskingAi(false);
    }
  };

  useEffect(() => {
    fetchProtein(searchTarget);
    fetchLiterature(searchTarget);
  }, [searchTarget]);

  // Setup 3D AlphaFold Molecular Ribbon Viewer
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Clean scientific lab canvas

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Scientific lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.6);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    threeContextRef.current = {
      renderer,
      scene,
      camera,
      controls,
      ribbonMesh: null
    };

    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      controls.update();
      if (threeContextRef.current?.ribbonMesh) {
        threeContextRef.current.ribbonMesh.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update 3D Molecular Cartoon/Ribbon when proteinData changes
  useEffect(() => {
    const ctx = threeContextRef.current;
    if (!ctx || !proteinData) return;

    if (ctx.ribbonMesh) {
      ctx.scene.remove(ctx.ribbonMesh);
      ctx.ribbonMesh.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
      ctx.ribbonMesh = null;
    }

    const molGroup = new THREE.Group();

    // Canonical 4-band AlphaFold pLDDT colors:
    // Very High (>90): #0053d6 (Deep Blue)
    // Confident (70-90): #65cbf3 (Light Blue)
    // Low (50-70): #ffdb13 (Yellow)
    // Very Low (<50): #ff7d45 (Orange)
    const plddtColors = [0x0053d6, 0x65cbf3, 0xffdb13, 0xff7d45];

    // Procedural secondary structure folds (Alpha helices & beta sheets)
    const curvePoints: THREE.Vector3[] = [];
    const segments = Math.min(Math.max(proteinData.length || 140, 80), 160);

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const angle = u * Math.PI * 8;
      const r = 1.2 + Math.sin(u * Math.PI * 4) * 0.45;
      const x = Math.cos(angle) * r;
      const y = (u - 0.5) * 3.8;
      const z = Math.sin(angle) * r + Math.cos(u * Math.PI * 3) * 0.35;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const backboneCurve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(backboneCurve, 90, 0.12, 14, false);

    // Color bands representing pLDDT confidence distribution
    const mainPlddtColor = proteinData.meanPlddt >= 90 ? plddtColors[0] : proteinData.meanPlddt >= 70 ? plddtColors[1] : plddtColors[2];
    const backboneMat = new THREE.MeshStandardMaterial({
      color: mainPlddtColor,
      roughness: 0.25,
      metalness: 0.35
    });

    const backboneMesh = new THREE.Mesh(tubeGeo, backboneMat);
    molGroup.add(backboneMesh);

    // Add active site / ligand binding sphere cluster (e.g. Heme pocket for Hemoglobin)
    const pocketGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const pocketMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red binding pocket / iron cofactor
      roughness: 0.2,
      metalness: 0.8
    });
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.position.set(0.2, 0.4, 0.9);
    molGroup.add(pocketMesh);

    ctx.scene.add(molGroup);
    ctx.ribbonMesh = molGroup;
  }, [proteinData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Top Publication-Grade Scientific Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[var(--app-header-height,64px)] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    CampusAI Bioscience Hub & Molecular Explorer
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    DeepMind AlphaFold DB Predictions • UniProtKB Annotations • Europe PMC Biomedical Research
                  </p>
                </div>
              </div>
            </div>

            {/* Target Search Input */}
            <div className="flex items-center space-x-2 w-full md:w-80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && fetchProtein(searchTarget)}
                  placeholder="Enter Gene or UniProt ID (e.g. HBB, TP53)..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>
              <button
                onClick={() => fetchProtein(searchTarget)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                Inspect
              </button>
            </div>
          </div>

          {/* Quick-Try Example Pill Bar (Mandatory Science Workbench Directive) */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">Quick Examples:</span>
            {QUICK_EXAMPLES.map((ex) => (
              <button
                key={ex.gene}
                onClick={() => setSearchTarget(ex.gene)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition shrink-0 flex items-center space-x-1.5 ${searchTarget === ex.gene ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold' : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                <span className="font-mono font-bold text-[11px]">{ex.gene}</span>
                <span className="text-[10px] text-slate-400">({ex.name.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scientific Workbench Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <RotateCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">Resolving AlphaFold DB & UniProt records...</p>
            <p className="text-xs text-slate-500 mt-1">Fetching coordinates, secondary structures, and clinical variant annotations.</p>
          </div>
        ) : proteinData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: 3D Molecular Canvas & Confidence Scale */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {proteinData.accession}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">{proteinData.name}</h2>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] font-medium text-slate-500">AlphaFold DB v4</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* 3D Structure Canvas Mount */}
                <div className="relative w-full h-[380px] bg-slate-50">
                  <div ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                  
                  {/* Floating Structure Metadata Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 p-2.5 rounded-lg shadow-sm text-xs pointer-events-none">
                    <p className="font-semibold text-slate-800">{proteinData.organism}</p>
                    <p className="text-slate-500 text-[11px] font-mono mt-0.5">
                      Length: {proteinData.length} aa • Mass: {proteinData.mass?.toLocaleString()} Da
                    </p>
                  </div>

                  {/* Outbound AlphaFold Model Download Links */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <a
                      href={proteinData.pdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-md shadow-xs flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>PDB File</span>
                    </a>
                    <a
                      href={proteinData.cifUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-md shadow-xs flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>mmCIF</span>
                    </a>
                  </div>
                </div>

                {/* Canonical AlphaFold pLDDT 4-Band Confidence Scale (Mandatory Science Rule) */}
                <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-700 text-xs">AlphaFold Model Confidence:</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded-sm bg-[#0053D6]" />
                      <span className="text-slate-600 text-[11px]">Very High (&gt;90)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded-sm bg-[#65CBF3]" />
                      <span className="text-slate-600 text-[11px]">Confident (70–90)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded-sm bg-[#FFDB13]" />
                      <span className="text-slate-600 text-[11px]">Low (50–70)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded-sm bg-[#FF7D45]" />
                      <span className="text-slate-600 text-[11px]">Very Low (&lt;50)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biological Function & Nigerian Medical Context */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-blue-600" />
                    Biological Function & Clinical Relevance
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    UniProt Curated
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {proteinData.function}
                </p>

                {searchTarget === 'HBB' && (
                  <div className="mt-3 p-3.5 rounded-lg bg-red-50/70 border border-red-200 text-xs text-red-950 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-red-900">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>JAMB & WAEC Examination Focus: Sickle Cell Allele (HbS)</span>
                    </div>
                    <p className="leading-relaxed">
                      A single nucleotide transversion in the HBB gene on chromosome 11 (codon 6/7: GAG &rarr; GTG) causes a glutamate-to-valine amino acid substitution. This creates a hydrophobic patch causing deoxygenated hemoglobin polymers to sickle red blood cells. Nigeria records over 150,000 sickle cell births annually.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Synchronized Domain Inspector, Literature & AI Tutor */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              {/* Navigation Tabs */}
              <div className="flex items-center space-x-1 bg-slate-200/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'structure' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Domains
                </button>
                <button
                  onClick={() => setActiveTab('literature')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'literature' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Literature ({literatureList.length})
                </button>
                <button
                  onClick={() => setActiveTab('genetics')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'genetics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  AI Mentor
                </button>
              </div>

              {/* Tab 1: Functional Domains & Sites */}
              {activeTab === 'structure' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Annotated Domains & Sequence Sites
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {proteinData.domains && proteinData.domains.length > 0 ? (
                      proteinData.domains.map((dom: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedDomain(dom)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition ${selectedDomain === dom ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">{dom.type}</span>
                            <span className="font-mono text-[11px] text-blue-600">
                              {dom.start ? `${dom.start}-${dom.end}` : `Pos: ${dom.position}`}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-snug">{dom.description}</p>
                          {dom.clinicalSignificance && (
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                              {dom.clinicalSignificance}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No structural domain annotations found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Biomedical Literature (Europe PMC) */}
              {activeTab === 'literature' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      PubMed & Europe PMC Publications
                    </h3>
                    <span className="text-[10px] text-slate-400">Open Access</span>
                  </div>
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {literatureList.map((paper, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-blue-700 hover:underline flex items-start justify-between gap-2"
                        >
                          <span>{paper.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                        </a>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {paper.authorString} • <span className="italic">{paper.journalTitle}</span> ({paper.pubYear})
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{paper.abstractText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: AI Science Academic Mentor */}
              {activeTab === 'genetics' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      CampusAI Bioscience Mentor
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={aiMentorQuery}
                      onChange={(e) => setAiMentorQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskMentor()}
                      placeholder="Ask about JAMB biology syllabus, genetics, or mechanisms..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAskMentor()}
                      disabled={isAskingAi || !aiMentorQuery.trim()}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                    >
                      {isAskingAi ? '...' : 'Ask'}
                    </button>
                  </div>

                  {aiMentorResponse && (
                    <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed max-h-[220px] overflow-y-auto">
                      <p className="font-semibold text-indigo-900 mb-1">Mentor Explanation:</p>
                      <p className="whitespace-pre-line">{aiMentorResponse}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleAskMentor(`How is ${proteinData.gene} tested in JAMB UTME Biology?`)}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                    >
                      JAMB Exam Questions?
                    </button>
                    <button
                      onClick={() => handleAskMentor(`Explain the protein folding and quaternary structure of ${proteinData.gene}.`)}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                    >
                      Quaternary Structure?
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BioscienceHub;
