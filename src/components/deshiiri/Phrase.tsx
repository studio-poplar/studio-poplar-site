// 短い見出しの改行位置を整える。「、」「。」の後ろで区切り、区切りごとに折り返さない塊にする。
// 例：「継ぐ人がいるから、日本は続く。」→ 幅が足りないときは「継ぐ人がいるから、／日本は続く。」で折れる。
export default function Phrase({ text }: { text: string }) {
  const parts = text.match(/[^、。]+[、。]?/g) ?? [text];
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className="d-ph">
          {part}
        </span>
      ))}
    </>
  );
}
