import React, { useMemo, useEffect, useState } from "react";
import "./style/End.scss";

const EndPage = ({ questions, answers, onRestart, onGoToQuestion, onRetryWrong }) => {
  const fmt = (s) => String(s ?? "").trim().toLowerCase();

  const { correctCount, wrongIds, wrongIndices } = useMemo(() => {
    let c = 0;
    const wIds = [];
    const wIdx = [];
    questions.forEach((q, i) => {
      const a = answers[i];
      let ok = false;
      if (q.type === "mc") ok = a === q.answerIndex;
      else {
        const tgt = Array.isArray(q.answer) ? q.answer : [q.answer];
        ok = tgt.map(fmt).includes(fmt(a));
      }
      if (ok) c += 1;
      else { wIds.push(q.id); wIdx.push(i); }
    });
    return { correctCount: c, wrongIds: wIds, wrongIndices: wIdx };
  }, [questions, answers]);

  // 채점 규칙
  const perQuestion = 5;
  const rawScore = Math.min(correctCount * perQuestion, 100);
  const isPass = rawScore >= 60;

  // 2초 점수 카운트업
  const [displayScore, setDisplayScore] = useState(0);
  const [scoreDone, setScoreDone] = useState(false);
  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(rawScore * eased);
      setDisplayScore(val);
      if (t < 1) rafId = requestAnimationFrame(tick);
      else setScoreDone(true); // 끝났을 때 표시
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rawScore]);

  return (
    <section
   className={`end-card ${scoreDone ? "done" : "counting"}`}
   style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}>
      <header className="end-header">
        <div className="end-header__left">
          <h1 className="end-title">시험 결과</h1>
          <div className="end-score">
            점수: <span
   className={`end-score__value ${scoreDone ? "settled" : "animating"}`}
   aria-live="polite">
   {displayScore} </span> / 100
          </div>

          {/* 합격/불합격은 카운트 끝난 뒤에만 노출 */}
          {scoreDone && (
            <div className={`end-status ${isPass ? "pass" : "fail"}`}>
              {isPass ? "합격" : "불합격"}
            </div>
          )}
        </div>

        <div className="end-actions">
          <button className="btn" onClick={onRestart}>처음으로</button>
          {wrongIds.length > 0 && (
            <button className="btn btn--primary" onClick={() => onRetryWrong(wrongIndices)}>
              틀린 문제 다시 풀기
            </button>
          )}
        </div>
      </header>

      <section className="end-wrong">
        <h2 className="end-section-title">틀린 문제</h2>
        {wrongIds.length === 0 ? (
          <div className="end-empty">전부 정답입니다! 상품은 화비님께 달라고 하세요!</div>
        ) : (
          <div className="end-wrong__grid">
            {wrongIds.map((qid) => (
              <button
                key={qid}
                className="num-btn"
                onClick={() => onGoToQuestion(qid)}
                aria-label={`${qid}번 문제 보기`}
                title={`${qid}번 문제로 이동`}
              >
                {qid}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ▼▼ 새로 추가: 두루마리 + 페이드인 문구 ▼▼ */}
      <footer className={`end-scroll ${scoreDone ? "show" : ""} ${isPass ? "pass" : "fail"}`}>
        <div className="scroll-wrap">
          <p className="scroll-line" style={{ animationDelay: "0ms"  }}>왕관을 들어야 하는가?</p>
          <p className="scroll-line" style={{ animationDelay: "180ms" }}>아님 사약 들어야 하는가?</p>
        </div>
      </footer>
    </section>
  );
};

export default EndPage;