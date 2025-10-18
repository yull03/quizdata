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
  revealSet = null,  // ← 추가
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

  // 이 문제를 공개할지 여부
  const showReveal = !!(revealSet && revealSet.has(qIndex));

  /* ========== 좌측: 문제/선지/페이지 네비 ========== */
  const LeftPage = (
    <section className="tp-sheet" aria-labelledby="tp-question-title">
      <header className="tp-header">
        <div className="tp-left" />
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
              const correct = showReveal && i === q.answerIndex; // ← 정답 하이라이트
              return (
                <li
                  key={i}
                  className={`tp-choice ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""}`}
                  onClick={() => onChoiceClick(i)}
                  role="option"
                  aria-selected={selected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onChoiceClick(i);
                  }}
                >
                  <span className="tp-choice-key">{i + 1}</span>
                  <span className="tp-choice-text"> {c}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <div className="tp-short-answer-note">
              답변은 우측 OMR 입력창에 작성 부탁하오. 안적으면 제출을 할 수 없소
            </div>

            {/* 주관식 정답 공개 */}
            {showReveal && (
              <div className="tp-answer-reveal" aria-live="polite">
                정답: {Array.isArray(q.answer) ? q.answer.join(" / ") : String(q.answer)}
              </div>
            )}
          </>
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
          <div className="kb-right-topbar">
            {onBackToStart && (
              <button className="tp-btn tp-home" onClick={onBackToStart}>
                처음으로
              </button>
            )}
            <img src={`${process.env.PUBLIC_URL}/Image/logo.png`} alt="logo" className="kb-title-logo" />
          </div>
          {RightPage}
        </>
      }
    />
  );
};

export default TestPage;