import React, { useMemo } from "react";
import KoreaBook from "./KoreaBook";
import CardPage from "./CardPage";
import "./style/TestPage.scss";

const TestPage = ({
  questions,
  current,
  setCurrent,
  seconds,
  onSubmit,
  answers,
  setAnswerAt,
  S,
  timeTxt,           // 함수일 수도, 문자열일 수도 있음
  ABCDE,
  visibleIndices = null,
  onBackToStart = null,
}) => {

  const fmtTime = (sec) => {
    if (sec == null) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
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

  const onChoiceClick = (choiceIdx) => {
    if (q.type !== "mc") return;
    setAnswer(choiceIdx);
  };

  const pageNow = current + 1;
  const pageTotal = total;

  // 로컬 포맷터(상위에서 timeTxt 함수 주면 그걸 우선 사용)
  const fmtTimeLocal = (sec) => {
    if (sec == null) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const timeDisplay =
    typeof timeTxt === "function" ? timeTxt(seconds) :
    typeof timeTxt === "string"   ? timeTxt :
    fmtTimeLocal(seconds);

  /* ========== 좌측: 문제/선지/페이지 네비 ========== */
  const LeftPage = (
    <section className="tp-sheet" aria-labelledby="tp-question-title">
<header className="tp-header">
  <div className="tp-left" /> {/* 왼쪽 비워둠 */}
  <div className="tp-pager-placeholder" />
</header>

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
                  <span className="tp-choice-text"> {c}</span>
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
    
  );

  /* ========== 우측: 상단 타이머 + OMR + 제출 ========== */
  const RightPage = (
    <aside className="tp-omr" aria-label="OMR 카드">
      {/* 책 안 우측 상단 타이머 고정 */}
      <div className="tp-omr-topbar">
        <div className="tp-timer" aria-live="polite">
          {timeDisplay}
        </div>
      </div>

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
          title={allAnswered ? "제출합니다" : "모든 문항에 답하면 제출 버튼이 활성화됩니다"}
        >
          제출하기
        </button>
        {!allAnswered && (
          <p className="tp-submit-hint">모든 문항에 답하면 제출할 수 있습니다.</p>
        )}
      </div>
    </aside>
  );

  return (
    <KoreaBook
      variant="spread"
      left={LeftPage}
      right={
        <>
          {/* 로고 왼쪽에 버튼 */}
          <div className="kb-right-topbar">
            {onBackToStart && (
              <button className="tp-btn tp-home" onClick={onBackToStart}>
                처음으로
              </button>
            )}
            <img src="/Image/logo.png" alt="로고" className="kb-title-logo" />
          </div>
  
          {RightPage}
        </>
      }
    />
  );
};

export default TestPage;