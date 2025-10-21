'use strict';

let gl;

let appInput = new Input();
let time = new Time();
let camera = new Camera(appInput);
const assetLoader = new AssetLoader();

let lineGrid = null;
let triangleGeometry = null;

let projectionMatrix = new Matrix4();

// The shader that will be used by each piece of geometry
let colorProgram;

// Auto-start the app when the HTML page is ready
window.onload = window['initializeAndStartRendering'];

// List of assets to load
const assetList = [
    { name: 'unlitColorVS', url: './shaders/color.unlit.vs.glsl', type: 'text' },
    { name: 'unlitColorFS', url: './shaders/color.unlit.fs.glsl', type: 'text' }
];

// -------------------------------------------------------------------------
// Initializes WebGL, loads assets, and starts the render loop
async function initializeAndStartRendering() {
    // Get access to the WebGL API (i.e. gl) via the canvas
    gl = getWebGLContext();
    if (!gl) return;

    // load the assets in the list and waits for the process to complete
    await assetLoader.loadAssets(assetList);
    if (!assetLoader.assets.unlitColorVS || !assetLoader.assets.unlitColorFS) {
        console.error("Critical shaders not loaded. Aborting app startup.");
        return;
    }

    createShaders();
    createScene();

    // Kick off the render loop
    updateAndRender();
}

// -------------------------------------------------------------------------
// Creates shader programs using the loaded shader source code
function createShaders() {
    // Get access to the raw shader code text for each shader
    const unlitColorVS = assetLoader.assets.unlitColorVS;
    const unlitColorFS = assetLoader.assets.unlitColorFS;

    // Compile and link the shader pair into a complete "program"
    colorProgram = createCompiledAndLinkedShaderProgram(gl, unlitColorVS, unlitColorFS);
    if (!colorProgram) return;

    // Get and store references to vertex data attributes (i.e. named identifiers) in the shader
    colorProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(colorProgram, "aVertexPosition"),
        vertexColorsAttribute: gl.getAttribLocation(colorProgram, "aVertexColor")

        /* Todo #11 vertexColorsAttribute: ? */

        // Inside of createShaders, use getAttribLocation to get 
        // and store a reference to aVertexColor in a property 
        // named vertexColorsAttribute as part of colorProgram.attributes.




    };

    // Verify we found the attribute. 
    if (colorProgram.attributes.vertexPositionAttribute === -1) 
        console.warn("Attribute 'aVertexPosition' not found or unused in the shader.");

    // Todo #11 verify you found the color attribute
    
    // Get and store references to uniforms (i.e.constant, global data that doesn't change while an object renders)
    colorProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(colorProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(colorProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(colorProgram, "uProjectionMatrix"),
    };

    gl.useProgram(colorProgram);
}

// -------------------------------------------------------------------------
// Creates the scene geometry and sets up world matrices
function createScene() {
    lineGrid = new WebGLGeometryGrid(gl);
    lineGrid.create(10);

    triangleGeometry = new WebGLGeometryTriangle(gl);
    triangleGeometry.create();

    // Until camera.js is fully implemented, we have to manually set the camera's world matrix
    camera.cameraWorldMatrix.makeTranslation(0, 0, 10);

    // After camera.js is implemented, the correct way to do the above is
    // camera.cameraPosition = new Vector3(0, 0, 10);
   
}

// -------------------------------------------------------------------------
// The main render loop; updates and renders the scene
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    // Update our clock measurements to account for time
    time.update();

    // Update our camera based on input and the amount of time that has passed
    
    camera.update(time.deltaTime);
    
    
//DID THIS PART TWO
    gl.clearColor(0.707, 0.707, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    checkGLError(gl, "After gl.clear");
    
//DID THIS PART THREE
     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    checkGLError(gl, "After gl.viewport");

//DID THIS PART THREE
    let aspectRatio = gl.canvasWidth / gl.canvasHeight; 
     projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

//   lineGrid.render(camera, projectionMatrix, colorProgram);
//     checkGLError(gl, "After rendering the line grid");

   let rotationSpeed = 50.0; // adjust this number for faster or slower rotation
let angle = time.secondsElapsedSinceStart * rotationSpeed;
let rotationMatrix = new Matrix4();
rotationMatrix.makeRotationY(angle);
triangleGeometry.worldMatrix = rotationMatrix;

    // ----------------------------------------------

    triangleGeometry.render(camera, projectionMatrix, colorProgram);
    checkGLError(gl, "After rendering the triangle");
}
