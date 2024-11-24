import { benchmarker } from "../benchmark";
import { pluralize, singularize, camelize, underscore, humanize, titleize, parameterize } from "../../src";

const testWords = {
  singular: "category",
  plural: "octopi",
  underscored: "employee_salary",
  camelCase: "bankAccount",
  dasherized: "donald-e-knuth",
  sentence: "man from the boondocks",
  underscoredComplex: "api_responses_url",
  underscoredWithSlash: "nested/api_response",
  mixedCase: "API_ResponseFormat",
  lowercaseAcronym: "html_parser",
  uppercaseAcronym: "HTML_parser",
  multipleUnderscores: "complex_api_response_format",
  numbersIncluded: "api2_response_3d",
};

export default benchmarker(async (suite) => {
  suite
    .add("pluralize", function () {
      pluralize(testWords.singular);
    })
    .add("singularize", function () {
      singularize(testWords.plural);
    })
    .add("camelize.basic", function () {
      camelize(testWords.underscored);
    })
    .add("camelize.complex", function () {
      camelize(testWords.underscoredComplex);
    })
    .add("camelize.withSlash", function () {
      camelize(testWords.underscoredWithSlash);
    })
    .add("camelize.mixedCase", function () {
      camelize(testWords.mixedCase);
    })
    .add("camelize.lowercaseFirst", function () {
      camelize(testWords.underscoredComplex, false);
    })
    .add("camelize.acronymLower", function () {
      camelize(testWords.lowercaseAcronym);
    })
    .add("camelize.acronymUpper", function () {
      camelize(testWords.uppercaseAcronym);
    })
    .add("camelize.multipleUnderscores", function () {
      camelize(testWords.multipleUnderscores);
    })
    .add("camelize.withNumbers", function () {
      camelize(testWords.numbersIncluded);
    })
    .add("underscore", function () {
      underscore(testWords.camelCase);
    })
    .add("humanize", function () {
      humanize(testWords.underscored);
    })
    .add("titleize", function () {
      titleize(testWords.sentence);
    })
    .add("parameterize", function () {
      parameterize(testWords.dasherized);
    });

  return suite;
});
