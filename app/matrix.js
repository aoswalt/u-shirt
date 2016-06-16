/* eslint-disable no-magic-numbers */
//NOTE(adam): matrix operations for 3x3 matrices
function Matrix() {}

Matrix.invert = (m) => {
  const detM = Matrix.det(m);
  const idetM = 1/detM;
  const adjM = Matrix.adj(m);
  const TadjM = Matrix.transpose(adjM);

  return [idetM*TadjM[0], idetM*TadjM[1], idetM*TadjM[2],
          idetM*TadjM[3], idetM*TadjM[4], idetM*TadjM[5],
          idetM*TadjM[6], idetM*TadjM[7], idetM*TadjM[8]];
};

Matrix.det = (m) => {
  // determinant - should handle any size square
  if(m.length === 4) {
    return m[0]*m[3] - m[1]*m[2];
  } else if(m.length === 9) {
    return m[0]*m[4]*m[8] + m[1]*m[5]*m[6] + m[2]*m[3]*m[7] - m[2]*m[4]*m[6] - m[1]*m[3]*m[8] - m[0]*m[5]*m[7];
  } else {
    console.log("ERROR: Making determinate of unsupported size.");
  }
};

Matrix.adj = m =>
  [+Matrix.det([m[4], m[5], m[7], m[8]]),
   -Matrix.det([m[3], m[5], m[6], m[8]]),
   +Matrix.det([m[3], m[4], m[6], m[7]]),
   -Matrix.det([m[1], m[2], m[7], m[8]]),
   +Matrix.det([m[0], m[2], m[6], m[8]]),
   -Matrix.det([m[0], m[1], m[6], m[7]]),
   +Matrix.det([m[1], m[2], m[4], m[5]]),
   -Matrix.det([m[0], m[2], m[3], m[5]]),
   +Matrix.det([m[0], m[1], m[3], m[4]])];

Matrix.transpose = m =>
  [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];

Matrix.multmm = (A, B) =>
  [A[0]*B[0] + A[1]*B[3] + A[2]*B[6], A[0]*B[1] + A[1]*B[4] + A[2]*B[7], A[0]*B[2] + A[1]*B[5] + A[2]*B[8],
   A[3]*B[0] + A[4]*B[3] + A[5]*B[6], A[3]*B[1] + A[4]*B[4] + A[5]*B[7], A[3]*B[2] + A[4]*B[5] + A[5]*B[8],
   A[6]*B[0] + A[7]*B[3] + A[8]*B[6], A[6]*B[1] + A[7]*B[4] + A[8]*B[7], A[6]*B[2] + A[7]*B[5] + A[8]*B[8]];

Matrix.multmv = (m, v) =>
  [m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
   m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
   m[6]*v[0] + m[7]*v[1] + m[8]*v[2]];
