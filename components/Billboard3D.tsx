'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'

interface Billboard3DProps {
  imageUrl?: string
  autoRotate?: boolean
  className?: string
}

function BillboardMesh({ imageUrl }: { imageUrl?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Load texture if imageUrl is provided
  const texture = imageUrl ? useLoader(TextureLoader, imageUrl) : null

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <group>
      {/* Billboard Board */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshStandardMaterial
          map={texture}
          color={texture ? '#ffffff' : '#3b82f6'}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Billboard Frame */}
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[4.2, 2.7, 0.05]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.9} />
      </mesh>

      {/* Support Posts */}
      <mesh position={[-1.8, -2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.9} />
      </mesh>
      <mesh position={[1.8, -2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.9} />
      </mesh>

      {/* Ground Plate */}
      <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Spotlights */}
      <mesh position={[-2, 2, 1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[2, 2, 1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </Html>
  )
}

export default function Billboard3D({ imageUrl, autoRotate = true, className = '' }: Billboard3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows className="cursor-grab active:cursor-grabbing">
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#fbbf24" />
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#fbbf24" />
        <spotLight
          position={[0, 4, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={0.5}
          castShadow
        />

        {/* Environment */}
        <Environment preset="city" />

        {/* Billboard */}
        <Suspense fallback={<LoadingFallback />}>
          <BillboardMesh imageUrl={imageUrl} />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}
