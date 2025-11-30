import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [text] = useState(
    'generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. the writer has no idea what topic the random paragraph will be about when it appears.',
  );
  const [typedText, setTypedText] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);

  const handleKeyDown = useCallback(
    (event: Event) => {
      const e = event as KeyboardEvent;

      if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 32) {
        if (e.keyCode === 32) {
          const nextWordIndex = text.indexOf(' ', typedText.length) + 1;

          for (let i = typedText.length; i < nextWordIndex; i++) {
            setTypedText((prev) => prev + ' ');
          }

          setWordsTyped((prev) => prev + 1);
        } else {
          setTypedText((prev) => prev + e.key);
        }
      }
    },
    [text, typedText.length],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, setTypedText]);

  const arr = useMemo(() => new Array(text.length).fill(undefined), [text]);

  const accuracyCounter = useMemo(
    () =>
      new Array(text.slice(0, typedText.length).length).fill(undefined).reduce(
        (acc, _, index) => {
          console.log(typedText.at(index), text.at(index));
          if (typedText.at(index) === text.at(index)) {
            acc.accurate += 1;
          } else {
            acc.incorrect += 1;
          }

          return acc;
        },
        { accurate: 0, incorrect: 0 },
      ),
    [text, typedText],
  );

  console.log(accuracyCounter);

  return (
    <>
      {arr.map((_, index) =>
        index >= typedText.length ? (
          <span key={index}>{text.at(index)}</span>
        ) : (
          <strong
            key={index}
            style={{
              color: typedText.at(index) !== text.at(index) ? 'red' : undefined,
            }}
          >
            {text.at(index)}
          </strong>
        ),
      )}
      <p>{`${wordsTyped} WPM`}</p>
      <p>{`Accuracy: ${Math.round((accuracyCounter.accurate / (accuracyCounter.accurate + accuracyCounter.incorrect)) * 100)}%`}</p>
    </>
  );
}

export default App;
