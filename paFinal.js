/**
 * Natalie Stephenson
 * Emma Poffenberger
 *  Graphics CS 412 - Spring 2018 Dr. Wolff 
 * 
 */

// The WebGL object
var gl;

// The HTML canvas
var canvas;

var grid;    // The reference grid
var axes;    // The coordinate axes
var camera;  // The camera

// Natalie's addition:
// variable of light position
var lightpos = vec3.fromValues(3,2,4); 
var lumosPos = vec3.create();

// variable representing which maze we are loading
var mazeNum = 1; 
var mazeArray = [];
var win = false;
var flag = true;
var flag2 = true;
var count = 0;
var a = false;

// Uniform variable locations
var uni = {
    uModel: null,
    uView: null,
    uProj: null,
    uColor: null
};

/**
 * Initialize the WebGL context, load/compile shaders, and initialize our
 * shapes.
 */
var init = function() {
    
    // Set up WebGL
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Set the viewport transformation
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set the background color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    
    // Enable the z-buffer
    gl.enable(gl.DEPTH_TEST);
    
    // allows canvas image to show
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // Load and compile shaders
    program = Utils.loadShaderProgram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Find the uniform variable locations
    uni.uModel = gl.getUniformLocation(program, "uModel");
    uni.uView = gl.getUniformLocation(program, "uView");
    uni.uProj = gl.getUniformLocation(program, "uProj");
    uni.uColor = gl.getUniformLocation(program, "uColor");

    // Natalie's additions
    // uniform vec3 uEmissive; // Emitted intensity
    // uniform vec3 uAmbient; // Ambient
   // uniform vec3 uDiffuse; // Diffuse reflectivity (Kd)
   // uniform vec3 uSpecular; // Specular reflectivity (Ks)
   // uniform float uShine; // Specular exponent (f)
   uni.uEmissive = gl.getUniformLocation(program, "uEmissive");
   uni.uAmbient = gl.getUniformLocation(program, "uAmbient");
   uni.uDiffuse = gl.getUniformLocation(program, "uDiffuse");
   uni.uSpecular = gl.getUniformLocation(program, "uSpecular");
   uni.uShine = gl.getUniformLocation(program, "uShine");

   //uniform vec3 uLightPos; // Light position (camera coords)
   //uniform vec3 uLightIntensity; // Light intensity
   //uniform vec3 uAmbientLight; // Intensity of ambient light
   uni.uLightIntensity = gl.getUniformLocation(program, "uLightIntensity");
   uni.uAmbientLight = gl.getUniformLocation(program, "uAmbientLight");
   uni.uLightPos = gl.getUniformLocation(program, "uLightPos"); 
   // set default values of ambient and light intensity
   gl.uniform3fv(uni.uLightIntensity, vec3.fromValues(1,1,1));
   gl.uniform3fv(uni.uAmbientLight, vec3.fromValues(1, 1, 1));

  // uniform bool uHasDiffuseTex; //whether or not we're using a texture
  // uniform sampler2D uDiffuseTex; //the diffuse texture
  uni.uHasDiffuseTex = gl.getUniformLocation(program, "uHasDiffuseTex");
  uni.uDiffuseTex = gl.getUniformLocation(program, "uDiffuseTex"); 

    gl.uniform1i(uni.uDiffuseTex, 0); // set to 0
    
    // Initialize our shapes
    Shapes.init(gl);
    grid = new Grid(gl, 20.0, 20, Float32Array.from([0.7,0.7,0.7]));
    axes = new Axes(gl, 2.5, 0.05);

    // Initialize the camera
    camera = new Camera( canvas.width / canvas.height );
    camera.lookAt(vec3.fromValues(-10.4,.7,-1), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0) );  
    setupEventHandlers();

    // Start the animation sequence
    Promise.all( [
        // load textures
        Utils.loadTexture(gl, "media/hedge3.jpg"),
        Utils.loadTexture(gl, "media/grass1.jpg"),
        Utils.loadTexture(gl, "media/sky3.jpg"),
        Utils.loadTexture(gl, "media/stone1.jpg"),
        Utils.loadTexture(gl, "media/blackCrystal1.png"),
        Utils.loadTexture(gl, "media/blueCrystal1.jpg"),
        Utils.loadTexture(gl, "media/crystal1.jpg"),
        Utils.loadTexture(gl, "media/avadakedavra.jpg" )
    ]).then( function(values) {
        // put into Textures
        Textures["hedge3.jpg"] = values[0]; 
        Textures["grass1.jpg"] = values[1];
        Textures["sky3.jpg"]   = values[2];
        Textures["stone1.jpg"] = values[3];
        Textures["blackCrystal1.jpg"] = values[4];
        Textures["blueCrystal1.jpg"] = values[5];
        Textures["crystal1.jpg"] = values[6];
        Textures["avadakedavra.jpg"] = values[7];
        
       render();
    });
};

