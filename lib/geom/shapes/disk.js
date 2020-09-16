
/**
 * Natalie Stephenson
 * Generates TriangleMesh vertex data for a disk of a given size,
 * centered at the origin.
 * 
 * @param {Number} radius the radius of the disk
 * @param {Number} numTriangles the number of triangles to use to draw it
 */
var generateDiskData = function(radius, numTriangles) {
//                                radius, slices

   //var theta = 2pi / numTriangles; 
   var theta = (2 * Math.PI) / numTriangles; 

    let v = [ ];
    let idx = [ ];
    
    let tc = [ ];


    for(let i=0; i<numTriangles; i++){
        let angle = theta * i; 
        let x = radius * Math.cos(angle);
        let y = radius* Math.sin(angle);
        let z = 0; 
        v.push(x, y, z);
        idx.push(numTriangles, i, (i+1)%numTriangles); 
        //texture coordinates below
        tc.push(0.5+0.5*Math.cos(angle), 0.5+0.5*Math.sin(angle)); //x, y values (disks are 2-D)

    }
    v.push(0,0,0); 
    tc.push(0.5,0.5); //center of disk
    //93
var n = [ /*normals: full of 0s for now */]; //as many 0's as are elements in v
//set the normals
    for(i=0; i<v.length; i++){
        n.push(0, 0, 1);
       // n.push(0,0,-1);
    }

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