"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ahoCorasick_1 = require("../src/ahoCorasick");
(0, vitest_1.describe)("Aho corasick search", () => {
    (0, vitest_1.it)("should find single keyword 'hero'", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["hero", "heroic"]);
        const result = aho.search("hero");
        (0, vitest_1.expect)(result).toEqual([[3, "hero"]]);
    });
    (0, vitest_1.it)("should find multiple hero-related keywords", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["hero", "heroic", "heroism"]);
        const result = aho.search("the hero performed a heroic act of heroism");
        (0, vitest_1.expect)(result).toEqual([
            [7, "hero"],
            [26, "heroic"],
            [41, "heroism"],
        ]);
    });
    (0, vitest_1.it)("should find numbered keywords", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["keyword1", "keyword2", "etc"]);
        const result = aho.search("should find keyword1 at position 19 and keyword2 at position 30.");
        (0, vitest_1.expect)(result).toEqual([
            [19, "keyword1"],
            [47, "keyword2"],
        ]);
    });
    (0, vitest_1.it)("should find pronouns", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["he", "she", "his", "hers"]);
        const result = aho.search("she was expecting his visit");
        (0, vitest_1.expect)(result).toEqual([
            [2, "she"],
            [20, "his"],
        ]);
    });
    (0, vitest_1.it)("should handle special characters", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["àéçp?ẃ", "éâà"]);
        const result = aho.search("éâàqwfwéâéeqfwéâàqef àéçp?ẃ wqqryht cp?");
        (0, vitest_1.expect)(result).toEqual([[26, "àéçp?ẃ"]]);
    });
    (0, vitest_1.it)("should handle escape characters", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["**", "666", "his", "n", "\\", "\n"]);
        const result = aho.search("\n & 666 ==! \n");
        (0, vitest_1.expect)(result).toEqual([
            [0, "\n"],
            [6, "666"],
            [12, "\n"],
        ]);
    });
    (0, vitest_1.it)("should handle cyrillic characters", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["Федеральной", "ной", "idea"]);
        const result = aho.search("! Федеральной I have no idea what this means.");
        (0, vitest_1.expect)(result).toEqual([
            [12, "Федеральной"],
            [27, "idea"],
        ]);
    });
    (0, vitest_1.it)("should handle emojis and special symbols", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["bla", "😁", "😀", "°□°", "w", "┻━┻"]);
        const result = aho.search("-  (╯°□°）╯︵ ┻━┻ ");
        (0, vitest_1.expect)(result).toEqual([
            [7, "°□°"],
            [14, "┻━┻"],
        ]);
    });
    (0, vitest_1.it)("should handle adjacent matches", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["abc", "def"]);
        const result = aho.search("abcdef should match both abc and def");
        (0, vitest_1.expect)(result).toEqual([
            [2, "abc"],
            [5, "def"],
            [27, "abc"],
            [35, "def"],
        ]);
    });
    (0, vitest_1.it)("should not match multiple adjacent matches that don't end with a word boundary", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["abc", "xyz"]);
        const result = aho.search("abcxyzG");
        (0, vitest_1.expect)(result).toEqual([]);
    });
    (0, vitest_1.it)("should handle multiple adjacent matches", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["abc", "xyz"]);
        const result = aho.search("abcxyzabcxyzxyz");
        (0, vitest_1.expect)(result).toEqual([
            [2, "abc"],
            [5, "xyz"],
            [8, "abc"],
            [11, "xyz"],
            [14, "xyz"],
        ]);
    });
    (0, vitest_1.it)("should not match multiple adjacent matches that don't end with a word boundary", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["abc", "xyz"]);
        const result = aho.search("abcxyzabcxyzxyzG");
        (0, vitest_1.expect)(result).toEqual([]);
    });
    (0, vitest_1.it)("should not match multiple adjacent matches that end with a partial second match", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["abc", "xyz"]);
        const result = aho.search("abcxyzabcxyza");
        (0, vitest_1.expect)(result).toEqual([]);
    });
    (0, vitest_1.it)("should handle substring matches", () => {
        const aho = new ahoCorasick_1.AhoCorasick(["cat", "catch"]);
        const result = aho.search("catch the cat and catch");
        (0, vitest_1.expect)(result).toEqual([
            [4, "catch"],
            [12, "cat"],
            [22, "catch"],
        ]);
    });
    (0, vitest_1.describe)("prefix search", () => {
        (0, vitest_1.it)("should find exact prefix match", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["hero", "heroic"]);
            const result = aho.search("hero", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[3, "hero"]]);
        });
        (0, vitest_1.it)("should not match non-prefix occurrences", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["hero", "heroic"]);
            const result = aho.search("the heroic", undefined, true);
            (0, vitest_1.expect)(result).toEqual([]);
        });
        (0, vitest_1.it)("should match longer prefix", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["hero", "heroic", "heroism"]);
            const result = aho.search("heroic acts of heroism", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[5, "heroic"]]);
        });
        (0, vitest_1.it)("should match pronoun prefixes", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["he", "she", "his", "hers"]);
            const result = aho.search("she was here", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[2, "she"]]);
        });
        (0, vitest_1.it)("should handle special character prefixes", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["éâà", "éâàbc"]);
            const result = aho.search("éâàbc test", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[4, "éâàbc"]]);
        });
        (0, vitest_1.it)("should handle nested domain extensions", () => {
            const aho = new ahoCorasick_1.AhoCorasick([".com", ".com.au"]);
            const result = aho.search(".com.au test", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[6, ".com.au"]]);
        });
        (0, vitest_1.it)("should handle overlapping prefix matches", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["abc", "def"]);
            const result = aho.search("abcdef abc", undefined, true);
            (0, vitest_1.expect)(result).toEqual([
                [2, "abc"],
                [5, "def"],
            ]);
        });
        (0, vitest_1.it)("should not match prefixes that aren't terminated by a word boundary", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["abc", "def"]);
            const result = aho.search("abczzz", undefined, true);
            (0, vitest_1.expect)(result).toEqual([]);
        });
        (0, vitest_1.it)("should not match prefixes that aren't terminated by a word boundary and a partial second match", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["abc", "def"]);
            const result = aho.search("abcde", undefined, true);
            (0, vitest_1.expect)(result).toEqual([]);
        });
        (0, vitest_1.it)("should handle substring prefix matches", () => {
            const aho = new ahoCorasick_1.AhoCorasick(["cat", "catch"]);
            const result = aho.search("catch", undefined, true);
            (0, vitest_1.expect)(result).toEqual([[4, "catch"]]);
        });
    });
});
