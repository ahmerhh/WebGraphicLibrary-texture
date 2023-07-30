import getGl from '@ahmerhh/WebGraphicLibrary-context';
import Program from '@ahmerhh/WebGraphicLibrary-program';
import Buffer from '@ahmerhh/WebGraphicLibrary-buffer';
// import getPlaneGeometry from '@ahmerhh/WebGraphicLibrary-geo-plane';
import Texture from '../src';

// Create a canvas element and append it to the document body
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

// Get the WebGL context and set the viewport
const gl = getGl(canvas);
gl.viewport(0, 0, canvas.width, canvas.height);

// Create a shader program with vertex and fragment shaders
const program = new Program(gl,
  `
  attribute vec3 aPosition;
  attribute vec2 aUv;

  varying vec2 vUv;

  void main() {
    vUv = aUv;
    gl_Position = vec4(aPosition, 1.0);
  }
  `,
  `
  precision mediump float;

  uniform sampler2D uTextureA;
  uniform sampler2D uTextureB;
  uniform sampler2D uTextureC;

  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uTextureA, vUv) + texture2D(uTextureB, vUv) + texture2D(uTextureC, vUv);
  }
  `
);

// Add attributes and uniforms to the shader program
program.addAttribute('aPosition', 3, gl.FLOAT);
program.addAttribute('aUv', 2, gl.FLOAT);
program.addUniform('uTextureA', gl.INT);
program.addUniform('uTextureB', gl.INT);
program.addUniform('uTextureC', gl.INT);

// Get geometry data (vertices, UVs, faces) using getPlaneGeometry (not shown in this code)

// Create buffers for vertices, UVs, and faces and bind them to shader program attributes
const positionsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, geometry.verts);
const uvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, geometry.uvs);
const facesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, geometry.faces);

// Bind buffers to attributes in the shader program
program.bind();
positionsBuffer.bind();
program.setAttributePointer('aPosition');
uvsBuffer.bind();
program.setAttributePointer('aUv');
facesBuffer.bind();

// Create three textures
const textureA = new Texture(gl, gl.TEXTURE_2D, 1024, 1024);
const textureB = new Texture(gl, gl.TEXTURE_2D, 1024, 1024);
const textureC = new Texture(gl, gl.TEXTURE_2D);

// Load images for textureA and textureB
const imageA = document.createElement('img');
imageA.onload = () => {
  // Bind textureA to unit 0, set its data to the loaded image, and update the uniform in the shader program
  const unit = textureA.bind(0);
  textureA.setData(imageA);
  program.setUniform('uTextureA', unit);
}
imageA.src = 'assets/power-of-two.jpg';

const imageB = document.createElement('img');
imageB.onload = () => {
  // Bind textureB to unit 1, set its data to the loaded image, and update the uniform in the shader program
  const unit = textureB.bind(1);
  textureB.setData(imageB);
  program.setUniform('uTextureB', unit);
}
imageB.src = 'assets/non-power-of-two.jpg';

// Create a video element for textureC
let isVideoReady = false;
const video = document.createElement('video');
video.muted = true;

video.addEventListener('canplaythrough', () => {
  isVideoReady = true;
  video.play();
}, true);

video.addEventListener('ended', () => {
  video.currentTime = 0;
  video.play();
}, true);

video.src = 'assets/non-power-of-two.mp4';

(function tick() {
  // If the video is ready, bind textureC to unit 2, set its data to the video, and update the uniform in the shader program
  if (isVideoReady) {
    const unit = textureC.bind(2);
    textureC.setData(video);
    program.setUniform('uTextureC', unit);
  }

  // Draw the scene using the shader program
  gl.drawElements(gl.TRIANGLES, facesBuffer.length, gl.UNSIGNED_SHORT, 0);

  // Continue the animation loop
  requestAnimationFrame(tick);
})();
