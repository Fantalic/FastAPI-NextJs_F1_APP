
interface IProps {
    text:string, 
    highlight:string
}
export default function HighlightedText({ text, highlight }: IProps) {
    if (!highlight) return <span>{text}</span>;
  
    // Regex: Suche nach dem Suchbegriff, case-insensitive, global
    const regex = new RegExp(`(${highlight})`, 'gi');
  
    // Text in Teile splitten — Treffer und Nicht-Treffer
    const parts = text.split(regex);
  
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: 'yellow' }}>
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  }