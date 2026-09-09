/**
 * Represents the normalized evidence from a learner's LLD design.
 *
 * DesignEvidence gives the evaluation layer a consistent structure,
 * regardless of how the learner originally submitted their design.
 *
 * It describes what the learner designed. It does not judge the quality
 * of that design.
 */
class DesignEvidence {
    /**
     * Creates a new DesignEvidence value object.
     *
     * @param {Object} params
     * @param {Object[]} params.entities - Classes or entities in the design
     * @param {Object[]} params.responsibilities - Assigned responsibilities
     * @param {Object[]} params.relationships - Relationships between entities
     * @param {Object[]} params.behaviors - Important system behaviors
     * @param {Object[]} params.designDecisions - Design decisions and rationales
     * @param {Object[]} params.interfaces - Optional interfaces
     * @param {Object[]} params.assumptions - Optional assumptions
     */
    constructor({
        entities = [],
        responsibilities = [],
        relationships = [],
        behaviors = [],
        designDecisions = [],
        interfaces = [],
        assumptions = []
    }) {
        const collections = {
            entities,
            responsibilities,
            relationships,
            behaviors,
            designDecisions,
            interfaces,
            assumptions
        };

        for (const [name, value] of Object.entries(collections)) {
            if (!Array.isArray(value)) {
                throw new Error(`DesignEvidence ${name} must be an array`);
            }
        }

        this._entities = Object.freeze([...entities]);
        this._responsibilities = Object.freeze([...responsibilities]);
        this._relationships = Object.freeze([...relationships]);
        this._behaviors = Object.freeze([...behaviors]);
        this._designDecisions = Object.freeze([...designDecisions]);
        this._interfaces = Object.freeze([...interfaces]);
        this._assumptions = Object.freeze([...assumptions]);

        Object.freeze(this);
    }

    getEntities() {
        return [...this._entities];
    }

    getResponsibilities() {
        return [...this._responsibilities];
    }

    getRelationships() {
        return [...this._relationships];
    }

    getBehaviors() {
        return [...this._behaviors];
    }

    getDesignDecisions() {
        return [...this._designDecisions];
    }

    getInterfaces() {
        return [...this._interfaces];
    }

    getAssumptions() {
        return [...this._assumptions];
    }

    toJSON() {
        return {
            entities: this.getEntities(),
            responsibilities: this.getResponsibilities(),
            relationships: this.getRelationships(),
            behaviors: this.getBehaviors(),
            designDecisions: this.getDesignDecisions(),
            interfaces: this.getInterfaces(),
            assumptions: this.getAssumptions()
        };
    }
}

module.exports = DesignEvidence;