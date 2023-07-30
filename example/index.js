import getGl from '@ahmerhh/WebGraphicLibrary-context';
// import Program from '@ahmerhh/WebGraphicLibrary-program';
// import Buffer from '@ahmerhh/WebGraphicLibrary-buffer';
// import getPlaneGeometry from '@ahmerhh/WebGraphicLibrary-geo-plane';
import Texture from '../src';

const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

const gl = getGl(canvas);
gl.viewport(0, 0, canvas.width, canvas.height);

const program = new program(gl,
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

program.addAttribute('aPosition', 3, gl.FLOAT);
program.addAttribute('aUv', 2, gl.FLOAT);
program.addUniform('uTextureA', gl.INT);
program.addUniform('uTextureB', gl.INT);
program.addUniform('uTextureC', gl.INT);

const geometry = getPlaneGeometry(2, 2);
const positionsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, geometry.verts);
const uvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, geometry.uvs);
const facesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, geometry.faces);

program.bind();
positionsBuffer.bind();
program.setAttributePointer('aPosition');
uvsBuffer.bind();
program.setAttributePointer('aUv');
facesBuffer.bind();


const textureA = new Texture(gl, gl.TEXTURE_2D, 1024, 1024);
const textureB = new Texture(gl, gl.TEXTURE_2D, 1024, 1024);
const textureC = new Texture(gl, gl.TEXTURE_2D);

const imageA = document.createElement('img');

imageA.onload = () => {
  const unit = textureA.bind(0);
  textureA.setData(imageA);
  program.setUniform('uTextureA', unit);
}

imageA.src = 'assets/power-of-two.jpg';

const imageB = document.createElement('img');

imageB.onload = () => {
  const unit = textureB.bind(1);
  textureB.setData(imageB);
  program.setUniform('uTextureB', unit);
}

imageB.src = 'assets/non-power-of-two.jpg';

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
  if(isVideoReady) {
    const unit = textureC.bind(2);
    textureC.setData(video);
    program.setUniform('uTextureC', unit);
  }

  gl.drawElements(gl.TRIANGLES, facesBuffer.length, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(tick);
})();
