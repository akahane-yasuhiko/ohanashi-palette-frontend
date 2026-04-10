import { MAX_KEYWORDS } from "../../features/story/constants";

type Props = {
  candidates: string[];
  selected: string[];
  onToggle: (keyword: string) => void;
};

export function KeywordSelector({ candidates, selected, onToggle }: Props) {
  const atMax = selected.length >= MAX_KEYWORDS;

  return (
    <div>
      <p className="setup-label">ことばを えらんでね（2〜3こ）</p>
      <div className="card-grid">
        {candidates.map((kw) => {
          const isSelected = selected.includes(kw);
          const disabled = !isSelected && atMax;
          const className = isSelected
            ? "selectable-card selectable-card--selected"
            : "selectable-card";
          return (
            <button
              key={kw}
              type="button"
              className={className}
              disabled={disabled}
              onClick={() => onToggle(kw)}
            >
              {kw}
            </button>
          );
        })}
      </div>
    </div>
  );
}
