"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmark_1 = require("../benchmark");
const src_1 = require("../../src");
exports.default = (0, benchmark_1.benchmarker)(async (suite) => {
    suite
        .add("pluralize", function () {
        (0, src_1.pluralize)("category");
    })
        .add("singularize", function () {
        (0, src_1.singularize)("octopi");
    })
        .add("camelize.basic", function () {
        (0, src_1.camelize)("employee_salary");
    })
        .add("camelize.complex", function () {
        (0, src_1.camelize)("api_responses_url");
    })
        .add("camelize.withSlash", function () {
        (0, src_1.camelize)("nested/api_response");
    })
        .add("camelize.mixedCase", function () {
        (0, src_1.camelize)("API_ResponseFormat");
    })
        .add("camelize.lowercaseFirst", function () {
        (0, src_1.camelize)("api_responses_url", false);
    })
        .add("camelize.multipleUnderscores", function () {
        (0, src_1.camelize)("complex_api_response_format");
    })
        .add("camelize.withNumbers", function () {
        (0, src_1.camelize)("api2_response_3d");
    })
        .add("underscore", function () {
        (0, src_1.underscore)("bankAccount");
    })
        .add("humanize", function () {
        (0, src_1.humanize)("employee_salary");
    })
        .add("titleize", function () {
        (0, src_1.titleize)("man from the boondocks");
    })
        .add("parameterize", function () {
        (0, src_1.parameterize)("donald-e-knuth");
    });
    return suite;
});
