import React from "react";
import "./style/Card.scss";

const CardPage = ({ q, value, onChange, S, ABCDE }) => {
  return (
    <aside className="omr-card" style={{ ...(S?.sticky || {}), minHeight: 260 }}>
      <div className="omr-title">OMR</div>

      {q.type === "mc" ? (
        <div className="omr-options">
          {ABCDE.map((label, i) => {
            const checked = value === i;
            return (
              <label key={i} className="omr-row">
                <input
                  className="omr-mark"
                  type="checkbox"                    // 지시사항: 체크박스 UI
                  checked={!!checked}
                  onChange={() => onChange(checked ? null : i)}  // 단일선택 강제
                />
                <span className="omr-label">{label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="omr-subjective">
          <div className="omr-help">주관식 정답 입력</div>
          <input
            className="omr-text"
            placeholder="정답 입력"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </aside>
  );
};

export default CardPage;