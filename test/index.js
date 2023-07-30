import test from 'tape';
import getGl from '@ahmerhh/WebGraphicLibrary-context';
import Texture from '../src';

function loadImage(src) {
  return new Promise((res, rej) => {
    const image = document.createElement('img');
    image.onload = res.bind(res, image);
    image.onerror = rej;
    image.src = src;
  });
}

Promise.all([
  loadImage('assets/non-power-of-two.jpg'),
  loadImage('assets/power-of-two.jpg')
]).then(imgs => {
  const [nonPowerOfTwoImg, powerOfTwoImg] = imgs;

  const canvas = document.createElement('canvas');
  const gl = getGl(canvas);

  test('should be instanciable', t => {
    t.plan(1);

    const texture = new Texture(gl, gl.TEXTURE_2D);

    t.ok(texture instanceof Texture, 'instance of Texture');
  });

  test('should accept no size and no data', t => {
    t.plan(3);

    const texture = new Texture(gl, gl.TEXTURE_2D);

    t.equal(texture.width, 1, 'width is 1');
    t.equal(texture.height, 1, 'height is 1');
    t.equal(texture.data, null, 'data is null');
  });

  test('should accept size and no data', t => {
    t.plan(3);

    const texture = new Texture(gl, gl.TEXTURE_2D, 1024, 512);

    t.equal(texture.width, 1024, 'width is 1024');
    t.equal(texture.height, 512, 'height is 512');
    t.equal(texture.data, null, 'data is null');
  });

  test('should accept power of two data', t => {
    t.plan(3);
    t.timeoutAfter(5000);

    const texture = new Texture(gl, gl.TEXTURE_2D, powerOfTwoImg);

    t.equal(texture.width, powerOfTwoImg.width, `width is ${powerOfTwoImg.width}`);
    t.equal(texture.height, powerOfTwoImg.height, `height is ${powerOfTwoImg.height}`);
    t.equal(texture.data, powerOfTwoImg, 'data ok');
  });

  test('should accept non power of two data', t => {
    t.plan(3);
    t.timeoutAfter(5000);

    const texture = new Texture(gl, gl.TEXTURE_2D, nonPowerOfTwoImg);

    t.equal(texture.width, nonPowerOfTwoImg.width, `width is ${nonPowerOfTwoImg.width}`);
    t.equal(texture.height, nonPowerOfTwoImg.height, `height is ${nonPowerOfTwoImg.height}`);
    t.equal(texture.data, nonPowerOfTwoImg, 'data ok');
  });

  test('should expose the WebGLTexture object', t => {
    t.plan(1);

    const texture = new Texture(gl, gl.TEXTURE_2D);

    t.ok(texture.texture instanceof WebGLTexture, 'instance of WebGLTexture');
  });

  test('should bind the texture to the unit provided', t => {
    t.plan(4);

    const textureA = new Texture(gl, gl.TEXTURE_2D);
    const textureB = new Texture(gl, gl.TEXTURE_2D);

    textureA.bind(0);
    t.equal(gl.getParameter(gl.ACTIVE_TEXTURE), gl.TEXTURE0, 'active texture is 0');
    t.equal(gl.getParameter(gl.TEXTURE_BINDING_2D), textureA.texture, 'binded texture ok');

    textureB.bind(2);
    t.equal(gl.getParameter(gl.ACTIVE_TEXTURE), gl.TEXTURE2, 'active texture is 2');
    t.equal(gl.getParameter(gl.TEXTURE_BINDING_2D), textureB.texture, 'binded texture ok');
  });

  test('should delete the texture when disposed', t => {
    t.plan(1);

    const texture = new Texture(gl, gl.TEXTURE_2D);
    texture.dispose();

    t.equal(texture.texture, null, 'texture is null');
  });

  test.onFinish(() => window.close());
});