/**
 * Render the scene!
 */
var render = function() {
    // Request another draw
    window.requestAnimFrame(render, canvas);

    // Update camera when in fly mode
    updateCamera();
    if( a === true ){
        drawLights(gl, uni );
    }

    // Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set projection and view matrices
    gl.uniformMatrix4fv(uni.uView, false, camera.viewMatrix());
    gl.uniformMatrix4fv(uni.uProj, false, camera.projectionMatrix());

    //drawAxesAndGrid();
    drawScene();
};

/**
 * Draw the objects in the scene.
 */
var drawScene = function() {
    let model = mat4.create();

    // a Lord Voldemort cube! (voldyCube!)
/*
 * mat4.identity(model); let voldyMaterial = new Material();
 * //voldyMaterial.diffuseTexture = "voldy.png"; mat4.scale(model, model,
 * vec3.fromValues(3, 1, 1)); mat4.fromTranslation(model, vec3.fromValues(-3, 1,
 * 1.5)); gl.uniformMatrix4fv(uni.uModel, false, model); //
 * Shapes.cube.render(gl, uni, voldyMaterial);
 * 
 * 
 * //a blank disk! let bMaterial = new Material(); bMaterial.diffuse =
 * vec3.fromValues(0,0,1); bMaterial.specular = vec3.fromValues(1,1,1);
 * bMaterial.shine = 100.0; mat4.fromTranslation(model,
 * vec3.fromValues(2.0,1.0,0.75)); gl.uniformMatrix4fv(uni.uModel, false,
 * model); // Shapes.disk.render(gl, uni, bMaterial);
 * 
 */
    
    // draw the grass on the ground
   	let grassModel = mat4.create();
   	let grassTexture = new Material();
   	grassTexture.diffuseTexture = "grass1.jpg";
   	mat4.fromTranslation(grassModel, vec3.fromValues(0,0,0)); 
   	mat4.scale(grassModel, grassModel, vec3.fromValues(5, 5, 5));
   	gl.uniformMatrix4fv(uni.uModel, false, grassModel);
    Shapes.quad.render(gl, uni, grassTexture );
      

    //draw the trophy pedestal
    let m = mat4.create(); 
    let pedestalTex = new Material();
    pedestalTex.diffuseTexture = "stone1.jpg";
    mat4.fromTranslation(m, vec3.fromValues(7.5,0.1,-7.25));
    mat4.scale(m, m, vec3.fromValues(0.5, 0.25, 0.5))
    //pedestalTex.diffuse = vec3.fromValues(0.855,0.929,0.937); 
    pedestalTex.diffuse = vec3.fromValues(0, 0, 1);
    pedestalTex.emissive = vec3.fromValues(0.5,0.5,0.5);
    gl.uniformMatrix4fv(uni.uModel, false, m);
    Shapes.cube.render(gl, uni, pedestalTex);


    mat4.identity(model);
    let cupTex = mat4.create();
    //cupTex.diffuseTexture = "crystal1.jpg";
    Shapes.TriwizardCup.render(gl, uni, cupTex );

    //Lord Voldemort
    let s = mat4.create(); 
	let voldyTex = new Material();
	voldyTex.diffuseTexture = "avadakedavra.jpg";
	mat4.fromTranslation(s, vec3.fromValues(0, -8, 0));
	mat4.scale(s, s, vec3.fromValues(0.3,  10, 17))
	//pedestalTex.diffuse = vec3.fromValues(0.855,0.929,0.937); 
	//voldyTex.diffuse = vec3.fromValues(0, 0, 1);
	//voldyTex.emissive = vec3.fromValues(0.5,0.5,0.5);
	gl.uniformMatrix4fv(uni.uModel, false, s);
	Shapes.cube.render(gl, uni, voldyTex);
	
	// material for the light cube
    let modelone = mat4.create(); 
    let moonMaterial = new Material(); 
    moonMaterial.emissive = vec3.fromValues(1,1,1);
    mat4.fromTranslation(modelone,  lightpos); 
    mat4.scale(modelone, modelone, vec3.fromValues(0.55, 0.55, 0.55));
    mat4.fromTranslation(modelone, vec3.fromValues( 6, 8, 13 ) );
    gl.uniformMatrix4fv(uni.uModel, false, modelone);
    Shapes.disk.render(gl, uni, moonMaterial);
	
	if( win === true ){
		if( flag = true && count < 150 ){
			camera.turn( 70, 0 );
			count++;
		}else{
			flag = false;
			if( flag2 === true ){
				camera.reset();
				camera.eye =vec3.fromValues( 7.3, -8, 0 ); 
				camera.turn( 305, 0 );
				flag2 = false
			}
		}

	}
    initMaze(); 
    drawMaze(gl, uni);
};

