import { benchmarker } from "../benchmark";
import { pluralize, singularize, camelize, underscore, humanize, titleize, parameterize } from "../../src";

export default benchmarker(async (suite) => {
  suite
    .add("pluralize", function () {
      pluralize("category");
    })
    .add("singularize", function () {
      singularize("octopi");
    })
    .add("camelize.basic", function () {
      camelize("employee_salary");
    })
    .add("camelize.complex", function () {
      camelize("api_responses_url");
    })
    .add("camelize.withSlash", function () {
      camelize("nested/api_response");
    })
    .add("camelize.mixedCase", function () {
      camelize("API_ResponseFormat");
    })
    .add("camelize.lowercaseFirst", function () {
      camelize("api_responses_url", false);
    })
    .add("camelize.multipleUnderscores", function () {
      camelize("complex_api_response_format");
    })
    .add("camelize.withNumbers", function () {
      camelize("api2_response_3d");
    })
    .add("underscore", function () {
      underscore("bankAccount");
    })
    .add("humanize", function () {
      humanize("employee_salary");
    })
    .add("titleize", function () {
      titleize("man from the boondocks");
    })
    .add("parameterize", function () {
      parameterize("donald-e-knuth");
    });

  return suite;
});
