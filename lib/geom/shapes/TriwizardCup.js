//TriwizardCup.js

let TriwizardCup = function(){


}


TriwizardCup.prototype.render = function(gl, uni, model){



    //draw the base of the cup
    mat4.identity(model);
    let baseMat = new Material();
    baseMat.diffuseTexture = "blackCrystal1.png";
    baseMat.emissive = vec3.fromValues(0.5, 0.5, 0.5);
    mat4.fromTranslation(model, vec3.fromValues(7.5, 0.3, -7.25));
   
    mat4.scale(model, model, vec3.fromValues(0.25, 0.05, 0.25));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cube.render(gl, uni, baseMat);


    //draw the stem of the cup
    mat4.identity(model);
    let stemMat = new Material();
    stemMat.diffuseTexture = "blueCrystal1.jpg";
    //stemMat.emissive = vec3.fromValues(0.5, 0.5, 0.5);
    //stemMat.diffuse = vec3.fromValues(0,0,1);
    mat4.fromTranslation(model, vec3.fromValues(7.5, 0.5, -7.25));
    mat4.rotateX(model, model, Math.PI/2);
    mat4.scale(model, model, vec3.fromValues(0.10, 0.10, 0.5));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cylinder.render(gl, uni, stemMat);

    //draw the main cup part: a cylinder
    mat4.identity(model);
    let cupMat = new Material();
    cupMat.diffuseTexture = "crystal1.jpg";
    //cupMat.diffuse = vec3.fromValues(0, 0,1);
    //cupMat.emissive = vec3.fromValues(0.2, 0.2, 0.2);

    mat4.fromTranslation(model, vec3.fromValues(7.5, 0.6, -7.25));
    mat4.rotateX(model, model, Math.PI/2);
    mat4.scale(model, model, vec3.fromValues(0.4, 0.4, 0.3));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cylinder.render(gl, uni, cupMat);


    //draw the handles of the cup
    //upper rung 1
    mat4.identity(model);
    let handleMat = new Material(); 
    handleMat.diffuseTexture = "blueTexture.jpg";
    handleMat.emissive = vec3.fromValues(0.7, 0.7, 0.7);

    mat4.fromTranslation(model, vec3.fromValues(7.5, 0.55, -7.15));

    mat4.scale(model,  model, vec3.fromValues(0.05, 0.05, 0.15));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cylinder.render(gl, uni, handleMat);

    //upper rung 2
        mat4.fromTranslation(model, vec3.fromValues(7.5, 0.55, -7.43));
        mat4.scale(model, model, vec3.fromValues(0.05, 0.05, 0.15));
        gl.uniformMatrix4fv(uni.uModel, false, model);
        Shapes.cylinder.render(gl, uni, handleMat);

    //bottom rungs
        mat4.fromTranslation(model, vec3.fromValues(7.5, 0.47, -7.15));
        mat4.scale(model, model, vec3.fromValues(0.05, 0.05, 0.15));
        gl.uniformMatrix4fv(uni.uModel, false, model);
        Shapes.cylinder.render(gl, uni, handleMat);


        mat4.fromTranslation(model, vec3.fromValues(7.5, 0.47, -7.43));
        mat4.scale(model, model, vec3.fromValues(0.05, 0.05, 0.15));
        gl.uniformMatrix4fv(uni.uModel, false, model);
        Shapes.cylinder.render(gl, uni, handleMat);

    //handle rungs
        mat4.fromTranslation(model, vec3.fromValues(7.5, 0.54, -7.43));
        mat4.rotateX(model, model, Math.PI/2);
        mat4.scale(model, model, vec3.fromValues(0.05, 0.05, 0.15));
        gl.uniformMatrix4fv(uni.uModel, false, model);
        Shapes.cylinder.render(gl, uni, handleMat);


        mat4.fromTranslation(model, vec3.fromValues(7.5, 0.54, -7.08));
        mat4.rotateX(model, model, Math.PI/2);
        mat4.scale(model, model, vec3.fromValues(0.05, 0.05, 0.15));
        gl.uniformMatrix4fv(uni.uModel, false, model);
        Shapes.cylinder.render(gl, uni, handleMat);



}
