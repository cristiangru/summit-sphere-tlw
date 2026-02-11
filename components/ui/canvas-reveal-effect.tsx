"use client";

import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

// CanvasRevealEffect principal
export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div className={cn("relative h-full w-full bg-white overflow-hidden", containerClassName)}>
      <div className="absolute inset-0">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]}
          shader={`
            float animation_speed_factor = ${animationSpeed.toFixed(1)};
            float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
            opacity *= step(intro_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          `}
          center={["x", "y"]}
        />
      </div>

      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

// DotMatrix
interface DotMatrixProps {
  colors: number[][];
  opacities: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];

    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    } else if (colors.length === 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    }

    return {
      u_colors: { value: colorsArray.map(c => [c[0] / 255, c[1] / 255, c[2] / 255]) },
      u_opacities: { value: opacities },
      u_total_size: { value: totalSize },
      u_dot_size: { value: dotSize },
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return <Shader source={generateShader(shader, center)} uniforms={uniforms} maxFps={60} />;
};

// Helper pentru shader source
const generateShader = (customShader: string, center: ("x" | "y")[]) => `
  precision mediump float;
  in vec2 fragCoord;

  uniform float u_time;
  uniform float u_opacities[10];
  uniform vec3 u_colors[6];
  uniform float u_total_size;
  uniform float u_dot_size;
  uniform vec2 u_resolution;

  out vec4 fragColor;

  float PHI = 1.61803398874989484820459;

  float random(vec2 xy) {
    return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
  }

  void main() {
    vec2 st = fragCoord.xy;

    ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
    ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}

    float opacity = step(0.0, st.x);
    opacity *= step(0.0, st.y);

    vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

    float frequency = 5.0;
    float show_offset = random(st2);
    float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
    opacity *= u_opacities[int(rand * 10.0)];
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

    vec3 color = u_colors[int(show_offset * 6.0)];

    ${customShader}

    fragColor = vec4(color, opacity);
    fragColor.rgb *= fragColor.a;
  }
`;

// Shader wrapper
const Shader = ({ source, uniforms, maxFps = 60 }: { source: string; uniforms: any; maxFps?: number }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full" gl={{ antialias: true, alpha: true }}>
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

// ShaderMaterial – fixed with proper react-three-fiber integration
const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  uniforms: any;
  maxFps?: number;
}) => {
  const { size, gl } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const lastTimeRef = useRef(0);

  // Update resolution on resize
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_resolution.value.set(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio);
    }
  }, [size.width, size.height]);

  // Create material with proper uniforms
  const material = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        out vec2 fragCoord;
        
        void main(){
          gl_Position = vec4(position, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * vec2(1.0, -1.0);
        }
      `,
      fragmentShader: source,
      uniforms: {
        ...uniforms,
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio) },
      },
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
    });

    materialRef.current = shaderMaterial;
    return shaderMaterial;
  }, [source, uniforms, size.width, size.height]);

  // Update time every frame with proper throttling
  useFrame(() => {
    if (!materialRef.current) return;

    const now = performance.now() / 1000; // Convert to seconds
    const frameTime = 1 / maxFps;

    // Throttle FPS
    if (now - lastTimeRef.current < frameTime) return;
    lastTimeRef.current = now;

    materialRef.current.uniforms.u_time.value = now;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};