/**
 * Draws the reference grid and coordinate axes.
 */
var drawAxesAndGrid = function() {
    // Set model matrix to identity
    gl.uniformMatrix4fv(uni.uModel, false, mat4.create());
    // Draw grid
    grid.render(gl,uni);
    // Draw Axes
    axes.render(gl,uni);
};

 
/**
 * Draws the light source cube
 */
var drawLights = function( gl, uni  ){
	while( a === false ){
		lightPos = camera.eye;
		// Lumos Cube to follow the camera pos:  
		let modeltwo = mat4.create();
		let mat = new Material();
		mat.emissive = vec3.fromValues(.05,.05,.05);
		mat4.fromTranslation(modeltwo, lumosPos);   
		mat4.scale(modeltwo, modeltwo, vec3.fromValues(1.25, 1.25, 1.25));
		let camCoord = vec3.transformMat4( vec3.create(), lightpos, camera.viewMatrix());
		gl.uniform3fv( uni.uLightPos, camCoord);
		gl.uniformMatrix4fv(uni.uModel, false, modeltwo);
		Shapes.cube.render(gl, camera.eye, mat);
	}
	

};
// whenever the camera enters the danger zone, call switchMaze
var switchMaze = function(){
    if(mazeNum ===1){
        mazeNum = 2; 
    }
    else if(mazeNum ===2){
        mazeNum = 3; 
    }
    else if(mazeNum ===3){
        mazeNum = 1;

    }
    console.log("New maze number: "+ mazeNum);
};

