/**
 * aho-corasick fast string subsearching algorithm implementation
 * taken from https://github.com/sonofmagic/modern-ahocorasick/blob/26c881a43f5da1029b31bba86be5fa1d78df58c9/src/index.ts and modified for our uses to check for word boundaries or subsequent matches for searches
 */
export class AhoCorasick {
  gotoFn: Record<number, Record<string, number>>;
  output: Record<number, string>;
  failure: Record<number, number>;
  constructor(keywords: string[]) {
    this.gotoFn = {
      // 0 is the root state
      0: {},
      // 1 is the word or string boundary state where we can start matching against the keywords
      1: {},
    };
    this.output = {};
    this.failure = {
      1: 0,
    };

    let stateCounter = 1;
    for (const word of keywords) {
      let curr = 1;
      for (const char of word) {
        if (this.gotoFn[curr] && char in this.gotoFn[curr]) {
          curr = this.gotoFn[curr][char];
        } else {
          stateCounter++;
          this.gotoFn[stateCounter] = {};
          this.gotoFn[curr][char] = stateCounter;
          curr = stateCounter;
        }
      }

      this.output[curr] = word;
      // output states can fall back to the word boundary state as they just finished a match
      this.failure[curr] = 1;
    }

    const stateQueue: number[] = [];

    // f(s) = 0 for all states of depth 1 (the ones from which the word boundary state can transition to)
    for (const [_startState, destinationState] of Object.entries(this.gotoFn[1])) {
      this.failure[destinationState] ??= 0;
      stateQueue.push(destinationState);
    }

    while (stateQueue.length > 0) {
      const stateNumber = stateQueue.shift();
      if (stateNumber !== undefined) {
        for (const [fromState, toState] of Object.entries(this.gotoFn[stateNumber])) {
          stateQueue.push(toState);

          // set state = f(r)
          let cursor = this.failure[stateNumber];
          while (cursor > 0 && !(fromState in this.gotoFn[cursor])) {
            cursor = this.failure[cursor];
          }

          if (fromState in this.gotoFn[cursor]) {
            const fs = this.gotoFn[cursor][fromState];
            this.failure[toState] = fs;
            this.output[toState] =
              this.output[fs] && this.output[fs].length > this.output[toState].length ? this.output[fs] : this.output[toState];
          } else {
            this.failure[toState] ??= 0;
          }
        }
      }
      // for each symbol a such that g(r, a) = s
    }
  }

  search(str: string, testWordBoundary = isWordBoundary, prefix = false) {
    let state = 1;
    let matchStack: [number, string][] = [];
    let matchStackPos = 0;
    const results: [number, string][] = [];

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      // if we don't have a transition for the current character, move to the next state based on the failure function links
      while (state > 1 && !(char in this.gotoFn[state])) {
        state = this.failure[state];
      }

      const isWordBoundary = testWordBoundary(char);

      // if we don't have a goto state after following failure links, we should go back to the base state. which base state depends on if we're at a word boundary or not
      let canProcessState = char in this.gotoFn[state];
      if (!canProcessState) {
        if (isWordBoundary) {
          state = 1;
        } else {
          state = 0;
        }
      }

      if (state == 1 && isWordBoundary) {
        // if we are at a word boundary and the match stack has entries, we should add them to the results
        if (matchStack.length > 0 && matchStackPos === i - 1) {
          results.push(...matchStack);
        }
        matchStack = [];
        matchStackPos = 0;

        // now that we're in the word boundary state, see if we can actually process this character
        canProcessState = char in this.gotoFn[state];
      }

      if (!canProcessState) {
        if (prefix) {
          break;
        } else {
          continue;
        }
      }

      state = this.gotoFn[state][char];

      const outputValue = this.output[state];
      if (outputValue) {
        const start = i - outputValue.length + 1;
        const prevMatch = matchStack[matchStack.length - 1];
        if (prevMatch && prevMatch[0] >= start) {
          // if this match is a longer match than the previous one, we should replace it
          matchStack[matchStack.length - 1] = [i, outputValue];
        } else {
          // otherwise, add it to the match stack
          matchStack.push([i, outputValue]);
        }
        matchStackPos = i;
      }
    }

    if (matchStack.length > 0 && matchStackPos === str.length - 1) {
      results.push(...matchStack);
    }

    return results;
  }
}

function isWordBoundary(char: string): boolean {
  const charCode = char.charCodeAt(0);
  const isBasicLatinLetterOrDigit =
    (charCode >= 65 && charCode <= 90) || // A-Z
    (charCode >= 97 && charCode <= 122) || // a-z
    (charCode >= 48 && charCode <= 57); // 0-9

  return !isBasicLatinLetterOrDigit;
}
