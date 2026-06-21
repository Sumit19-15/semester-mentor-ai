import React, { useState, useEffect } from 'react';

export default function TypewriterText({ text, speed = 10, isNew = false }) {
  const [displayedText, setDisplayedText] = useState(isNew ? '' : text);

  useEffect(() => {
    if (!isNew) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isNew, speed]);

  return <>{displayedText}</>;
}
