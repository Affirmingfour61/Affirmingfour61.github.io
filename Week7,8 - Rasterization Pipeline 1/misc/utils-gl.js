// -------------------------------------------------------------------------
// Initialize and return the WebGL context
function getWebGLContext() {
    // DID THIS TODO 1

     let canvasID = "webgl-canvas";
    let canvas = document.getElementById(canvasID);
    let gl;

    try {
        gl = canvas.getContext("webgl", { alpha: false });

        // Store canvas dimensions
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        return gl;
    } catch (e) {
        console.error('Failed to initialize WebGL:', e);
    }

    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
    }

    return null;
}


// -----------------------------------------------------------------------------
function createCompiledAndLinkedShaderProgram(gl, vertexShaderText, fragmentShaderText) {
    // Compile each shader from their source code
    const vertexShader = createCompiledShader(gl, vertexShaderText, gl.VERTEX_SHADER);
    const fragmentShader = createCompiledShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
        console.error('Failed to compile shaders.');
        return null;
    }
    
    // Create a new shader program object, set the shaders that belong it, and link them
    // DID THIS TODO FIVE 
    const shaderProgram = gl.createProgram(); 
    // 2) Attach the compiled vertex shader
    gl.attachShader(shaderProgram, vertexShader);
    // 3) Attach the compiled fragment shader
    gl.attachShader(shaderProgram, fragmentShader);
    // 4) Link the shaders in the program
    gl.linkProgram(shaderProgram);
    
    // Ensure that linking was successful
    try {
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(shaderProgram);
            console.error('Program linking failed:', error);
            gl.deleteProgram(shaderProgram);
            return null;
        }
        return shaderProgram;
    } catch (error) {
        console.warn('Unable to link shaders');
        return null;
    }
}

// -------------------------------------------------------------------------
function createCompiledShader(gl, shaderText, shaderType) {
//DID THIS TODO FOUR
     const shader = gl.createShader(shaderType); 
    // 2) Attach the Shader Source Code
    gl.shaderSource(shader, shaderText);
    // 3) Compile the Shader
    gl.compileShader(shader);

    try {
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Shader compilation failed:', error);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    catch(e) {
        console.warn("Unable to compile shader");

    }
}

// -------------------------------------------------------------------------
function checkFrameBufferStatus(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch(status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            console.log('Framebuffer incomplete: attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            console.log('Framebuffer incomplete: missing attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            console.log('Framebuffer incomplete: dimensions');
            break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            console.log('Framebuffer unsupported');
            break;
        default:
            // Framebuffer is complete
            break;
    }
}

// -------------------------------------------------------------------------
function checkGLError(gl, label) {
    const error = gl.getError();
    if (error !== gl.NO_ERROR) 
        console.error(`[GL ERROR] ${label}:`, error);
}
