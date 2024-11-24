import { describe, expect, it } from "vitest";
import { AhoCorasick } from "../src/ahoCorasick";

describe("Aho corasick search", () => {
  it("should find single keyword 'hero'", () => {
    const aho = new AhoCorasick(["hero", "heroic"]);
    const result = aho.search("hero");
    expect(result).toEqual([[3, "hero"]]);
  });

  it("should find multiple hero-related keywords", () => {
    const aho = new AhoCorasick(["hero", "heroic", "heroism"]);
    const result = aho.search("the hero performed a heroic act of heroism");
    expect(result).toEqual([
      [7, "hero"],
      [26, "heroic"],
      [41, "heroism"],
    ]);
  });

  it("should find numbered keywords", () => {
    const aho = new AhoCorasick(["keyword1", "keyword2", "etc"]);
    const result = aho.search("should find keyword1 at position 19 and keyword2 at position 30.");
    expect(result).toEqual([
      [19, "keyword1"],
      [47, "keyword2"],
    ]);
  });

  it("should find pronouns", () => {
    const aho = new AhoCorasick(["he", "she", "his", "hers"]);
    const result = aho.search("she was expecting his visit");
    expect(result).toEqual([
      [2, "she"],
      [20, "his"],
    ]);
  });

  it("should handle special characters", () => {
    const aho = new AhoCorasick(["àéçp?ẃ", "éâà"]);
    const result = aho.search("éâàqwfwéâéeqfwéâàqef àéçp?ẃ wqqryht cp?");
    expect(result).toEqual([[26, "àéçp?ẃ"]]);
  });

  it("should handle escape characters", () => {
    const aho = new AhoCorasick(["**", "666", "his", "n", "\\", "\n"]);
    const result = aho.search("\n & 666 ==! \n");
    expect(result).toEqual([
      [0, "\n"],
      [6, "666"],
      [12, "\n"],
    ]);
  });

  it("should handle cyrillic characters", () => {
    const aho = new AhoCorasick(["Федеральной", "ной", "idea"]);
    const result = aho.search("! Федеральной I have no idea what this means.");
    expect(result).toEqual([
      [12, "Федеральной"],
      [27, "idea"],
    ]);
  });

  it("should handle emojis and special symbols", () => {
    const aho = new AhoCorasick(["bla", "😁", "😀", "°□°", "w", "┻━┻"]);
    const result = aho.search("-  (╯°□°）╯︵ ┻━┻ ");
    expect(result).toEqual([
      [7, "°□°"],
      [14, "┻━┻"],
    ]);
  });

  it("should handle adjacent matches", () => {
    const aho = new AhoCorasick(["abc", "def"]);
    const result = aho.search("abcdef should match both abc and def");
    expect(result).toEqual([
      [2, "abc"],
      [5, "def"],
      [27, "abc"],
      [35, "def"],
    ]);
  });

  it("should not match multiple adjacent matches that don't end with a word boundary", () => {
    const aho = new AhoCorasick(["abc", "xyz"]);
    const result = aho.search("abcxyzG");
    expect(result).toEqual([]);
  });

  it("should handle multiple adjacent matches", () => {
    const aho = new AhoCorasick(["abc", "xyz"]);
    const result = aho.search("abcxyzabcxyzxyz");
    expect(result).toEqual([
      [2, "abc"],
      [5, "xyz"],
      [8, "abc"],
      [11, "xyz"],
      [14, "xyz"],
    ]);
  });

  it("should not match multiple adjacent matches that don't end with a word boundary", () => {
    const aho = new AhoCorasick(["abc", "xyz"]);
    const result = aho.search("abcxyzabcxyzxyzG");
    expect(result).toEqual([]);
  });

  it("should not match multiple adjacent matches that end with a partial second match", () => {
    const aho = new AhoCorasick(["abc", "xyz"]);
    const result = aho.search("abcxyzabcxyza");
    expect(result).toEqual([]);
  });

  it("should handle substring matches", () => {
    const aho = new AhoCorasick(["cat", "catch"]);
    const result = aho.search("catch the cat and catch");
    expect(result).toEqual([
      [4, "catch"],
      [12, "cat"],
      [22, "catch"],
    ]);
  });

  describe("prefix search", () => {
    it("should find exact prefix match", () => {
      const aho = new AhoCorasick(["hero", "heroic"]);
      const result = aho.search("hero", undefined, true);
      expect(result).toEqual([[3, "hero"]]);
    });

    it("should not match non-prefix occurrences", () => {
      const aho = new AhoCorasick(["hero", "heroic"]);
      const result = aho.search("the heroic", undefined, true);
      expect(result).toEqual([]);
    });

    it("should match longer prefix", () => {
      const aho = new AhoCorasick(["hero", "heroic", "heroism"]);
      const result = aho.search("heroic acts of heroism", undefined, true);
      expect(result).toEqual([[5, "heroic"]]);
    });

    it("should match pronoun prefixes", () => {
      const aho = new AhoCorasick(["he", "she", "his", "hers"]);
      const result = aho.search("she was here", undefined, true);
      expect(result).toEqual([[2, "she"]]);
    });

    it("should handle special character prefixes", () => {
      const aho = new AhoCorasick(["éâà", "éâàbc"]);
      const result = aho.search("éâàbc test", undefined, true);
      expect(result).toEqual([[4, "éâàbc"]]);
    });

    it("should handle nested domain extensions", () => {
      const aho = new AhoCorasick([".com", ".com.au"]);
      const result = aho.search(".com.au test", undefined, true);
      expect(result).toEqual([[6, ".com.au"]]);
    });

    it("should handle overlapping prefix matches", () => {
      const aho = new AhoCorasick(["abc", "def"]);
      const result = aho.search("abcdef abc", undefined, true);
      expect(result).toEqual([
        [2, "abc"],
        [5, "def"],
      ]);
    });

    it("should not match prefixes that aren't terminated by a word boundary", () => {
      const aho = new AhoCorasick(["abc", "def"]);
      const result = aho.search("abczzz", undefined, true);
      expect(result).toEqual([]);
    });

    it("should not match prefixes that aren't terminated by a word boundary and a partial second match", () => {
      const aho = new AhoCorasick(["abc", "def"]);
      const result = aho.search("abcde", undefined, true);
      expect(result).toEqual([]);
    });

    it("should handle substring prefix matches", () => {
      const aho = new AhoCorasick(["cat", "catch"]);
      const result = aho.search("catch", undefined, true);
      expect(result).toEqual([[4, "catch"]]);
    });
  });
});
