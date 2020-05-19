export interface TextWrapper {
  measure: (text: string) => number;
}

export function inTextWrapper<A>(doc: HTMLDocument, className: string, width: number, callback: (wrapper: TextWrapper) => A): A {
  const el = doc.createElement('div');

  el.className = className;
  el.style.visibility = 'hidden';
  el.style.display = 'inline-block';
  el.style.width = 'auto';
  el.style.whiteSpace = 'nowrap';

  doc.body.appendChild(el);

  const result: A = callback({
    measure: (text) => {
      el.innerText = text;

      return el.scrollWidth;
    }
  });

  el.remove();

  return result;
}

export function textToParagraphs(text: string): Array<string> {
  return text.split('\n');
}

export function textToWords(text: string): Array<string> {
  return text.split(' ');
}

export function joinWords(w1: string, w2: string): string {
  return [w1, w2].map((w) => w.trim()).filter(Boolean).join(' ');
}

export function paragraphsToLines(paragraphs: Array<string>, lineWidth: number, textWrapper: TextWrapper): Array<string> {
  return paragraphs.reduce(
    (acc, para) => {
      return acc.concat(wordsToLines(textToWords(para), lineWidth, textWrapper));
    },
    []
  );
}

export function wordsToLines(words: Array<string>, lineWidth: number, textWrapper: TextWrapper): Array<string> {
  const fittingWordCount = howManyExtraWordsFit('', words, lineWidth, textWrapper);
  const line = words.slice(0, fittingWordCount + 1).reduce(joinWords, '');
  const remainingWords = words.slice(fittingWordCount + 1);

  if (remainingWords.length > 0) {
    return [line, ...wordsToLines(remainingWords, lineWidth, textWrapper)];
  } else {
    return [line];
  }
}

export function howManyExtraWordsFit(sentence: string, words: Array<string>, lineWidth: number, textWrapper: TextWrapper): number {
  if (words.length === 0) {
    return 0;
  }

  const extendedSentence = joinWords(sentence, words[0]);

  if (textWrapper.measure(extendedSentence) <= lineWidth) {
    return 1 + howManyExtraWordsFit(extendedSentence, words.slice(1), lineWidth, textWrapper);
  } else {
    return 0;
  }
}