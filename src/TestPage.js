import React, { useMemo } from "react";
import CardPage from "./CardPage";

const TestPage = ({
  questions,
  current,
  setCurrent,
  seconds,           // 전달받지만 화면에 표시 안 함
  onSubmit,
  answers,
  setAnswerAt,
  S,
  timeTxt,          // 전달받지만 화면에 표시 안 함
  ABCDE,
  visibleIndices = null,
  onBackToStart = null,
}) => {
  const total = visibleIndices ? visibleIndices.length : questions.length;
  const qIndex = visibleIndices ? visibleIndices[current] : current;
  const q = questions[qIndex];
  const pct = Math.round(((current + 1) / total) * 100);

  const isAnswered = (qq, idx) =>
    qq.type === "mc"
      ? answers[idx] !== null
      : String(answers[idx] ?? "").trim().length > 0;

  const allAnswered = useMemo(() => {
    if (!visibleIndices) return questions.every((qq, i) => isAnswered(qq, i));
    return visibleIndices.every((i) => isAnswered(questions[i], i));
  }, [answers, questions, visibleIndices]);

  const setAnswer = (val) => setAnswerAt(qIndex, val);

  return (
    <div className="exam-enter">
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: "#666" }}>
          진행: {current + 1} / {total} ({pct}%)
        </div>
        {onBackToStart && (
          <button style={S.btn} onClick={onBackToStart}>
            처음으로
          </button>
        )}
      </div>

      <div style={S.grid}>
        {/* 좌측 고정 OMR */}
        <CardPage
          q={q}
          value={answers[qIndex]}
          onChange={setAnswer}
          S={S}
          ABCDE={ABCDE}
        />

        {/* 우측 문제 + 네비 + 번호바 */}
        <div>
          {/* 문제 카드 */}
          <section style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              {q.id}. {q.question}
            </div>

            {q.type === "mc" ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {q.choices.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      padding: 10,
                      border: "1px solid #eee",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    {ABCDE[i]}. {c}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: 13, color: "#666" }}>
                답변은 좌측 OMR 입력창에 작성한다.
              </div>
            )}
          </section>

          {/* 네비게이션 */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              style={{ ...S.btn, ...(current === 0 ? S.btnDisabled : {}) }}
              disabled={current === 0}
              onClick={() => setCurrent((i) => Math.max(0, i - 1))}
              aria-label="이전 문제"
            >
              ◀
            </button>
            <button
              style={{ ...S.btn, ...(current === total - 1 ? S.btnDisabled : {}) }}
              disabled={current === total - 1}
              onClick={() => setCurrent((i) => Math.min(total - 1, i + 1))}
              aria-label="다음 문제"
            >
              ▶
            </button>

            <div style={{ marginLeft: "auto" }} />

            <button
              style={{ ...S.btnPrimary, ...(allAnswered ? {} : S.btnDisabled) }}
              disabled={!allAnswered}
              onClick={onSubmit}
            >
              제출
            </button>
          </div>

          {/* 하단 번호 점프바: visibleIndices가 있으면 오답만 */}
          <div style={S.numberBar}>
            {(visibleIndices ?? questions.map((_, i) => i)).map((i, idx) => {
              const answered = isAnswered(questions[i], i);
              const isCurrent = idx === current;
              const label = questions[i].id;
              return (
                <button
                  key={i}
                  style={S.numberBtn(isCurrent, answered)}
                  onClick={() => setCurrent(idx)}
                  aria-label={`${label}번으로 이동`}
                  title={`${label}번 문제로 이동`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;