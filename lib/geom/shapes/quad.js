var generateQuadData = function( size, tcScale = 1.0 ) {
    let s2 = size / 2.0;

    let p = [ -s2, 0, s2, s2, 0, s2, s2, 0, -s2, -s2, 0, -s2 ];
    let n = [ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 ];
    let tc = [0, 0, tcScale, 0, tcScale, tcScale, 0, tcScale];
    let idx = [0,1,2, 0,2,3];

    return {    
        index: idx,
        position: p,
        normal: n,
        texCoord: tc
    };
};