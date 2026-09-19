// WebGL 2 / 1 Parameter & Limits Probe + Offscreen Render Microbenchmark

export interface WebGlProbeData {
  supported: boolean;
  version: "webgl2" | "webgl1" | "none";
  highPerfVendor: string;
  highPerfRenderer: string;
  lowPowerVendor?: string;
  lowPowerRenderer?: string;
  shadingLanguageVersion: string;
  maxTextureSize: number;
  maxRenderBufferSize: number;
  maxVertexAttribs: number;
  maxVaryingVectors: number;
  maxFragmentUniformVectors: number;
  maxVertexUniformVectors: number;
  maxCombinedTextureUnits: number;
  precision: {
    vertexFloat: number;
    fragmentFloat: number;
  };
}

export function probeWebGl(): WebGlProbeData {
  if (typeof document === "undefined") {
    return {
      supported: false,
      version: "none",
      highPerfVendor: "",
      highPerfRenderer: "",
      shadingLanguageVersion: "",
      maxTextureSize: 0,
      maxRenderBufferSize: 0,
      maxVertexAttribs: 0,
      maxVaryingVectors: 0,
      maxFragmentUniformVectors: 0,
      maxVertexUniformVectors: 0,
      maxCombinedTextureUnits: 0,
      precision: { vertexFloat: 0, fragmentFloat: 0 },
    };
  }

  let highPerfVendor = "";
  let highPerfRenderer = "";
  let lowPowerVendor = "";
  let lowPowerRenderer = "";
  let version: "webgl2" | "webgl1" | "none" = "none";
  let glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;

  try {
    // 1. High Performance context probe
    const canvasHigh = document.createElement("canvas");
    canvasHigh.width = 1;
    canvasHigh.height = 1;
    const gl2 = canvasHigh.getContext("webgl2", {
      powerPreference: "high-performance",
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
    });
    if (gl2) {
      glContext = gl2;
      version = "webgl2";
    } else {
      const gl1 = canvasHigh.getContext("webgl", {
        powerPreference: "high-performance",
        antialias: false,
      });
      if (gl1) {
        glContext = gl1;
        version = "webgl1";
      }
    }

    if (glContext) {
      const ext = glContext.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        highPerfVendor = glContext.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "";
        highPerfRenderer = glContext.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
      }
      if (!highPerfRenderer) {
        highPerfRenderer = glContext.getParameter(glContext.RENDERER) || "";
      }
      if (!highPerfVendor) {
        highPerfVendor = glContext.getParameter(glContext.VENDOR) || "";
      }
    }

    // 2. Low Power context probe (to check for Optimus integrated graphics)
    try {
      const canvasLow = document.createElement("canvas");
      canvasLow.width = 1;
      canvasLow.height = 1;
      const glLow = canvasLow.getContext("webgl2", { powerPreference: "low-power" }) || canvasLow.getContext("webgl", { powerPreference: "low-power" });
      if (glLow) {
        const extLow = glLow.getExtension("WEBGL_debug_renderer_info");
        if (extLow) {
          lowPowerVendor = glLow.getParameter(extLow.UNMASKED_VENDOR_WEBGL) || "";
          lowPowerRenderer = glLow.getParameter(extLow.UNMASKED_RENDERER_WEBGL) || "";
        }
      }
    } catch {}

    if (!glContext) {
      return {
        supported: false,
        version: "none",
        highPerfVendor: "",
        highPerfRenderer: "",
        shadingLanguageVersion: "",
        maxTextureSize: 0,
        maxRenderBufferSize: 0,
        maxVertexAttribs: 0,
        maxVaryingVectors: 0,
        maxFragmentUniformVectors: 0,
        maxVertexUniformVectors: 0,
        maxCombinedTextureUnits: 0,
        precision: { vertexFloat: 0, fragmentFloat: 0 },
      };
    }

    const maxTextureSize = glContext.getParameter(glContext.MAX_TEXTURE_SIZE) || 0;
    const maxRenderBufferSize = glContext.getParameter(glContext.MAX_RENDERBUFFER_SIZE) || 0;
    const maxVertexAttribs = glContext.getParameter(glContext.MAX_VERTEX_ATTRIBS) || 0;
    const maxVaryingVectors = glContext.getParameter(glContext.MAX_VARYING_VECTORS) || 0;
    const maxFragmentUniformVectors = glContext.getParameter(glContext.MAX_FRAGMENT_UNIFORM_VECTORS) || 0;
    const maxVertexUniformVectors = glContext.getParameter(glContext.MAX_VERTEX_UNIFORM_VECTORS) || 0;
    const maxCombinedTextureUnits = glContext.getParameter(glContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS) || 0;
    const shadingLanguageVersion = glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION) || "";

    const vPrec = glContext.getShaderPrecisionFormat(glContext.VERTEX_SHADER, glContext.HIGH_FLOAT);
    const fPrec = glContext.getShaderPrecisionFormat(glContext.FRAGMENT_SHADER, glContext.HIGH_FLOAT);

    return {
      supported: true,
      version,
      highPerfVendor,
      highPerfRenderer,
      lowPowerVendor,
      lowPowerRenderer,
      shadingLanguageVersion,
      maxTextureSize,
      maxRenderBufferSize,
      maxVertexAttribs,
      maxVaryingVectors,
      maxFragmentUniformVectors,
      maxVertexUniformVectors,
      maxCombinedTextureUnits,
      precision: {
        vertexFloat: vPrec?.precision || 0,
        fragmentFloat: fPrec?.precision || 0,
      },
    };
  } catch {
    return {
      supported: false,
      version: "none",
      highPerfVendor: "",
      highPerfRenderer: "",
      shadingLanguageVersion: "",
      maxTextureSize: 0,
      maxRenderBufferSize: 0,
      maxVertexAttribs: 0,
      maxVaryingVectors: 0,
      maxFragmentUniformVectors: 0,
      maxVertexUniformVectors: 0,
      maxCombinedTextureUnits: 0,
      precision: { vertexFloat: 0, fragmentFloat: 0 },
    };
  }
}

