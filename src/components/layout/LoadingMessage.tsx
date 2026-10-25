import { useEffect, useState } from "react";

type Props = {
  messages: string[];
};

/** 文言を 2.5 秒ごとに切り替えて表示する */
export function LoadingMessage({ messages }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, [messages]);

  return <h2 className="loading-text">{messages[index % messages.length]}</h2>;
}
