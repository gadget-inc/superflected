"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const src_1 = require("../src");
const inflect = (0, src_1.inflections)();
const cases_1 = __importDefault(require("./cases"));
(0, vitest_1.describe)("Inflector", () => {
    (0, vitest_1.it)("properly pluralizes plurals", () => {
        (0, vitest_1.expect)((0, src_1.pluralize)("plurals")).toBe("plurals");
        (0, vitest_1.expect)((0, src_1.pluralize)("Plurals")).toBe("Plurals");
    });
    (0, vitest_1.it)("properly pluralizes empty string", () => {
        (0, vitest_1.expect)((0, src_1.pluralize)("")).toBe("");
    });
    (0, vitest_1.it)("properly capitalizes strings", () => {
        (0, vitest_1.expect)((0, src_1.capitalize)("foo")).toBe("Foo");
        (0, vitest_1.expect)((0, src_1.capitalize)("FOO")).toBe("FOO");
        (0, vitest_1.expect)((0, src_1.capitalize)("foo bar")).toBe("Foo bar");
        (0, vitest_1.expect)((0, src_1.capitalize)("")).toBe("");
        (0, vitest_1.expect)((0, src_1.capitalize)(null)).toBe("");
        (0, vitest_1.expect)((0, src_1.capitalize)(undefined)).toBe("");
    });
    for (const word of inflect.uncountables) {
        (0, vitest_1.it)("respects the uncountability of " + word, () => {
            (0, vitest_1.expect)((0, src_1.singularize)(word)).toBe(word);
            (0, vitest_1.expect)((0, src_1.pluralize)(word)).toBe(word);
            (0, vitest_1.expect)((0, src_1.singularize)(word)).toBe((0, src_1.pluralize)(word));
        });
    }
    (0, vitest_1.it)("checks uncountable word is not greedy", () => {
        const uncountableWord = "ors";
        const countableWord = "sponsor";
        inflect.uncountables.push(uncountableWord);
        (0, vitest_1.expect)((0, src_1.singularize)(uncountableWord)).toBe(uncountableWord);
        (0, vitest_1.expect)((0, src_1.pluralize)(uncountableWord)).toBe(uncountableWord);
        (0, vitest_1.expect)((0, src_1.singularize)(uncountableWord)).toBe((0, src_1.pluralize)(uncountableWord));
        (0, vitest_1.expect)((0, src_1.singularize)(countableWord)).toBe("sponsor");
        (0, vitest_1.expect)((0, src_1.pluralize)(countableWord)).toBe("sponsors");
        (0, vitest_1.expect)((0, src_1.singularize)((0, src_1.pluralize)(countableWord))).toBe("sponsor");
    });
    for (const [singular, plural] of Object.entries(cases_1.default.SingularToPlural)) {
        (0, vitest_1.it)("properly pluralizes " + singular, () => {
            (0, vitest_1.expect)((0, src_1.pluralize)(singular)).toBe(plural);
            (0, vitest_1.expect)((0, src_1.pluralize)((0, src_1.capitalize)(singular))).toBe((0, src_1.capitalize)(plural));
        });
        (0, vitest_1.it)("properly pluralizes " + plural, () => {
            (0, vitest_1.expect)((0, src_1.pluralize)(plural)).toBe(plural);
            (0, vitest_1.expect)((0, src_1.pluralize)((0, src_1.capitalize)(plural))).toBe((0, src_1.capitalize)(plural));
        });
        (0, vitest_1.it)("properly singularizes " + plural, () => {
            (0, vitest_1.expect)((0, src_1.singularize)(plural)).toBe(singular);
            (0, vitest_1.expect)((0, src_1.singularize)((0, src_1.capitalize)(plural))).toBe((0, src_1.capitalize)(singular));
        });
        (0, vitest_1.it)("properly singularizes " + singular, () => {
            (0, vitest_1.expect)((0, src_1.singularize)(singular)).toBe(singular);
            (0, vitest_1.expect)((0, src_1.singularize)((0, src_1.capitalize)(singular))).toBe((0, src_1.capitalize)(singular));
        });
    }
    (0, vitest_1.it)("allows overwriting defined inflectors", () => {
        (0, vitest_1.expect)((0, src_1.singularize)("series")).toBe("series");
        inflect.singular("series", "serie");
        (0, vitest_1.expect)((0, src_1.singularize)("series")).toBe("serie");
    });
    for (const [mixture, titleized] of Object.entries(cases_1.default.MixtureToTitleCase)) {
        (0, vitest_1.it)("properly titleizes " + mixture, () => {
            (0, vitest_1.expect)((0, src_1.titleize)(mixture)).toBe(titleized);
        });
    }
    for (const [camel, underscore] of Object.entries(cases_1.default.CamelToUnderscore)) {
        (0, vitest_1.it)("properly camelizes " + underscore, () => {
            (0, vitest_1.expect)((0, src_1.camelize)(underscore)).toBe(camel);
        });
    }
    (0, vitest_1.it)("properly camelizes with lower downcases the first letter", () => {
        (0, vitest_1.expect)((0, src_1.camelize)("Capital", false)).toBe("capital");
    });
    (0, vitest_1.it)("properly camelizes with underscores", () => {
        (0, vitest_1.expect)((0, src_1.camelize)("Camel_Case")).toBe("CamelCase");
    });
    (0, vitest_1.it)("properly handles acronyms", () => {
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
            ["RoRails", "ro_rails", "Ro rails", "Ro Rails"],
        ];
        for (const [camel, under, human, title] of items) {
            (0, vitest_1.expect)((0, src_1.camelize)(under)).toBe(camel);
            (0, vitest_1.expect)((0, src_1.camelize)(camel)).toBe(camel);
            (0, vitest_1.expect)((0, src_1.underscore)(under)).toBe(under);
            (0, vitest_1.expect)((0, src_1.underscore)(camel)).toBe(under);
            (0, vitest_1.expect)((0, src_1.titleize)(under)).toBe(title);
            (0, vitest_1.expect)((0, src_1.titleize)(camel)).toBe(title);
            (0, vitest_1.expect)((0, src_1.humanize)(under)).toBe(human);
        }
    });
    (0, vitest_1.it)("allows overwriting acronyms", () => {
        inflect.acronym("API");
        inflect.acronym("LegacyApi");
        (0, vitest_1.expect)((0, src_1.camelize)("legacyapi")).toBe("LegacyApi");
        (0, vitest_1.expect)((0, src_1.camelize)("legacy_api")).toBe("LegacyAPI");
        (0, vitest_1.expect)((0, src_1.camelize)("some_legacyapi")).toBe("SomeLegacyApi");
        (0, vitest_1.expect)((0, src_1.camelize)("nonlegacyapi")).toBe("Nonlegacyapi");
    });
    (0, vitest_1.it)("properly handles lower camelized acronyms", () => {
        inflect.acronym("API");
        inflect.acronym("HTML");
        (0, vitest_1.expect)((0, src_1.camelize)("html_api", false)).toBe("htmlAPI");
        (0, vitest_1.expect)((0, src_1.camelize)("htmlAPI", false)).toBe("htmlAPI");
        (0, vitest_1.expect)((0, src_1.camelize)("HTMLAPI", false)).toBe("htmlAPI");
    });
    (0, vitest_1.it)("properly handles lower camelized acronyms", () => {
        inflect.acronym("API");
        inflect.acronym("JSON");
        inflect.acronym("HTML");
        (0, vitest_1.expect)((0, src_1.underscore)("JSONHTMLAPI")).toBe("json_html_api");
    });
    (0, vitest_1.it)("properly underscores", () => {
        for (const [camel, underscored] of Object.entries(cases_1.default.CamelToUnderscore)) {
            (0, vitest_1.expect)((0, src_1.underscore)(camel)).toBe(underscored);
        }
        for (const [camel, underscored] of Object.entries(cases_1.default.CamelToUnderscoreWithoutReverse)) {
            (0, vitest_1.expect)((0, src_1.underscore)(camel)).toBe(underscored);
        }
    });
    (0, vitest_1.it)("properly adds a foreign key suffix", () => {
        for (const [klass, foreignKeyized] of Object.entries(cases_1.default.ClassNameToForeignKeyWithUnderscore)) {
            (0, vitest_1.expect)((0, src_1.foreignKey)(klass)).toBe(foreignKeyized);
        }
        for (const [klass, foreignKeyized] of Object.entries(cases_1.default.ClassNameToForeignKeyWithoutUnderscore)) {
            (0, vitest_1.expect)((0, src_1.foreignKey)(klass, false)).toBe(foreignKeyized);
        }
    });
    (0, vitest_1.it)("properly tableizes class names", () => {
        for (const [className, tableName] of Object.entries(cases_1.default.ClassNameToTableName)) {
            (0, vitest_1.expect)((0, src_1.tableize)(className)).toBe(tableName);
        }
    });
    (0, vitest_1.it)("properly classifies table names", () => {
        for (const [className, tableName] of Object.entries(cases_1.default.ClassNameToTableName)) {
            (0, vitest_1.expect)((0, src_1.classify)(tableName)).toBe(className);
            (0, vitest_1.expect)((0, src_1.classify)("table_prefix." + tableName)).toBe(className);
        }
    });
    (0, vitest_1.it)("properly classifies with leading schema name", () => {
        (0, vitest_1.expect)((0, src_1.classify)("schema.foo_bar")).toBe("FooBar");
    });
    (0, vitest_1.it)("properly humanizes underscored strings", () => {
        for (const [underscore, human] of Object.entries(cases_1.default.UnderscoreToHuman)) {
            (0, vitest_1.expect)((0, src_1.humanize)(underscore)).toBe(human);
        }
    });
    (0, vitest_1.it)("properly humanizes underscored strings without capitalize", () => {
        for (const [underscore, human] of Object.entries(cases_1.default.UnderscoreToHumanWithoutCapitalize)) {
            (0, vitest_1.expect)((0, src_1.humanize)(underscore, { capitalize: false })).toBe(human);
        }
    });
    (0, vitest_1.it)("properly humanizes by rule", () => {
        inflect.human(/_cnt$/i, "_count");
        inflect.human(/^prefx_/i, "");
        (0, vitest_1.expect)((0, src_1.humanize)("jargon_cnt")).toBe("Jargon count");
        (0, vitest_1.expect)((0, src_1.humanize)("prefx_request")).toBe("Request");
    });
    (0, vitest_1.it)("properly humanizes by string", () => {
        inflect.human("col_rpted_bugs", "Reported bugs");
        (0, vitest_1.expect)((0, src_1.humanize)("col_rpted_bugs")).toBe("Reported bugs");
        (0, vitest_1.expect)((0, src_1.humanize)("COL_rpted_bugs")).toBe("Col rpted bugs");
    });
    (0, vitest_1.it)("properly generates ordinal suffixes", () => {
        for (const [number, ordinalized] of Object.entries(cases_1.default.OrdinalNumbers)) {
            (0, vitest_1.expect)(ordinalized).toBe(number + (0, src_1.ordinal)(number));
        }
    });
    (0, vitest_1.it)("properly ordinalizes numbers", () => {
        for (const [number, ordinalized] of Object.entries(cases_1.default.OrdinalNumbers)) {
            (0, vitest_1.expect)((0, src_1.ordinalize)(number)).toBe(ordinalized);
        }
    });
    (0, vitest_1.it)("properly dasherizes underscored strings", () => {
        for (const [underscored, dasherized] of Object.entries(cases_1.default.UnderscoresToDashes)) {
            (0, vitest_1.expect)((0, src_1.dasherize)(underscored)).toBe(dasherized);
        }
    });
    (0, vitest_1.it)("properly underscores as reverse of dasherize", () => {
        for (const [underscored, _dasherized] of Object.entries(cases_1.default.UnderscoresToDashes)) {
            (0, vitest_1.expect)((0, src_1.underscore)((0, src_1.dasherize)(underscored))).toBe(underscored);
        }
    });
    (0, vitest_1.it)("properly underscores to lower camel", () => {
        for (const [underscored, lowerCamel] of Object.entries(cases_1.default.UnderscoreToLowerCamel)) {
            (0, vitest_1.expect)((0, src_1.camelize)(underscored, false)).toBe(lowerCamel);
        }
    });
    (0, vitest_1.it)("respects the inflector locale", () => {
        (0, src_1.setInflections)("es", function (inflect) {
            inflect.plural(/$/, "s");
            inflect.plural(/z$/i, "ces");
            inflect.singular(/s$/, "");
            inflect.singular(/es$/, "");
            inflect.irregular("el", "los");
        });
        (0, vitest_1.expect)((0, src_1.pluralize)("hijo", "es")).toBe("hijos");
        (0, vitest_1.expect)((0, src_1.pluralize)("luz", "es")).toBe("luces");
        (0, vitest_1.expect)((0, src_1.pluralize)("luz")).toBe("luzs");
        (0, vitest_1.expect)((0, src_1.singularize)("sociedades", "es")).toBe("sociedad");
        (0, vitest_1.expect)((0, src_1.singularize)("sociedades")).toBe("sociedade");
        (0, vitest_1.expect)((0, src_1.pluralize)("el", "es")).toBe("los");
        (0, vitest_1.expect)((0, src_1.pluralize)("el")).toBe("els");
        (0, src_1.setInflections)("es", function (inflect) {
            inflect.clear();
        });
        (0, vitest_1.expect)((0, src_1.inflections)("es").plurals.length).toBe(0);
        (0, vitest_1.expect)((0, src_1.inflections)("es").singulars.length).toBe(0);
        (0, vitest_1.expect)((0, src_1.inflections)().plurals.length).not.toBe(0);
        (0, vitest_1.expect)((0, src_1.inflections)().singulars.length).not.toBe(0);
    });
    (0, vitest_1.describe)("pluralization", () => {
        for (const [singular, plural] of Object.entries(cases_1.default.Irregularities)) {
            (0, vitest_1.it)("respects the irregularity between " + singular + " and " + plural, () => {
                (0, src_1.setInflections)("en", function (inflect) {
                    inflect.irregular(singular, plural);
                });
                (0, vitest_1.expect)((0, src_1.singularize)(plural)).toBe(singular);
                (0, vitest_1.expect)((0, src_1.pluralize)(singular)).toBe(plural);
            });
        }
        for (const [singular, plural] of Object.entries(cases_1.default.Irregularities)) {
            (0, vitest_1.it)("makes sure that pluralize of irregularity " + plural + " is the same", () => {
                (0, src_1.setInflections)("en", function (inflect) {
                    inflect.irregular(singular, plural);
                });
                (0, vitest_1.expect)((0, src_1.pluralize)(plural)).toBe(plural);
            });
        }
        for (const [singular, plural] of Object.entries(cases_1.default.Irregularities)) {
            (0, vitest_1.it)("makes sure that singularize of irregularity " + singular + " is the same", () => {
                (0, src_1.setInflections)("en", function (inflect) {
                    inflect.irregular(singular, plural);
                });
                (0, vitest_1.expect)((0, src_1.singularize)(singular)).toBe(singular);
            });
        }
    });
    for (const scope of ["plurals", "singulars", "uncountables", "humans"]) {
        (0, vitest_1.it)("properly clears " + scope + " inflection scope", () => {
            (0, src_1.setInflections)("en", function (inflect) {
                inflect.clear(scope);
            });
            (0, vitest_1.expect)((0, src_1.inflections)("en")[scope].length).toBe(0);
        });
    }
    (0, vitest_1.it)("properly clears all reflection scopes", () => {
        (0, src_1.setInflections)("en", function (inflect) {
            // ensure any data is present
            inflect.plural(/(quiz)$/i, "$1zes");
            inflect.singular(/(database)s$/i, "$1");
            inflect.uncountable("series");
            inflect.human("col_rpted_bugs", "Reported bugs");
            inflect.clear("all");
            (0, vitest_1.expect)(inflect.plurals.length).toBe(0);
            (0, vitest_1.expect)(inflect.singulars.length).toBe(0);
            (0, vitest_1.expect)(inflect.uncountables.length).toBe(0);
            (0, vitest_1.expect)(inflect.humans.length).toBe(0);
        });
    });
    (0, vitest_1.it)("properly clears with default", () => {
        (0, src_1.setInflections)("es", function (inflect) {
            // ensure any data is present
            inflect.plural(/(quiz)$/i, "$1zes");
            inflect.singular(/(database)s$/i, "$1");
            inflect.uncountable("series");
            inflect.human("col_rpted_bugs", "Reported bugs");
            inflect.clear();
            (0, vitest_1.expect)(inflect.plurals.length).toBe(0);
            (0, vitest_1.expect)(inflect.singulars.length).toBe(0);
            (0, vitest_1.expect)(inflect.uncountables.length).toBe(0);
            (0, vitest_1.expect)(inflect.humans.length).toBe(0);
        });
    });
    (0, vitest_1.it)("properly parameterizes", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterized)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString)).toBe(parameterizedString);
        }
    });
    (0, vitest_1.it)("properly parameterizes and normalizes", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterizedAndNormalized)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString)).toBe(parameterizedString);
        }
    });
    (0, vitest_1.it)("properly parameterizes with custom separator", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterizeWithUnderscore)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString, { separator: "_" })).toBe(parameterizedString);
        }
    });
    (0, vitest_1.it)("properly parameterizes with no separator", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterizeWithNoSeparator)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString, { separator: null })).toBe(parameterizedString);
            (0, vitest_1.expect)((0, src_1.parameterize)(someString, { separator: "" })).toBe(parameterizedString);
        }
    });
    (0, vitest_1.it)("properly parameterizes with preserve-case option", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterizeWithPreserveCase)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString, { preserveCase: true })).toBe(parameterizedString);
        }
    });
    (0, vitest_1.it)("properly parameterizes with multi character separator", () => {
        for (const [someString, parameterizedString] of Object.entries(cases_1.default.StringToParameterized)) {
            (0, vitest_1.expect)((0, src_1.parameterize)(someString, { separator: "__sep__" })).toBe(parameterizedString.replace(/-/g, "__sep__"));
        }
    });
    (0, vitest_1.it)("allows overwriting transliterate approximations", () => {
        (0, vitest_1.expect)((0, src_1.parameterize)("Jürgen")).toBe("jurgen");
        (0, src_1.setTransliterations)("en", (transliterate) => {
            transliterate.approximate("ü", "ue");
        });
        (0, vitest_1.expect)((0, src_1.parameterize)("Jürgen")).toBe("juergen");
    });
    (0, vitest_1.it)("allows overwriting transliterate approximations for a specific locale", () => {
        (0, vitest_1.expect)((0, src_1.parameterize)("Mädchen")).toBe("madchen");
        (0, vitest_1.expect)((0, src_1.parameterize)("Mädchen", { locale: "de" })).toBe("madchen");
        (0, src_1.setTransliterations)("de", (transliterate) => {
            transliterate.approximate("ä", "ae");
        });
        (0, vitest_1.expect)((0, src_1.parameterize)("Mädchen")).toBe("madchen");
        (0, vitest_1.expect)((0, src_1.parameterize)("Mädchen", { locale: "de" })).toBe("maedchen");
    });
    (0, vitest_1.it)("properly converts words to constant case", () => {
        for (const [words, constantCase] of Object.entries(cases_1.default.WordsToConstantCase)) {
            (0, vitest_1.expect)((0, src_1.constantify)(words)).toBe(constantCase);
        }
    });
});
