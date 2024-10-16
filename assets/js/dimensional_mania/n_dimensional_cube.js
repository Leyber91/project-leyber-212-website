// n_dimensional_cube.js

export class NDimensionalCube {
    constructor(dimension) {
        this.dimension = dimension;
        this.vertices = this.generateVertices();
        this.edges = this.generateEdges();
    }

    /**
     * Generates the vertices of an N-dimensional cube.
     * Each vertex is represented as an array of coordinates.
     */
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

    /**
     * Generates the edges of an N-dimensional cube.
     * An edge connects two vertices that differ by exactly one coordinate.
     */
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

    /**
     * Projects N-dimensional vertices down to 3D using rotation matrices.
     * Applies rotation transformations to simulate higher-dimensional rotations.
     */
    project(rotationMatrices) {
        const projectedVertices = this.vertices.map(vertex => {
            let projected = [...vertex];
            for (const matrix of rotationMatrices) {
                projected = this.rotatePoint(projected, matrix);
            }
            // Apply perspective scaling based on the additional dimensions
            projected = this.perspectiveProjection(projected);
            return projected.slice(0, 3).map(v => isFinite(v) ? v : 0);
        });

        return {
            vertices: projectedVertices,
            edges: this.edges
        };
    }

    /**
     * Rotates a point using the provided rotation matrix.
     */
    rotatePoint(point, matrix) {
        const result = new Array(point.length).fill(0);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < point.length; j++) {
                result[i] += point[j] * matrix[i][j];
            }
        }
        return result;
    }

    /**
     * Applies perspective projection to enhance the visualization of higher dimensions.
     * This method scales the coordinates based on the magnitude in higher dimensions.
     * Adjust the 'projectionDistance' to control the depth effect.
     */
    perspectiveProjection(vertex) {
        const projectionDistance = 3; // Adjust for depth effect
        const w = vertex.length > 3 ? vertex[3] : 0; // Handle 4D and higher
        const scale = projectionDistance / (projectionDistance + w);
        return vertex.map(coord => coord * scale);
    }

    /**
     * Creates a Three.js geometry for the N-dimensional cube.
     * Converts vertices and edges into a format suitable for Three.js LineSegments.
     */
    createThreeGeometry(rotationMatrices) {
        const projected = this.project(rotationMatrices);
        const positions = projected.vertices.flat(); // Flatten the array
        const indices = projected.edges.flat();

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeBoundingSphere();

        return geometry;
    }

    /**
     * Creates a Three.js LineSegments object representing the N-dimensional cube.
     * Applies dynamic coloring based on rotation or other visual cues.
     */
    createThreeLineSegments(rotationMatrices) {
        const geometry = this.createThreeGeometry(rotationMatrices);

        // Dynamic color based on rotation matrices or other properties
        const material = new THREE.LineBasicMaterial({
            color: 0x9b59b6, // Neon Purple color
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });

        const lineSegments = new THREE.LineSegments(geometry, material);
        return lineSegments;
    }

    /**
     * Updates the Three.js LineSegments object with new vertex positions.
     * Useful for animating rotations dynamically.
     */
    updateThreeGeometry(lineSegments, rotationMatrices, size) {
        const projected = this.project(rotationMatrices);
        const positions = projected.vertices.flat();
        const geometry = lineSegments.geometry;

        // Update positions
        const positionAttribute = geometry.getAttribute('position');
        for (let i = 0; i < positions.length; i++) {
            positionAttribute.array[i] = (projected.vertices[Math.floor(i / 3)][i % 3] * size) / 100;
        }
        positionAttribute.needsUpdate = true;

        // Optionally, update colors or other attributes here
    }

    /**
     * Removes the Three.js LineSegments object from the scene.
     */
    removeFromScene(scene, lineSegments) {
        scene.remove(lineSegments);
        lineSegments.geometry.dispose();
        lineSegments.material.dispose();
    }
}
