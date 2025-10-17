import React, { useMemo } from "react";

const EndPage = ({ questions, answers, S, onRestart, onGoToQuestion, onRetryWrong }) => {
  const fmt = (s) => String(s ?? "").trim().toLowerCase();

  const { score, wrong, wrongIndices } = useMemo(() => {
    let s = 0;
    const w = [];
    const wIdx = [];
    questions.forEach((q, i) => {
      const a = answers[i];
      let ok = false;
      if (q.type === "mc") ok = a === q.answerIndex;
      else {
        const tgt = Array.isArray(q.answer) ? q.answer : [q.answer];
        ok = tgt.map(fmt).includes(fmt(a));
      }
      if (ok) s += 1;
      else { w.push(q.id); wIdx.push(i); }
    });
    return { score: s, wrong: w, wrongIndices: wIdx };
  }, [questions, answers]);

  return (
    <section style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>결과</div>
          <div style={{ fontSize: 18, marginBottom: 6 }}>
            점수: {score} / {questions.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn} onClick={onRestart}>처음으로</button>
          {wrong.length > 0 && (
            <button style={S.btn} onClick={() => onRetryWrong(wrongIndices)}>
              틀린 문제 다시 풀기
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>틀린 문제</div>
        {wrong.length === 0 ? (
          <div>전부 정답입니다.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {wrong.map((qid) => (
              <button
                key={qid}
                style={S.numberBtn(false, true)}
                onClick={() => onGoToQuestion(qid)}
                aria-label={`${qid}번 문제 보기`}
                title={`${qid}번 문제로 이동`}
              >
                {qid}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EndPage;