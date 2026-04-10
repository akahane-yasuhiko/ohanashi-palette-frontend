import { THEME_CATALOG } from "../../features/story/constants";
import type { Theme } from "../../features/story/types";

type Props = {
  selected: Theme | null;
  onSelect: (theme: Theme) => void;
};

export function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="setup-label">テーマを えらんでね</p>
      <div className="card-grid">
        {THEME_CATALOG.map((entry) => {
          const isSelected = selected === entry.id;
          const className = isSelected
            ? "selectable-card selectable-card--selected"
            : "selectable-card";
          return (
            <button
              key={entry.id}
              type="button"
              className={className}
              onClick={() => onSelect(entry.id)}
            >
              {entry.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
