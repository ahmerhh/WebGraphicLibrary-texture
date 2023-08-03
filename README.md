# GL Texture

WebGL texture wrapper.

WebGraphicLibrary texture is a WebGL texture wrapper that simplifies the creation and management of textures for use in WebGL applications

## Installation

```sh
$ npm install --save @ahmerhh/WebGraphicLibrary-texture
```

## Usage

```js
import Texture from '@ahmerhh/WebGraphicLibrary-texture';

const texture = new Texture(gl, gl.TEXTURE_2D);

const img = document.createElement('img');

img.onload = () => {
	texture.bind(1);
	texture.setData(img);
}

img.src = '';

program.bind();
program.setUniform('uTexture', texture.bind(1));
```

## API

#### `texture = new Texture(gl, type)`
#### `texture = new Texture(gl, type, width, height)`
#### `texture = new Texture(gl, type, data)`

Create a new texture, if no `data` is provided, the texture is empty.
- `gl` is the [WebGL context](https://github.com/ahmerhh/WebGraphicLibrary-context).
- `type` is the texture type. Default is `gl.TEXTURE_2D`.
- `data` can be an image, video or canvas.

#### `texture.setData(data)`

Set the texture data. The texture must be bound first.

```js
texture.bind(1);
texture.setData(image);
```

#### `texture.bind(unit)`

Bind the texture to the given unit, and returns it. Default is `0`.
This allows to set a [program](https://github.com/ahmerhh/WebGraphicLibrary-Program) uniform at the same time.

```js
program.setUniform('uTextureA', textureA.bind(0));
program.setUniform('uTextureB', textureA.bind(1));
```

#### `texture.dispose()`

Delete instance. Calls `gl.deleteTexture()`.

## License

MIT, see [LICENSE.md](https://github.com/ahmerhh/WebGraphicLibrary-texture/blob/master/LICENSE.md) for more details.

## Credits

Thanks to the amazing [stackgl](http://stack.gl/) for the inspiration.
