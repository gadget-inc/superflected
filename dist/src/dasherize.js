"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dasherize = dasherize;
function dasherize(underscoredWord) {
    return underscoredWord.replace(/_/g, "-");
}
