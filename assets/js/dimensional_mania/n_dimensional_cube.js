export class NDimensionalCube {
  constructor(dimension) {
      this.dimension = dimension;
      this.vertices = this.generateVertices();
      this.edges = this.generateEdges();
  }

  generateVertices() {
      const vertices = [];
      const numVertices = Math.pow(2, this.dimension);

      for (let i = 0; i < numVertices; i++) {
          const vertex = [];
          for (let j = 0; j < this.dimension; j++) {
              vertex.push((i & (1 << j)) ? 1 : -1);
          }
          vertices.push(vertex);
      }

      return vertices;
  }

  generateEdges() {
      const edges = [];
      const numVertices = this.vertices.length;

      for (let i = 0; i < numVertices; i++) {
          for (let j = i + 1; j < numVertices; j++) {
              let diffCount = 0;
              for (let k = 0; k < this.dimension; k++) {
                  if (this.vertices[i][k] !== this.vertices[j][k]) {
                      diffCount++;
                  }
              }
              if (diffCount === 1) {
                  edges.push([i, j]);
              }
          }
      }

      return edges;
  }

  project(rotationMatrices) {
      // Recursively project vertices for a more nested, self-rotating effect
      const recursiveProject = (vertex, depth) => {
          if (depth === 0) return vertex.slice(0, 3).map(v => isFinite(v) ? v : 0);

          let projected = [...vertex];
          for (const matrix of rotationMatrices) {
              projected = this.rotatePoint(projected, matrix);
          }
          return recursiveProject(projected, depth - 1);
      };

      const projectedVertices = this.vertices.map(vertex => recursiveProject(vertex, this.dimension));

      return {
          vertices: projectedVertices,
          edges: this.edges
      };
  }

  rotatePoint(point, matrix) {
      const result = new Array(point.length).fill(0);
      for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < point.length; j++) {
              result[i] += point[j] * matrix[i][j];
          }
      }
      return result;
  }

  draw(context, projectedData, canvasWidth, canvasHeight) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.strokeStyle = '#00ffff';
      context.lineWidth = 1;
      context.beginPath();

      // Draw edges first
      projectedData.edges.forEach(([start, end]) => {
          const startPoint = projectedData.vertices[start];
          const endPoint = projectedData.vertices[end];

          const x1 = (startPoint[0] * 0.5 + 0.5) * canvasWidth;
          const y1 = (startPoint[1] * 0.5 + 0.5) * canvasHeight;
          const x2 = (endPoint[0] * 0.5 + 0.5) * canvasWidth;
          const y2 = (endPoint[1] * 0.5 + 0.5) * canvasHeight;

          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
      });

      context.stroke();

      // Draw vertices
      projectedData.vertices.forEach(vertex => {
          const x = (vertex[0] * 0.5 + 0.5) * canvasWidth;
          const y = (vertex[1] * 0.5 + 0.5) * canvasHeight;
          context.beginPath();
          context.arc(x, y, 3, 0, Math.PI * 2);
          context.fillStyle = '#ffffff';
          context.fill();
      });
  }

  rotateVerticesIndependently(rotationMatrices) {
      // Rotate each vertex independently with a unique rotation matrix for added complexity
      const rotatedVertices = this.vertices.map((vertex, index) => {
          let rotated = [...vertex];
          // Create a pseudo-random rotation matrix for each vertex
          const vertexRotationMatrices = rotationMatrices.map(matrix => {
              return matrix.map(row => row.map(value => value * Math.sin(index + 1)));
          });

          for (const matrix of vertexRotationMatrices) {
              rotated = this.rotatePoint(rotated, matrix);
          }

          return rotated;
      });

      return rotatedVertices;
  }
}