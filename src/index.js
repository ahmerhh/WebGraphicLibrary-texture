import { isPOT } from 'math-functions';

/**
 * @class Texture
 * Represents a WebGL texture wrapper.
 */
export default class Texture {
  /**
   * 3 constructors:
   * (gl, type) creates a 1x1 empty texture.
   * (gl, type, width, height) creates a widthxheight empty texture.
   * (gl, type, data) creates a texture with data.
   *
   * @constructs Texture
   * @param {WebGLRenderingContext} gl - The WebGL context.
   * @param {uint} type - The texture type (e.g., gl.TEXTURE_2D).
   * @param {...any} args - Additional arguments based on the constructor used.
   */
  constructor(gl, type, ...args) {
    this.gl = gl;
    this.type = type;

    this.texture = this.gl.createTexture();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.type, this.texture);

    // Check the number of arguments and call the appropriate method to set texture data.
    if (!args.length) {
      this.setEmptyData(1, 1);
    } else if (args.length === 1 && this.checkData(args[0])) {
      this.setData(args[0]);
    } else if (args.length === 2 && Number.isInteger(args[0]) && Number.isInteger(args[1])) {
      this.setEmptyData(args[0], args[1]);
    }

    this.gl.bindTexture(this.type, null);
  }

  /**
   * @method checkData
   * @private
   * Checks if the provided data is a valid texture data (e.g., image, video, canvas).
   * @param {any} data - The data to be checked.
   * @returns {boolean} - True if the data is valid texture data, otherwise false.
   */
  checkData(data) {
    return (
      data instanceof HTMLImageElement ||
      data instanceof HTMLVideoElement ||
      data instanceof HTMLCanvasElement
    );
  }

  /**
   * @method setEmptyData
   * @public
   * Creates an empty texture with the specified width and height.
   * @param {uint} width - The width of the empty texture.
   * @param {uint} height - The height of the empty texture.
   */
  setEmptyData(width, height) {
    this.width = width;
    this.height = height;
    this.data = null;

    this.gl.texImage2D(
      this.type,
      0,
      this.gl.RGBA,
      this.width,
      this.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null
    );

    if (isPOT(this.width) && isPOT(this.height)) {
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
   * Sets the texture data using the provided HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement.
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} data - The data to set as the texture.
   */
  setData(data) {
    if (!this.checkData(data)) {
      return this.setEmptyData(this.width, this.height);
    }

    this.width = data.width;
    this.height = data.height;
    this.data = data;

    this.gl.texImage2D(this.type, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

    if (isPOT(this.width) && isPOT(this.height)) {
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
   * Binds the texture to the specified texture unit and returns the unit number.
   * @param {uint} unit - The texture unit to bind the texture to.
   * @returns {uint} - The texture unit that the texture is bound to.
   */
  bind(unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.type, this.texture);
    return unit;
  }

  /**
   * @method dispose
   * @public
   * Deletes the texture and releases the associated WebGL resources.
   */
  dispose() {
    this.gl.deleteTexture(this.texture);
    this.texture = null;
  }
}
