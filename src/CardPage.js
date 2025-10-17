import React from "react";

const CardPage = ({ q, value, onChange, S, ABCDE }) => {
  return (
    <aside style={{ ...S.sticky, minHeight: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>OMR</div>

      {q.type === "mc" ? (
        <div>
          {ABCDE.map((label, i) => {
            const checked = value === i;
            return (
              <label key={i} style={S.row}>
                <input
                  type="checkbox"       // 체크박스 UI 요구
                  checked={!!checked}
                  onChange={() => onChange(checked ? null : i)} // 단일선택 강제
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>주관식 정답 입력</div>
          <input
            placeholder="정답 입력"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
          />
        </div>
      )}
    </aside>
  );
};

export default CardPage;