import React, { useMemo } from "react";
import CardPage from "./CardPage";
import "./style/TestPage.scss"; // 스타일 임포트 유지

const TestPage = ({
  questions,
  current,
  setCurrent,
  seconds,           // 화면 표시 안 함
  onSubmit,          // 제출 핸들러
  answers,
  setAnswerAt,
  S,
  timeTxt,          // 화면 표시 안 함
  ABCDE,
  visibleIndices = null,
  onBackToStart = null,
}) => {
  const total = visibleIndices ? visibleIndices.length : questions.length;
  const qIndex = visibleIndices ? visibleIndices[current] : current;
  const q = questions[qIndex];

  const isAnswered = (qq, idx) =>
    qq.type === "mc"
      ? answers[idx] !== null
      : String(answers[idx] ?? "").trim().length > 0;

  // 모든 문항이 답변되었는지(오답 재풀이 모드면 그 부분 집합 기준)
  const allAnswered = useMemo(() => {
    if (!visibleIndices) return questions.every((qq, i) => isAnswered(qq, i));
    return visibleIndices.every((i) => isAnswered(questions[i], i));
  }, [answers, questions, visibleIndices]);

  const setAnswer = (val) => setAnswerAt(qIndex, val);

  const onChoiceClick = (choiceIdx) => {
    if (q.type !== "mc") return;
    setAnswer(choiceIdx); // 단일 선택
  };

  const pageNow = current + 1;
  const pageTotal = total;

  return (
    <div className="exam-enter testpage">
      {/* 상단: 홈만 남김 */}
      <header className="tp-header">
        <div className="tp-left">
          {onBackToStart && (
            <button className="tp-btn tp-home" onClick={onBackToStart}>
              처음으로
            </button>
          )}
        </div>
        <div className="tp-pager-placeholder" />
        <div className="tp-right" />
      </header>

      {/* 본문: 책 페이지 + 우측 OMR */}
      <div className="tp-main">
        <section className="tp-sheet" aria-labelledby="tp-question-title">
          <div className="tp-question">
            <h2 id="tp-question-title" className="tp-q-title">
              {q.id}. {q.question}
            </h2>

            {q.type === "mc" ? (
              <ul className="tp-choices" role="listbox" aria-label="선다형 보기">
                {q.choices.map((c, i) => {
                  const selected = answers[qIndex] === i;
                  return (
                    <li
                      key={i}
                      className={`tp-choice ${selected ? "is-selected" : ""}`}
                      onClick={() => onChoiceClick(i)}
                      role="option"
                      aria-selected={selected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onChoiceClick(i);
                      }}
                    >
                      <span className="tp-choice-key">{ABCDE[i]}</span>
                      <span className="tp-choice-text">{c}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="tp-short-answer-note">
                답변은 우측 OMR 입력창에 작성한다.
              </div>
            )}
          </div>

          {/* 하단: 페이지 네비(제출 버튼 자리로 이동했던 것) */}
          <div className="tp-bottom">
            <div className="tp-pager" role="navigation" aria-label="문제 페이지">
              <button
                className="tp-arrow"
                onClick={() => setCurrent((i) => Math.max(0, i - 1))}
                disabled={current === 0}
                aria-label="이전 문제"
                title="이전 문제"
              >
                ◀
              </button>
              <span className="tp-page">
                {pageNow} / {pageTotal}
              </span>
              <button
                className="tp-arrow"
                onClick={() => setCurrent((i) => Math.min(total - 1, i + 1))}
                disabled={current === total - 1}
                aria-label="다음 문제"
                title="다음 문제"
              >
                ▶
              </button>
            </div>
          </div>
        </section>

        {/* 우측 고정 OMR + 제출하기 버튼(여기!) */}
        <aside className="tp-omr" aria-label="OMR 카드">
          <CardPage
            q={q}
            value={answers[qIndex]}
            onChange={setAnswer}
            S={S}
            ABCDE={ABCDE}
          />

          <div className="tp-submit-wrap">
            <button
              className={`tp-submit ${allAnswered ? "is-ready" : ""}`}
              onClick={onSubmit}
              disabled={!allAnswered}
              aria-disabled={!allAnswered}
              title={
                allAnswered
                  ? "제출합니다"
                  : "모든 문항에 답하면 제출 버튼이 활성화됩니다"
              }
            >
              제출하기
            </button>
            {!allAnswered && (
              <p className="tp-submit-hint">
                모든 문항에 답하면 제출할 수 있습니다.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TestPage;