//Natalie Stephenson
//Dr. Wolff
//Spring 2018: CS 412 Graphics
//PA3: Transformations 
//class for my Gramophone shape!
/*
INSTRUCTIONS:
to rotate speaker bell with the arm that holds it up...press B
to spin the vinyl record...............................press R
to rotate the whole piece..............................press A
to turn the whole piece about the X axis...............press up/down arrows
to turn the whole piece about the Z axis...............press right/left arrows
*/ 

//constructor for Gramophone
let Gramophone = function(){
    //angles that represent new angles caused by user input
    this.baseAngle = 0; 
    this.recordAngle = 0;
    this.bellAngle = 0; 
    this.flip = 0; //for moving the whole shape around the X axis
    this.sideflip = 0; //for moving the whole shape around the Z axis
}

//prototype render function
Gramophone.prototype.render = function(gl, uni, model){

//the base of the gramophone: a cube
    mat4.identity(model);
    mat4.translate(model, model, vec3.fromValues(0 , 0.25, 0)); //sit on origin
    mat4.rotateZ(model, model, this.sideflip); //user move whole around Xaxis
    mat4.rotateX(model, model, this.flip); //user move whole thing around Zaxis
    mat4.rotateY(model, model, this.baseAngle); //rotate based on user's angle
    mat4.rotateX(model, model, Math.PI/2);
    mat4.scale(model, model, vec3.fromValues(2, 2, 0.5));
    
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cube.render(gl, uni, Float32Array.from([0.396,0.263,0.129]));

    //support for the record: a cylinder
    mat4.identity(model);
    mat4.rotateZ(model, model, this.sideflip); //handle user input
    mat4.rotateX(model, model, this.flip);
    mat4.rotateY(model, model, this.baseAngle);
    
    mat4.translate(model, model, vec3.fromValues(0 , 1.0, 0));
  
    mat4.rotateX(model, model, Math.PI/2);
    mat4.scale(model, model, vec3.fromValues(0.25, 0.25, 1.0)); 
   
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cylinder.render(gl, uni, Float32Array.from([0.855,0.439, 0.839]));

    //the vinyl record: a disk
    mat4.identity(model);
    mat4.rotateZ(model, model, this.sideflip); //account for user input
    mat4.rotateX(model, model, this.flip);
    mat4.rotateY(model, model, this.baseAngle);
    mat4.translate(model, model, vec3.fromValues( 0.0, 0.75, 0)); //translates 
    
    mat4.rotateY(model, model, this.recordAngle); //rotate record, user input
    
    mat4.rotateX(model, model, Math.PI/2);
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.disk.render(gl, uni, Float32Array.from([0.33,0.419,0.184 ])); 
   
  
    //acoustic rod supporting the speaker "bell": a cylinder
    mat4.identity(model);
    mat4.rotateZ(model, model, this.sideflip); //user angles
    mat4.rotateX(model, model, this.flip);
    mat4.rotateY(model, model, this.baseAngle); //account for turning of base
    mat4.translate(model, model, vec3.fromValues(-0.85, 1.75, -0.85)); 

    mat4.rotateY(model, model, this.bellAngle); //user's rotation angle
    mat4.rotateX(model, model, Math.PI/2);
    mat4.scale(model, model, vec3.fromValues(0.25, 0.25, 3.0));
   
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cylinder.render(gl, uni, Float32Array.from([0.553,0.553,0.553]));

    
    //for the speaker "bell": a cone
    mat4.identity(model);
    mat4.rotateZ(model, model, this.sideflip);
    mat4.rotateX(model, model, this.flip);
    mat4.rotateY(model, model, this.baseAngle); //account for turning of base
    mat4.translate(model, model, vec3.fromValues(-0.85, 1.75, -0.85)); 
   
    mat4.rotateY(model, model, this.bellAngle); //user's rotation angle
    mat4.rotateY(model, model, Math.PI/4);
    mat4.rotateX(model, model, -Math.PI/8);
    mat4.scale(model, model, vec3.fromValues(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cone.render(gl, uni, Float32Array.from([0.812, 0.710, 0.231]));//draw


    
}