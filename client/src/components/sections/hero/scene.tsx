import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Sparkles,
  Stars,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

interface HeroSceneProps {
  isMobile?: boolean;
  reducedMotion?: boolean;
}

function CameraRig({ reducedMotion }: { reducedMotion?: boolean }) {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    if (reducedMotion) {
      camera.position.set(0, 0, 6);
      camera.lookAt(0, 0, 0);
      return;
    }
    const scrollY =
      typeof window !== "undefined"
        ? Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
        : 0;
    target.current.set(
      mouse.x * 0.6,
      mouse.y * 0.4 - scrollY * 1.2,
      6 + scrollY * 1.5,
    );
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, -scrollY * 0.5, 0);
  });
  return null;
}

function GlassCore({ reducedMotion }: { reducedMotion?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    if (!reducedMotion) {
      meshRef.current.rotation.y = t * 0.18;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.18;
      const s = 1 + Math.sin(t * 0.9) * 0.04;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.6}
    >
      <mesh ref={meshRef} position={[0.4, 0.1, 0]}>
        <icosahedronGeometry args={[1.35, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={256}
          transmission={1}
          roughness={0.05}
          thickness={1.4}
          ior={1.45}
          chromaticAberration={0.45}
          anisotropy={0.6}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={reducedMotion ? 0 : 0.25}
          color="#9bf0ff"
          attenuationColor="#ff5cf0"
          attenuationDistance={1.4}
        />
      </mesh>
    </Float>
  );
}

function HoloRings({ reducedMotion }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + Math.PI / 2.2;
  });
  return (
    <group ref={groupRef} position={[0.4, 0.1, 0]}>
      {[1.9, 2.3, 2.7].map((r, i) => (
        <mesh key={r} rotation={[0, 0, (i * Math.PI) / 5]}>
          <torusGeometry args={[r, 0.008, 8, 128]} />
          <meshBasicMaterial
            color={i === 0 ? "#00f0ff" : i === 1 ? "#ff5cf0" : "#a78bfa"}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function CompanionForm({ reducedMotion }: { reducedMotion?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    if (!reducedMotion) {
      // gentle floaty rotation + look-at-cursor offset
      meshRef.current.rotation.y =
        Math.sin(t * 0.4) * 0.4 + mouse.x * 0.5;
      meshRef.current.rotation.x = mouse.y * 0.3 + Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.6}
      rotationIntensity={0}
      floatIntensity={reducedMotion ? 0 : 0.8}
      position={[-2.6, -0.3, -0.2]}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.65, 1]} />
        <MeshDistortMaterial
          color="#1a0f3d"
          emissive="#ff5cf0"
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.25}
          distort={reducedMotion ? 0.15 : 0.4}
          speed={reducedMotion ? 0 : 1.5}
          flatShading
        />
      </mesh>
      {/* small orbiting accent */}
      <mesh position={[0.9, 0.4, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
    </Float>
  );
}

function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.elapsedTime;
    gridRef.current.position.z = ((t * 0.6) % 2) - 1;
  });
  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, "#00f0ff", "#3a1a5c"]}
      position={[0, -2.4, 0]}
    />
  );
}

function StarsField({ count }: { count: number }) {
  // memoize so we don't recompute on each rerender
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#bdfaff"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Module-level singleton: the postprocessing ChromaticAberration shader expects
// a real THREE.Vector2 instance for its `offset` uniform.
const chromaOffset = new THREE.Vector2(0.0012, 0.0008);

export default function HeroScene({
  isMobile = false,
  reducedMotion = false,
}: HeroSceneProps) {
  const dpr: [number, number] = isMobile ? [1, 1.25] : [1, 1.75];
  const sparkleCount = isMobile ? 50 : 140;
  const starCount = isMobile ? 600 : 1800;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#070512"]} />
        <fog attach="fog" args={["#070512", 8, 22]} />

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <pointLight
          position={[6, 4, 5]}
          intensity={3.5}
          color="#00f0ff"
          distance={20}
        />
        <pointLight
          position={[-6, -3, -4]}
          intensity={3.5}
          color="#ff5cf0"
          distance={20}
        />
        <pointLight
          position={[0, -4, 3]}
          intensity={2}
          color="#a78bfa"
          distance={15}
        />
        <Environment preset="night" />

        {/* Stars / particles */}
        <Stars
          radius={50}
          depth={30}
          count={isMobile ? 1500 : 4000}
          factor={3}
          saturation={1}
          fade
          speed={reducedMotion ? 0 : 0.4}
        />
        <StarsField count={starCount} />
        <Sparkles
          count={sparkleCount}
          scale={[10, 6, 6]}
          size={2.5}
          speed={reducedMotion ? 0 : 0.6}
          color="#9bf0ff"
        />
        <Sparkles
          count={Math.floor(sparkleCount * 0.6)}
          scale={[8, 5, 4]}
          size={3}
          speed={reducedMotion ? 0 : 0.4}
          color="#ff5cf0"
        />

        {/* Centerpiece + companion */}
        <GlassCore reducedMotion={reducedMotion} />
        <HoloRings reducedMotion={reducedMotion} />
        {!isMobile && <CompanionForm reducedMotion={reducedMotion} />}
        <GridFloor />

        {/* Camera parallax */}
        <CameraRig reducedMotion={reducedMotion} />

        {/* Postprocessing */}
        <EffectComposer multisampling={isMobile ? 0 : 2}>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.85}
            blendFunction={BlendFunction.ADD}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={chromaOffset}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.15} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
