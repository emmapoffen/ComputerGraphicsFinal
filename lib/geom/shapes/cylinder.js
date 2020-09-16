/**
 * Natalie Stephenson
 * Generates TriangleMesh vertex data for a cylinder of a given size,
 * centered at the origin.
 * 
 * @param {Number} radius the radius of the disk base
 * @param {Number} numTriangles the number of triangles to use to draw it
 * @param {Number} length of the cylinder
 */
var generateCylinderData = function(radius, numTriangles, length) {

    
    //var theta = 2pi / numTriangles; 
    var theta = (2 * Math.PI) / numTriangles; 
 
     let v = [ ];
     let idx = [ ];
     let n = [ ];
     let tc = [ ];
     
     let vHolder = 0; 
     for(let i=0; i<2*numTriangles; i++){
         let angle = theta * i; 
         let x = radius/2 * Math.cos(angle);
         let y = radius/2* Math.sin(angle);
         //pull the circle out to height h 
         let z = 0; 
         v.push(x, y, z);
         v.push(x, y, length); 
        // idx.push((i+1), (i+2), i%numTriangles);
        idx.push(i, i+1, i+2, i+2, i+1, i+3 );
        //texture coordinates
        let u = i/numTriangles;
        let tx = radius*Math.cos(2*Math.PI*u);
        let ty = radius*Math.sin(2*Math.PI*u);
        let tz = length * length/(i*numTriangles);
        tc.push(tx, ty, tz);

        //normals
        let nx = vec3.fromValues(x, y, z); 
         vec3.normalize(nx, nx);
         n.push( nx[0], nx[1], 0);
        let ny = vec3.fromValues(x, y, length);
         vec3.normalize(ny, ny);
         n.push(ny[0], ny[1], 0);
     }
     v.push(0,0);
     tc.push(0,1);
     tc.push(1,1); 
    //tc.push(1, 0);
    // tc.push(0,0);
     //console.log(v.length); //243
 //var n = [ /*normals: full of 0s for now */]; //as many 0's as are elements in v
 
     //set the normals
   //  for(i = 0; i<v.length; i++){

   //  }

 for(k=0; k<v.length; k++){
     n.push(0,0,0);
 }
 
     return {
         index: idx,
         normal: n,
         position: v,
         texCoord: tc
     };
 };