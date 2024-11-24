import { describe, it, expect } from "vitest";
import {
  pluralize,
  singularize,
  capitalize,
  titleize,
  camelize,
  inflections,
  humanize,
  underscore,
  classify,
  tableize,
  setInflections,
  foreignKey,
  ordinal,
  ordinalize,
  dasherize,
  parameterize,
  constantify,
  setTransliterations
} from "../src";
const inflect = inflections();
import TestCases from "./cases";

describe("Inflector", () => {
  it("properly pluralizes plurals", () => {
    expect(pluralize("plurals")).toBe("plurals");
    expect(pluralize("Plurals")).toBe("Plurals");
  });

  it("properly pluralizes empty string", () => {
    expect(pluralize("")).toBe("");
  });

  it("properly capitalizes strings", () => {
    expect(capitalize("foo")).toBe("Foo");
    expect(capitalize("FOO")).toBe("FOO");
    expect(capitalize("foo bar")).toBe("Foo bar");
    expect(capitalize("")).toBe("");
    expect(capitalize(null)).toBe("");
    expect(capitalize(undefined)).toBe("");
  });

  for (const word of inflect.uncountables) {
    it("respects the uncountability of " + word, () => {
      expect(singularize(word)).toBe(word);
      expect(pluralize(word)).toBe(word);
      expect(singularize(word)).toBe(pluralize(word));
    });
  }

  it("checks uncountable word is not greedy", () => {
    const uncountableWord = "ors";
    const countableWord = "sponsor";

    inflect.uncountables.push(uncountableWord);

    expect(singularize(uncountableWord)).toBe(uncountableWord);
    expect(pluralize(uncountableWord)).toBe(uncountableWord);
    expect(singularize(uncountableWord)).toBe(pluralize(uncountableWord));

    expect(singularize(countableWord)).toBe("sponsor");
    expect(pluralize(countableWord)).toBe("sponsors");
    expect(singularize(pluralize(countableWord))).toBe("sponsor");
  });

  for (const [singular, plural] of Object.entries(TestCases.SingularToPlural)) {
    it("properly pluralizes " + singular, () => {
      expect(pluralize(singular)).toBe(plural);
      expect(pluralize(capitalize(singular))).toBe(capitalize(plural));
    });

    it("properly pluralizes " + plural, () => {
      expect(pluralize(plural)).toBe(plural);
      expect(pluralize(capitalize(plural))).toBe(capitalize(plural));
    });

    it("properly singularizes " + plural, () => {
      expect(singularize(plural)).toBe(singular);
      expect(singularize(capitalize(plural))).toBe(capitalize(singular));
    });

    it("properly singularizes " + singular, () => {
      expect(singularize(singular)).toBe(singular);
      expect(singularize(capitalize(singular))).toBe(capitalize(singular));
    });
  }

  it("allows overwriting defined inflectors", () => {
    expect(singularize("series")).toBe("series");
    inflect.singular("series", "serie");
    expect(singularize("series")).toBe("serie");
  });

  for (const [mixture, titleized] of Object.entries(TestCases.MixtureToTitleCase)) {
    it("properly titleizes " + mixture, () => {
      expect(titleize(mixture)).toBe(titleized);
    });
  }

  for (const [camel, underscore] of Object.entries(TestCases.CamelToUnderscore)) {
    it("properly camelizes " + underscore, () => {
      expect(camelize(underscore)).toBe(camel);
    });
  }

  it("properly camelizes with lower downcases the first letter", () => {
    expect(camelize("Capital", false)).toBe("capital");
  });

  it("properly camelizes with underscores", () => {
    expect(camelize("Camel_Case")).toBe("CamelCase");
  });

  it("properly handles acronyms", () => {
    inflect.acronym("API");
    inflect.acronym("HTML");
    inflect.acronym("HTTP");
    inflect.acronym("RESTful");
    inflect.acronym("W3C");
    inflect.acronym("PhD");
    inflect.acronym("RoR");
    inflect.acronym("SSL");

    //  camelize             underscore            humanize              titleize
    const items = [
      ["API", "api", "API", "API"],
      ["APIController", "api_controller", "API controller", "API Controller"],
      ["Nokogiri/HTML", "nokogiri/html", "Nokogiri/HTML", "Nokogiri/HTML"],
      ["HTTPAPI", "http_api", "HTTP API", "HTTP API"],
      ["HTTP/Get", "http/get", "HTTP/get", "HTTP/Get"],
      ["SSLError", "ssl_error", "SSL error", "SSL Error"],
      ["RESTful", "restful", "RESTful", "RESTful"],
      ["RESTfulController", "restful_controller", "RESTful controller", "RESTful Controller"],
      ["IHeartW3C", "i_heart_w3c", "I heart W3C", "I Heart W3C"],
      ["PhDRequired", "phd_required", "PhD required", "PhD Required"],
      ["IRoRU", "i_ror_u", "I RoR u", "I RoR U"],
      ["RESTfulHTTPAPI", "restful_http_api", "RESTful HTTP API", "RESTful HTTP API"],

      // misdirection
      ["Capistrano", "capistrano", "Capistrano", "Capistrano"],
      ["CapiController", "capi_controller", "Capi controller", "Capi Controller"],
      ["HttpsApis", "https_apis", "Https apis", "Https Apis"],
      ["Html5", "html5", "Html5", "Html5"],
      ["Restfully", "restfully", "Restfully", "Restfully"],
      ["RoRails", "ro_rails", "Ro rails", "Ro Rails"]
    ];

    for (const [i, [camel, under, human, title]] of items.entries()) {
      expect(camelize(under)).toBe(camel);
      expect(camelize(camel)).toBe(camel);
      expect(underscore(under)).toBe(under);
      expect(underscore(camel)).toBe(under);
      expect(titleize(under)).toBe(title);
      expect(titleize(camel)).toBe(title);
      expect(humanize(under)).toBe(human);
    }
  });

  it("allows overwriting acronyms", () => {
    inflect.acronym("API");
    inflect.acronym("LegacyApi");

    expect(camelize("legacyapi")).toBe("LegacyApi");
    expect(camelize("legacy_api")).toBe("LegacyAPI");
    expect(camelize("some_legacyapi")).toBe("SomeLegacyApi");
    expect(camelize("nonlegacyapi")).toBe("Nonlegacyapi");
  });

  it("properly handles lower camelized acronyms", () => {
    inflect.acronym("API");
    inflect.acronym("HTML");

    expect(camelize("html_api", false)).toBe("htmlAPI");
    expect(camelize("htmlAPI", false)).toBe("htmlAPI");
    expect(camelize("HTMLAPI", false)).toBe("htmlAPI");
  });

  it("properly handles lower camelized acronyms", () => {
    inflect.acronym("API");
    inflect.acronym("JSON");
    inflect.acronym("HTML");

    expect(underscore("JSONHTMLAPI")).toBe("json_html_api");
  });

  it("properly underscores", () => {
    for (const [camel, underscored] of Object.entries(TestCases.CamelToUnderscore)) {
      expect(underscore(camel)).toBe(underscored);
    }

    for (const [camel, underscored] of Object.entries(TestCases.CamelToUnderscoreWithoutReverse)) {
      expect(underscore(camel)).toBe(underscored);
    }
  });

  it("properly adds a foreign key suffix", () => {
    for (const [klass, foreignKeyized] of Object.entries(TestCases.ClassNameToForeignKeyWithUnderscore)) {
      expect(foreignKey(klass)).toBe(foreignKeyized);
    }

    for (const [klass, foreignKeyized] of Object.entries(TestCases.ClassNameToForeignKeyWithoutUnderscore)) {
      expect(foreignKey(klass, false)).toBe(foreignKeyized);
    }
  });

  it("properly tableizes class names", () => {
    for (const [className, tableName] of Object.entries(TestCases.ClassNameToTableName)) {
      expect(tableize(className)).toBe(tableName);
    }
  });

  it("properly classifies table names", () => {
    for (const [className, tableName] of Object.entries(TestCases.ClassNameToTableName)) {
      expect(classify(tableName)).toBe(className);
      expect(classify("table_prefix." + tableName)).toBe(className);
    }
  });

  it("properly classifies with leading schema name", () => {
    expect(classify("schema.foo_bar")).toBe("FooBar");
  });

  it("properly humanizes underscored strings", () => {
    for (const [underscore, human] of Object.entries(TestCases.UnderscoreToHuman)) {
      expect(humanize(underscore)).toBe(human);
    }
  });

  it("properly humanizes underscored strings without capitalize", () => {
    for (const [underscore, human] of Object.entries(TestCases.UnderscoreToHumanWithoutCapitalize)) {
      expect(humanize(underscore, { capitalize: false })).toBe(human);
    }
  });

  it("properly humanizes by rule", () => {
    inflect.human(/_cnt$/i, "_count");
    inflect.human(/^prefx_/i, "");

    expect(humanize("jargon_cnt")).toBe("Jargon count");
    expect(humanize("prefx_request")).toBe("Request");
  });

  it("properly humanizes by string", () => {
    inflect.human("col_rpted_bugs", "Reported bugs");

    expect(humanize("col_rpted_bugs")).toBe("Reported bugs");
    expect(humanize("COL_rpted_bugs")).toBe("Col rpted bugs");
  });

  it("properly generates ordinal suffixes", () => {
    for (const [number, ordinalized] of Object.entries(TestCases.OrdinalNumbers)) {
      expect(ordinalized).toBe(number + ordinal(number));
    }
  });

  it("properly ordinalizes numbers", () => {
    for (const [number, ordinalized] of Object.entries(TestCases.OrdinalNumbers)) {
      expect(ordinalize(number)).toBe(ordinalized);
    }
  });

  it("properly dasherizes underscored strings", () => {
    for (const [underscored, dasherized] of Object.entries(TestCases.UnderscoresToDashes)) {
      expect(dasherize(underscored)).toBe(dasherized);
    }
  });

  it("properly underscores as reverse of dasherize", () => {
    for (const [underscored, _dasherized] of Object.entries(TestCases.UnderscoresToDashes)) {
      expect(underscore(dasherize(underscored))).toBe(underscored);
    }
  });

  it("properly underscores to lower camel", () => {
    for (const [underscored, lowerCamel] of Object.entries(TestCases.UnderscoreToLowerCamel)) {
      expect(camelize(underscored, false)).toBe(lowerCamel);
    }
  });

  it("respects the inflector locale", () => {
    setInflections("es", function(inflect) {
      inflect.plural(/$/, "s");
      inflect.plural(/z$/i, "ces");

      inflect.singular(/s$/, "");
      inflect.singular(/es$/, "");

      inflect.irregular("el", "los");
    });

    expect(pluralize("hijo", "es")).toBe("hijos");
    expect(pluralize("luz", "es")).toBe("luces");
    expect(pluralize("luz")).toBe("luzs");

    expect(singularize("sociedades", "es")).toBe("sociedad");
    expect(singularize("sociedades")).toBe("sociedade");

    expect(pluralize("el", "es")).toBe("los");
    expect(pluralize("el")).toBe("els");

    setInflections("es", function(inflect) {
      inflect.clear();
    });

    expect(inflections("es").plurals.length).toBe(0);
    expect(inflections("es").singulars.length).toBe(0);
    expect(inflections().plurals.length).not.toBe(0);
    expect(inflections().singulars.length).not.toBe(0);
  });

  describe("pluralization", () => {
    for (const [singular, plural] of Object.entries(TestCases.Irregularities)) {
      it("respects the irregularity between " + singular + " and " + plural, () => {
        setInflections("en", function(inflect) {
          inflect.irregular(singular, plural);
        });

        expect(singularize(plural)).toBe(singular);
        expect(pluralize(singular)).toBe(plural);
      });
    }

    for (const [singular, plural] of Object.entries(TestCases.Irregularities)) {
      it("makes sure that pluralize of irregularity " + plural + " is the same", () => {
        setInflections("en", function(inflect) {
          inflect.irregular(singular, plural);
        });

        expect(pluralize(plural)).toBe(plural);
      });
    }

    for (const [singular, plural] of Object.entries(TestCases.Irregularities)) {
      it("makes sure that singularize of irregularity " + singular + " is the same", () => {
        setInflections("en", function(inflect) {
          inflect.irregular(singular, plural);
        });

        expect(singularize(singular)).toBe(singular);
      });
    }
  });

  for (const scope of ["plurals", "singulars", "uncountables", "humans"] as const) {
    it("properly clears " + scope + " inflection scope", () => {
      setInflections("en", function(inflect) {
        inflect.clear(scope);
      });
      expect(inflections("en")[scope].length).toBe(0);
    });
  }

  it("properly clears all reflection scopes", () => {
    setInflections("en", function(inflect) {
      // ensure any data is present
      inflect.plural(/(quiz)$/i, "$1zes");
      inflect.singular(/(database)s$/i, "$1");
      inflect.uncountable("series");
      inflect.human("col_rpted_bugs", "Reported bugs");

      inflect.clear("all");

      expect(inflect.plurals.length).toBe(0);
      expect(inflect.singulars.length).toBe(0);
      expect(inflect.uncountables.length).toBe(0);
      expect(inflect.humans.length).toBe(0);
    });
  });

  it("properly clears with default", () => {
    setInflections("es", function(inflect) {
      // ensure any data is present
      inflect.plural(/(quiz)$/i, "$1zes");
      inflect.singular(/(database)s$/i, "$1");
      inflect.uncountable("series");
      inflect.human("col_rpted_bugs", "Reported bugs");

      inflect.clear();

      expect(inflect.plurals.length).toBe(0);
      expect(inflect.singulars.length).toBe(0);
      expect(inflect.uncountables.length).toBe(0);
      expect(inflect.humans.length).toBe(0);
    });
  });

  it("properly parameterizes", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterized)) {
      expect(parameterize(someString)).toBe(parameterizedString);
    }
  });

  it("properly parameterizes and normalizes", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterizedAndNormalized)) {
      expect(parameterize(someString)).toBe(parameterizedString);
    }
  });

  it("properly parameterizes with custom separator", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterizeWithUnderscore)) {
      expect(parameterize(someString, { separator: "_" })).toBe(parameterizedString);
    }
  });

  it("properly parameterizes with no separator", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterizeWithNoSeparator)) {
      expect(parameterize(someString, { separator: null })).toBe(parameterizedString);
      expect(parameterize(someString, { separator: "" })).toBe(parameterizedString);
    }
  });

  it("properly parameterizes with preserve-case option", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterizeWithPreserveCase)) {
      expect(parameterize(someString, { preserveCase: true })).toBe(parameterizedString);
    }
  });

  it("properly parameterizes with multi character separator", () => {
    for (const [someString, parameterizedString] of Object.entries(TestCases.StringToParameterized)) {
      expect(parameterize(someString, { separator: "__sep__" })).toBe(parameterizedString.replace(/-/g, "__sep__"));
    }
  });

  it("allows overwriting transliterate approximations", () => {
    expect(parameterize("Jürgen")).toBe("jurgen");

    setTransliterations("en", transliterate => {
      transliterate.approximate("ü", "ue");
    });

    expect(parameterize("Jürgen")).toBe("juergen");
  });

  it("allows overwriting transliterate approximations for a specific locale", () => {
    expect(parameterize("Mädchen")).toBe("madchen");
    expect(parameterize("Mädchen", { locale: "de" })).toBe("madchen");

    setTransliterations("de", transliterate => {
      transliterate.approximate("ä", "ae");
    });

    expect(parameterize("Mädchen")).toBe("madchen");
    expect(parameterize("Mädchen", { locale: "de" })).toBe("maedchen");
  });

  it("properly converts words to constant case", () => {
    for (const [words, constantCase] of Object.entries(TestCases.WordsToConstantCase)) {
      expect(constantify(words)).toBe(constantCase);
    }
  });
});
