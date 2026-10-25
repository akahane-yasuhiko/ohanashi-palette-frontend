import { MAX_KANJI_GRADE, MIN_KANJI_GRADE } from "../../features/theme/preferences";

type Props = {
  grade: number;
  onChange: (grade: number) => void;
};

const GRADES: number[] = Array.from(
  { length: MAX_KANJI_GRADE - MIN_KANJI_GRADE + 1 },
  (_, i) => MIN_KANJI_GRADE + i,
);

/** 画面上部に出す漢字の学年セレクトボックス */
export function KanjiGradeSelect({ grade, onChange }: Props) {
  return (
    <label className="grade-select">
      <span>かんじ</span>
      <select value={grade} onChange={(e) => onChange(Number(e.target.value))}>
        {GRADES.map((g) => (
          <option key={g} value={g}>
            小学{g}年生まで
          </option>
        ))}
      </select>
    </label>
  );
}
