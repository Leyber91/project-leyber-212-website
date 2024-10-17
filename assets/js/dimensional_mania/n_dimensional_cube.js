// n_dimensional_cube.js


/**
 * NDimensionalCube class represents an N-dimensional hypercube
 */
export class NDimensionalCube {
    constructor(dimension, parent = null, color = 0xffffff, offset = []) {
        this.dimension = dimension;
        this.parent = parent;
        this.color = color;
        this.offset = offset; // Position offset in N-dimensional space
        this.vertices = this.generateVertices();
        this.edges = this.generateEdges();
        this.children = [];
        this.rotationMatrices = [];

        // Create Three.js LineSegments
        this.object3D = this.createThreeLineSegments();

        // If there's a parent, add this object as a child
        if (this.parent) {
            this.parent.object3D.add(this.object3D);
        }

        // Embed lower-dimensional hypercubes if applicable
        if (this.dimension > 3) {
            this.embedChildren();
        }
    }

    /**
     * Generate vertices for the hypercube
     * @returns {Array} - Array of vertices
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
     * Generate edges for the hypercube by connecting vertices that differ by one dimension
     * @returns {Array} - Array of edge pairs
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
                        if (diffCount > 1) break;
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
     * Create Three.js LineSegments to represent the hypercube
     * @returns {THREE.LineSegments} - The LineSegments object
     */
    createThreeLineSegments() {
        const projected = this.project();
        const positions = projected.vertices.flat();
        const indices = projected.edges.flat();

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeBoundingSphere();

        const material = new THREE.LineBasicMaterial({
            color: this.color,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });

        const lineSegments = new THREE.LineSegments(geometry, material);
        return lineSegments;
    }

    /**
     * Project N-dimensional vertices down to 3D
     * @returns {Object} - Contains projected vertices and edges
     */
    project() {
        const projectedVertices = this.vertices.map(vertex => {
            let projected = [...vertex];
            // Apply offset in N-dimensional space before rotation
            projected = this.applyOffset(projected);
            for (const matrix of this.rotationMatrices) {
                projected = this.rotatePoint(projected, matrix);
            }
            // Apply recursive projection down to 3D
            projected = this.recursiveProjection(projected);
            return projected.slice(0, 3).map(v => isFinite(v) ? v : 0);
        });

        return {
            vertices: projectedVertices,
            edges: this.edges
        };
    }

    /**
     * Apply positional offset to the vertex
     * @param {Array} vertex - The N-dimensional vertex
     * @returns {Array} - The offset vertex
     */
    applyOffset(vertex) {
        return vertex.map((coord, idx) => coord + (this.offset[idx] || 0));
    }

    /**
     * Rotate a point using a rotation matrix
     * @param {Array} point - The N-dimensional point
     * @param {Array} matrix - The rotation matrix
     * @returns {Array} - The rotated point
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
     * Recursive projection from N-dimensions down to 3D
     * @param {Array} vertex - The N-dimensional point
     * @returns {Array} - The 3D projected point
     */
    recursiveProjection(vertex) {
        let projected = vertex.slice(); // Copy the vertex array

        // Iteratively project down to 3D
        while (projected.length > 3) {
            const projectionDistance = 3; // You can parameterize this
            const lastDim = projected.length - 1;
            const w = projected[lastDim];
            const scale = projectionDistance / (projectionDistance + w);
            for (let i = 0; i < lastDim; i++) {
                projected[i] *= scale;
            }
            projected.pop(); // Remove the last dimension after projection
        }

        return projected;
    }

    /**
     * Embed lower-dimensional hypercubes within the current hypercube
     */
    embedChildren() {
        // The number of (N-1)-dimensional hypercubes in an N-dimensional hypercube is 2*N
        const numChildren = 2 * this.dimension;

        for (let axis = 0; axis < this.dimension; axis++) {
            for (let side = -1; side <= 1; side += 2) { // Two sides per axis
                const offset = this.offset.slice(); // Clone current offset
                if (offset.length < this.dimension) {
                    // Extend the offset array if necessary
                    for (let i = offset.length; i < this.dimension; i++) {
                        offset.push(0);
                    }
                }
                // Position the child hypercube at distance 2 along the current axis
                // This ensures no overlap; adjust the factor as needed
                offset[axis] += side * 2;

                // Assign a unique color based on axis and side
                const hue = (axis + (side === 1 ? 0 : 0.5)) / this.dimension;
                const color = new THREE.Color().setHSL(hue, 1, 0.5);

                // Create child hypercube
                const child = new NDimensionalCube(this.dimension - 1, this, color.getHex(), offset);
                this.children.push(child);
            }
        }
    }