// Fallback Offscreen WebGL GPU Benchmark
export async function runWebGlFallbackBenchmark(): Promise<{
  fps: number;
  gpuScore: number;
  durationMs: number;
}> {
  if (typeof document === "undefined") {
    return { fps: 60, gpuScore: 50, durationMs: 0 };
  }

  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const gl = canvas.getContext("webgl", { powerPreference: "high-performance" });
      if (!gl) {
        resolve({ fps: 60, gpuScore: 50, durationMs: 0 });
        return;
      }

      const vsSrc = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
      const fsSrc = `
        precision highp float;
        uniform float u_time;
        void main() {
          vec2 uv = gl_FragCoord.xy / 128.0;
          float c = sin(uv.x * 20.0 + u_time) * cos(uv.y * 20.0 + u_time);
          for(int i = 0; i < 40; i++) {
            c = sin(c * 2.5 + float(i) * 0.1);
          }
          gl_FragColor = vec4(c, c * 0.5, 1.0 - c, 1.0);
        }
      `;

      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, vsSrc);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, fsSrc);
      gl.compileShader(fs);

      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const pLoc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(pLoc);
      gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

      const uTime = gl.getUniformLocation(prog, "u_time");

      let frames = 0;
      const startTime = performance.now();
      const runDuration = 120; // 120ms lightweight probe

      function renderLoop() {
        const now = performance.now();
        const elapsed = now - startTime;
        if (elapsed < runDuration && frames < 240) {
          gl!.uniform1f(uTime, elapsed * 0.001);
          gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
          frames++;
          requestAnimationFrame(renderLoop);
        } else {
          const fps = Math.round((frames / (elapsed / 1000)));
          const gpuScore = Math.min(Math.max(Math.round((fps / 60) * 50), 10), 98);
          // Cleanup
          gl!.deleteBuffer(buf);
          gl!.deleteProgram(prog);
          gl!.deleteShader(vs);
          gl!.deleteShader(fs);
          resolve({ fps, gpuScore, durationMs: Math.round(elapsed) });
        }
      }

      requestAnimationFrame(renderLoop);
    } catch {
      resolve({ fps: 60, gpuScore: 50, durationMs: 0 });
    }
  });
}
