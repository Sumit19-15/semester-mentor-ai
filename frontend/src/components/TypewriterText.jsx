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
      // Chunking by a few characters can make it feel smoother and faster for long texts,
      // but 1 char at 10ms is already quite fast (100 chars/sec)
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
