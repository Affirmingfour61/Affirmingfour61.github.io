/**
 * This class encapsulates the data and operations needed for rasterizing
 * geometric objects in WebGL. It provides functionality to:
 * 
 * - Define object geometry (vertices, normals, texture coordinates, and indices)
 * - Upload data to the GPU using WebGL buffers
 * - Handle textures for textured rendering
 * - Render the object with support for vertex attributes and uniform data
 * 
 * Usage:
 * 1. Instantiate the class with a WebGL rendering context.
 * 2. Call `create()` to initialize the object's buffers and (optionally) textures.
 * 3. Use `render()` to draw the object with the desired shader program and matrices.
 */
class WebGLGeometryQuad {
    constructor(gl) {
        this.gl = gl;
        this.worldMatrix = new Matrix4();
        this.alpha = 1.0; 
    }

    // -----------------------------------------------------------------------------
    getPosition() {
        // Return a vector4 of this object's world position stored in matrix translation column
        const e = this.worldMatrix.elements;
        return new Vector4(e[3], e[7], e[11], 1);
    }

    // -----------------------------------------------------------------------------
    create(rawImage) {
        const verts = [
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0
        ];

        const normals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0
        ];

        const uvs = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];

        const indices = [0, 1, 2, 2, 1, 3];
        this.indexCount = indices.length;

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        this.texCoordsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        if (rawImage) {
            // 1. create the texture
            this.texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

            // Flip Y for image
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

            // Upload texture image
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, rawImage);

            // Set wrap modes
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

            // Set filtering modes with mipmaps
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

            // Generate mipmaps for trilinear filtering
            this.gl.generateMipmap(this.gl.TEXTURE_2D);

            // Unbind the texture
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    // -----------------------------------------------------------------------------
    render(camera, projectionMatrix, shaderProgram) {
        this.gl.useProgram(shaderProgram);

        const attributes = shaderProgram.attributes;
        const uniforms   = shaderProgram.uniforms;

        // Setup vertex positions
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(attributes.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

        // Setup vertex normals if attribute exists
        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.vertexAttribPointer(attributes.vertexNormalsAttribute, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(attributes.vertexNormalsAttribute);
        }

        // Setup texture coordinates if attribute exists
        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
            this.gl.vertexAttribPointer(attributes.vertexTexcoordsAttribute, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(attributes.vertexTexcoordsAttribute);
        }

        // Bind the index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // Bind texture to texture unit 0 if present
        if (this.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(uniforms.textureUniform, 0);
        }

        // Send uniforms
        this.gl.uniformMatrix4fv(uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
        this.gl.uniformMatrix4fv(uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
        this.gl.uniformMatrix4fv(uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);
        this.gl.uniform1f(uniforms.alphaUniform, this.alpha);

        // Draw triangles
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

        // Unbind texture if bound
        if (this.texture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }

        // Disable vertex attribute arrays
        this.gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1)
            this.gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);
        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1)
            this.gl.disableVertexAttribArray(attributes.vertexTexcoordsAttribute);
    }
}
