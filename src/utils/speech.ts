/** SpeechSynthesis を使った読み上げ。再生中に再呼び出しすると停止する。 */
export function speakText(text: string): void {
  if (!window.speechSynthesis) return;

  // 再生中なら停止（トグル動作）
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
}
