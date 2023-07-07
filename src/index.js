import { isPOT } from 'math-functions';

/**
 * @class Texture
 */
export default class Texture {
  /**
   * 3 constructors:
   * (gl, type) creates a 1x1 empty texture.
   * (gl, type, width, height) creates a widthxheight empty texture.
   * (gl, type, data) creates a texture with data
   *
   * @constructs Texture
   * @param {WebGLRenderingContext} gl
   * @param {uint} type
   * @param {...any} args
   */
  constructor(gl, type, ...args) {
    this.gl = gl;
    this.type = type;

    this.texture = this.gl.createTexture();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.type, this.texture);

    if(!args.length) {
      this.setEmptyData(1, 1);
    } else if(args.length === 1 && this.checkData(args[0])) {
      this.setData(args[0]);
    } else if(args.length === 2 && Number.isInteger(args[0]) && Number.isInteger(args[1])) {
      this.setEmptyData(args[0], args[1]);
    }

    this.gl.bindTexture(this.type, null);
  }

  /**
   * @method checkData
   * @private
   * @param {any} data
   * @returns {boolean}
   */
  checkData(data) {
    return data instanceof HTMLImageElement
      || data instanceof HTMLVideoElement
      || data instanceof HTMLCanvasElement;
  }

  /**
   * @method setEmptyData
   * @public
   * @param {uint} width
   * @param {uint} height
   */
  setEmptyData(width, height) {
    this.width = width;
    this.height = height;
    this.data = null;

    this.gl.texImage2D(this.type, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    if(isPOT(this.width) && isPOT(this.height)) {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    } else {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    }
  }

  /**
   * @method setData
   * @public
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} data
   */
  setData(data) {
    if(!this.checkData(data)) {
      return this.setEmptyData(this.width, this.height);
    }

    this.width = data.width;
    this.height = data.height;
    this.data = data;

    this.gl.texImage2D(this.type, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

    if(isPOT(this.width) && isPOT(this.height)) {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
      this.gl.generateMipmap(this.type);
    } else {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    }
  }

  /**
   * @method bind
   * @public
   * @param {uint} unit
   * @returns {uint}
   */
  bind(unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.type, this.texture);
    return unit;
  }

  /**
   * @method dispose
   * @public
   */
  dispose() {
    this.gl.deleteTexture(this.texture);
    this.texture = null;
  }
}
