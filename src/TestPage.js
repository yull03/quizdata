import React, { useMemo } from "react";
import CardPage from "./CardPage";
import './style/TestPage.scss';

const TestPage = ({
  questions,
  current,
  setCurrent,
  seconds,           // 전달받지만 화면 표시x
  onSubmit,
  answers,
  setAnswerAt,
  S,
  timeTxt,          // 전달받지만 화면 표시x
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

  const allAnswered = useMemo(() => {
    if (!visibleIndices) return questions.every((qq, i) => isAnswered(qq, i));
    return visibleIndices.every((i) => isAnswered(questions[i], i));
  }, [answers, questions, visibleIndices]);

  const setAnswer = (val) => setAnswerAt(qIndex, val);

  const goPrev = () => setCurrent((i) => Math.max(0, i - 1));
  const goNext = () => setCurrent((i) => Math.min(total - 1, i + 1));

  return (
    <div className="exam-enter testpage">
      {/* 상단: 홈 버튼 + 페이지 네비 */}
      <header className="tp-header">
        <div className="tp-left">
          {onBackToStart && (
            <button className="tp-btn tp-home" onClick={onBackToStart}>
              처음으로
            </button>
          )}
        </div>

        <div className="tp-pager" role="navigation" aria-label="문제 네비게이션">
          <button
            className="tp-arrow"
            onClick={goPrev}
            disabled={current === 0}
            aria-label="이전 문제"
            title="이전 문제"
          >
            ◀
          </button>
          <span className="tp-page">
            {current + 1} / {total}
          </span>
          <button
            className="tp-arrow"
            onClick={goNext}
            disabled={current === total - 1}
            aria-label="다음 문제"
            title="다음 문제"
          >
            ▶
          </button>
        </div>

        <div className="tp-right">{/* 타이머 숨김 유지 */}</div>
      </header>

      {/* 본문: 책 페이지 + 우측 고정 OMR */}
      <div className="tp-main">
        <section className="tp-sheet" aria-labelledby="tp-question-title">
          {/* 문제 본문 */}
          <div className="tp-question">
            <h2 id="tp-question-title" className="tp-q-title">
              {q.id}. {q.question}
            </h2>

            {q.type === "mc" ? (
              <ul className="tp-choices">
                {q.choices.map((c, i) => (
                  <li key={i} className="tp-choice">
                    {ABCDE[i]}. {c}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="tp-short-answer-note">
                답변은 우측 OMR 입력창에 작성한다.
              </div>
            )}
          </div>

          {/* 하단 버튼: 이전/다음/제출 */}
          <div className="tp-actions">
            <button
              className="tp-btn"
              disabled={current === 0}
              onClick={goPrev}
            >
              ◀ 이전
            </button>

            <button
              className="tp-btn tp-primary"
              disabled={!allAnswered}
              onClick={onSubmit}
              title={!allAnswered ? "모든 문항에 답해야 제출할 수 있습니다" : "제출"}
            >
              제출
            </button>

            <button
              className="tp-btn"
              disabled={current === total - 1}
              onClick={goNext}
            >
              다음 ▶
            </button>
          </div>

          {/* 번호 점프바: visibleIndices가 있으면 오답만 */}
          <div className="tp-numberbar">
            {(visibleIndices ?? questions.map((_, i) => i)).map((i, idx) => {
              const answered = isAnswered(questions[i], i);
              const isCurrent = idx === current;
              const label = questions[i].id;
              return (
                <button
                  key={i}
                  className={`tp-num ${isCurrent ? "is-current" : ""} ${
                    answered ? "is-answered" : ""
                  }`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`${label}번으로 이동`}
                  title={`${label}번 문제로 이동`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 우측 고정 OMR */}
        <aside className="tp-omr" aria-label="OMR 카드">
          <CardPage
            q={q}
            value={answers[qIndex]}
            onChange={setAnswer}
            S={S}
            ABCDE={ABCDE}
          />
        </aside>
      </div>
    </div>
  );
};

export default TestPage;