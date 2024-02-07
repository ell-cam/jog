/**
 * Summary: defines Tags class
 *
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 */

import { defaultTags } from "./helpers/utilities.js";

export default class Tags {
    static #availableTags = [...defaultTags];
    #displayedTags = [];

    constructor(tags=[]) {
        this.#displayedTags = tags
    }

    static addTag(tag) {
        this.#availableTags.push(tag.toLowerCase())
    }

    static addTags(tags) {
        this.#availableTags = [...tags.map(tag => tag.toLowerCase())]
    }

    static deleteTag(tag) {
        for (var i = 0; i < this.#availableTags.length; i++) {
            if (this.#availableTags[i] === tag) {
                this.#availableTags.splice(i, 1)
            }
        }
    }

    static get getAll() {
        return [...this.#availableTags]
    }

    static doesNotInclude(tag) {
        return !this.#availableTags.includes(tag)
    }

    inDisplayedTags(tag) {
        return this.#displayedTags.includes(tag.toLowerCase())
    }

    addToDisplayedTags(tag) {
        this.#displayedTags.push(tag.toLowerCase())
    }

    setTags(tags=[]) {
        this.#displayedTags = [...tags]
    }

    get displayedTags() {
        return [...this.#displayedTags]
    }

}