var initMaze = function(){
     
    if(this.mazeNum === 1){
        
        // basic data for the maze. iterate through this to init mazebuild
        mazeArray = [
           [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1], // 0
           [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1],// 1
           [1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,1],// 2 etc.
           [1,1,0,0,1,0,0,1,1,1,1,1,1,0,1,0,1,0,0,1],
           [1,1,0,0,1,1,0,1,0,1,0,0,1,0,1,0,0,0,0,1],
           [1,1,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,1,0,1],
           [1,1,0,1,0,1,0,1,1,0,1,0,0,0,1,0,0,0,1,1],
           [1,1,0,1,1,1,0,0,0,0,1,0,1,1,1,0,0,0,1,1],
           [1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,1,0,0,1],
           [1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1,1],
           [1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
           [1,1,0,1,0,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1],
           [1,1,0,1,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,1],
           [1,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1],
           [1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,0,0,1],
           [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
           [1,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1],
           [1,1,0,0,1,0,0,0,1,1,0,1,0,1,1,1,1,0,1,1],
           [1,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
           [1,1,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1],
           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]        
       ];
                // console.log(mazeArray);
    }
    else if(mazeNum === 2){
       mazeArray = [
           [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
           [1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,1,0,1],
           [1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,0,0,1],
           [1,0,1,0,0,0,1,1,1,1,0,0,0,1,0,1,0,1,0,1],
           [1,0,1,1,1,0,0,0,0,1,1,1,1,1,0,1,0,1,1,1],
           [1,0,1,0,1,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1],
           [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1],
           [1,1,0,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,1],
           [1,1,0,0,0,1,1,1,1,0,1,1,0,1,1,1,1,0,0,1],
           [1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,1,1,0,1],
           [1,1,0,0,0,0,0,1,1,1,1,0,1,0,1,0,1,1,0,1],
           [1,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1],
           [1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
           [1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,1],
           [1,1,0,1,1,0,0,0,0,1,1,1,1,0,1,1,1,0,1,1],
           [1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,1],
           [1,1,0,0,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,1],
           [1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,1,0,1],
           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    
    }
    else if(mazeNum ===3){
         mazeArray =[
             [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1], 
             [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1] ,
             [1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1] ,
             [1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,0,0,0,1,1],
             [1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1],
             [1,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,1],
             [1,1,0,0,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1,0,1],
             [1,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,1],
             [1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1],
             [1,1,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1],
             [1,0,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,0,1],
             [1,0,0,1,0,1,1,1,0,0,0,0,0,0,1,0,1,1,1,1],
             [1,0,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1,1,1,1],
             [1,1,1,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1,1],
             [1,1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,1,0,1,1],
             [1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,0,1],
             [1,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,1,0,1,1],
             [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1],
             [1,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
         ];
    };
};

var drawMaze = function(gl, uni){
    let modelone = mat4.create(); 

    let hedgeMaterial = new Material(); // can add texture later
 
    let x = -10; 
    let y = 0.5; 
    let z = -10; 
    for(let i=0; i<21; i++){
    	for(let j = 0; j<21; j++){
    		if(mazeArray[j][i] === 1){
    			mat4.fromTranslation(modelone,  vec3.fromValues(x, y, z)); 
    			mat4.scale(modelone, modelone, vec3.fromValues(1.0, 1.0, 1.0));
    			gl.uniformMatrix4fv(uni.uModel, false, modelone);
    			hedgeMaterial.diffuseTexture = "hedge3.jpg";
    			// console.log( "I get to the texture for the maze")
    			Shapes.cube.render(gl, uni, hedgeMaterial);
    			// console.log(j + ", " + i);
    		}
    		if(((x+1)>10)){
    			x = -10; 
    		}else{ x = x+1; }
    	}
        z = z+1; 
    }
};

// ////////////////////////////////////////////////
// Event handlers
// ////////////////////////////////////////////////

/**
 * An object used to represent the current state of the mouse.
 */
mouseState = {
    prevX: 0,     // position at the most recent previous mouse motion event
    prevY: 0, 
    x: 0,          // Current position
    y: 0,      
    button: 0,     // Left = 0, middle = 1, right = 2
    down: false,   // Whether or not a button is down
    wheelDelta: 0  // How much the mouse wheel was moved
};
var cameraMode = 0;          // Mouse = 0, Fly = 1
var downKeys = new Set();    // Keys currently pressed
var lCounter = 0;
//var isOn = false

var setupEventHandlers = function() {
    let modeSelect = document.getElementById("camera-mode-select");    
    
    // Disable the context menu in the canvas in order to make use of
    // the right mouse button.
    canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    modeSelect.addEventListener("change", 
        function(e) {
            let val = e.target.value;
            if( val === "0" )
                cameraMode = 0;
            else if( val === "1" ) 
                cameraMode = 1;
        }
    );
    

    canvas.addEventListener("mousemove", 
        function(e) {
            if( mouseState.down ) {
                mouseState.x = e.pageX - this.offsetLeft;
                mouseState.y = e.pageY - this.offsetTop;
                mouseDrag();
                mouseState.prevX = mouseState.x;
                mouseState.prevY = mouseState.y;
            }
        });
    canvas.addEventListener("mousedown", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;    
        mouseState.down = true;
        mouseState.prevX = mouseState.x;
        mouseState.prevY = mouseState.y;
        mouseState.button = e.button;
        mouseDrag();
    } );
    canvas.addEventListener("mouseup", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;
        mouseState.down = false;
        mouseState.prevX = 0;
        mouseState.prevY = 0;
    } );
    canvas.addEventListener("wheel", function(e) {
        e.preventDefault();
        mouseState.wheelDelta = e.deltaY;
        if( cameraMode === 1 ){
        	camera.dolly( mouseState.wheelDelta );
        }
        
    } );
    document.addEventListener("keydown", function(e) {
        downKeys.add(e.code);
        console.log(e.code);
    });
    document.addEventListener("keyup", function(e) {
      if( e.code === "KeyL"){
        	lCounter = lCounter + 1;
        	if( lCounter === 1 ){
				// turn light on
			}else if( lCounter === 2 ){
				// turn light off
				lCounter = 0;
			}
        } 	
        downKeys.delete(e.code);
    });
};

var theta = 0; 

/**
 * Check the list of keys that are currently pressed (downKeys) and update the
 * camera appropriately. This function is called from render() every frame.
 */
var updateCamera = function() {
	if( win === false ){
		// Cedric Camera Mode
		let currentPos = vec3.create(); 
		vec3.copy(currentPos, camera.eye); // save current location of camera
		if( cameraMode === 0 || cameraMode === 1 ){
			// Dolly
			if( downKeys.has("KeyW") || downKeys.has("ArrowUp") ){
				camera.dolly( 1 );
			} else if( downKeys.has("KeyS") || downKeys.has("ArrowDown") ){
	    		camera.dolly( -1 );
			} 
			// Track Left/Right
			else if( downKeys.has("KeyA") || downKeys.has("ArrowLeft") ){
				camera.track( 1, 0 );
			} else if( downKeys.has("KeyD") || downKeys.has("ArrowRight") ){
				camera.track( -1, 0 );
			}
       
			let threshold = 1.0; 
			let target = vec3.fromValues(0,0,8);
			checkSwitchMaze(target, currentPos, threshold);
			target = vec3.fromValues(-4, 0, -6);
			checkSwitchMaze(target, currentPos, threshold);
			target = vec3.fromValues(2,0,-8);
			checkSwitchMaze(target, currentPos, threshold);
			target=vec3.fromValues(8,0,-5); 
			checkSwitchMaze(target, currentPos, threshold);
        
			checkWin( currentPos );
			
			
		}
	}
	if( downKeys.has("Space") ) {
		win = false;
		flag = true;
		flag2 = true;
		count = 0;
		camera.reset();
	}
};
var checkSwitchMaze = function(target, currentPos, threshold){
     // if(currentPos dist to target > threshold) && camera.eye's dist to
		// target<threshold)
        // switch the maze because we've just crossed into a danger spot
    // let target = vec3.fromValues(0,0, 8); //first danger spot
    // distance between old position and danger spot
    let oldD = Math.sqrt(Math.pow((currentPos[0] - target[0]), 2) + 
         Math.pow((currentPos[2] - target[2]),2)
        + Math.pow((currentPos[1] - target[1]), 2) ); 
    // distance between new position and danger spot
    let newD =Math.sqrt(Math.pow((camera.eye[0] - target[0]), 2) + 
             Math.pow((camera.eye[2] - target[2]),2)
            + Math.pow((camera.eye[1] - target[1]), 2));
 
    if((oldD > threshold) && (newD < threshold)){
        console.log("switched your maze!");
        switchMaze(); 
    }

}

var checkWin = function( currentPos ){
	// check to see if near the win circle and if so set win to true
	// else keep win false
	// ped location vec3.fromValues(7.5,0.1,-7.25)
	var thresh = .7;
	var tar = vec3.fromValues(7.5,0.1,-7.25);

    let oldD = Math.sqrt(Math.pow((currentPos[0] - tar[0]), 2) + 
            Math.pow((currentPos[2] - tar[2]),2)
           + Math.pow((currentPos[1] - tar[1]), 2) ); 
       // distance between new position and danger spot
       let newD =Math.sqrt(Math.pow((camera.eye[0] - tar[0]), 2) + 
                Math.pow((camera.eye[2] - tar[2]),2)
               + Math.pow((camera.eye[1] - tar[1]), 2));
    
       if((oldD > thresh) && (newD < thresh)){
           console.log("YOU WIN!");
           win = true;
       }
}

/**
 * Called when a mouse motion event occurs and a mouse button is currently down.
 */
var mouseDrag = function () {
	// Editing Camera Mode
	if( cameraMode === 1 ){
		// Track
		if( mouseState.button === 2 & mouseState.down === true ){
			camera.track( mouseState.prevX - mouseState.x, mouseState.prevY - mouseState.y);
		} 
		// Orbit
		else if ( mouseState.button === 0 & mouseState.down === true ){
			camera.orbit( (mouseState.prevX - mouseState.x), (mouseState.prevY - mouseState.y) );
		}
	} 
	else if( cameraMode === 0 ) {
		// Turn - Left Click and Drag

	      if( mouseState.button === 0 & mouseState.down === true ){
	    	  camera.turn((mouseState.prevX - mouseState.x), (mouseState.prevY - mouseState.y) );
	      }
	}
	
};

// When the HTML document is loaded, call the init function.
window.addEventListener("load", init);