    /**
     * Update the hypercube with rotation matrices and time-based transformations
     * @param {Array} rotationMatrices - Array of rotation matrices
     * @param {number} time - The current time or temporal parameter
     */
    update(rotationMatrices, time = 0) {
        this.rotationMatrices = rotationMatrices;
        // Update rotation matrices and re-project vertices
        const projected = this.project();
        const positions = projected.vertices.flat();
        const positionAttribute = this.object3D.geometry.getAttribute('position');

        // Resize the position array if necessary
        if (positionAttribute.count * 3 !== positions.length) {
            this.object3D.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            this.object3D.geometry.setIndex(projected.edges.flat());
            this.object3D.geometry.computeBoundingSphere();
        } else {
            // Update existing positions
            for (let i = 0; i < positions.length; i++) {
                positionAttribute.array[i] = positions[i];
            }
            positionAttribute.needsUpdate = true;
        }

        // Apply time-based transformations (4D as Time)
        this.updateWithTime(time);

        // Update children recursively
        this.children.forEach(child => child.update(rotationMatrices, time));
    }

    /**
     * Apply time-based transformations to represent the temporal dimension
     * @param {number} time - The current time or temporal parameter
     */
    updateWithTime(time) {
        // Example: Pulsating effect based on time
        const scale = 1 + 0.3 * Math.sin(time * 0.001);
        this.object3D.scale.set(scale, scale, scale);

        // Example: Color shifting over time
        const hue = (time * 0.0001) % 1;
        this.object3D.material.color.setHSL(hue, 1, 0.5);
    }

    /**
     * Transform the hypercube to a new dimension smoothly
     * @param {number} newDimension - The target dimension to transform into
     * @param {number} duration - Duration of the transformation in milliseconds
     */
    transformDimension(newDimension, duration = 2000) {
        const initialVertices = this.vertices.map(v => [...v]);
        const targetVertices = this.generateVerticesForDimension(newDimension);

        // Ensure target vertices match the current vertex count by padding with zeros
        const maxLength = Math.max(initialVertices.length, targetVertices.length);
        for (let i = 0; i < maxLength; i++) {
            if (!initialVertices[i]) initialVertices[i] = new Array(this.dimension).fill(0);
            if (!targetVertices[i]) targetVertices[i] = new Array(newDimension).fill(0);
        }

        const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(({ t }) => {
                this.vertices = initialVertices.map((v, i) => {
                    const targetV = targetVertices[i] || new Array(this.dimension).fill(0);
                    return v.map((coord, dim) => {
                        const targetCoord = targetV[dim] || 0;
                        return THREE.MathUtils.lerp(coord, targetCoord, t);
                    });
                });
                this.edges = this.generateEdges(); // Recalculate edges based on new vertices
                this.object3D.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.project().vertices.flat(), 3));
                this.object3D.geometry.setIndex(this.edges.flat());
                this.object3D.geometry.attributes.position.needsUpdate = true;
                this.object3D.geometry.computeBoundingSphere();
            })
            .onComplete(() => {
                // Optionally, embed children for the new dimension
                if (newDimension > 3) {
                    this.embedChildren();
                } else {
                    // Dispose children if moving to a lower dimension
                    this.children.forEach(child => child.dispose(scene));
                    this.children = [];
                }
            })
            .start();
    }

    /**
     * Generate vertices for a specific dimension without resetting existing offsets
     * @param {number} newDimension - The dimension for which to generate vertices
     * @returns {Array} - Array of vertices for the new dimension
     */
    generateVerticesForDimension(newDimension) {
        const vertices = [];
        const numVertices = Math.pow(2, newDimension);

        for (let i = 0; i < numVertices; i++) {
            const vertex = [];
            for (let j = 0; j < newDimension; j++) {
                vertex.push((i & (1 << j)) ? 1 : -1);
            }
            vertices.push(vertex);
        }

        return vertices;
    }

    /**
     * Dispose of the hypercube and its children
     * @param {THREE.Scene} scene - The Three.js scene
     */
    dispose(scene) {
        // Remove from scene and dispose resources
        scene.remove(this.object3D);
        this.object3D.geometry.dispose();
        this.object3D.material.dispose();
        this.children.forEach(child => child.dispose(scene));
    }
}
