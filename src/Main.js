import React, { useEffect, useState } from "react";
import StartPage from "./StartPage";
import TestPage from "./TestPage";
import EndPage from "./EndPage";

/* 설정 */
const LIMIT_SECONDS = 40 * 60; // 40분
const ABCDE = ["A", "B", "C", "D", "E"];
const timeTxt = (t) =>
  `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

/* 최소 스타일 */
const S = {
  page: { maxWidth: 1100, margin: "0 auto", padding: 20, fontFamily: "ui-sans-serif, system-ui" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  card: { border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff" },
  btn: { padding: "10px 16px", border: "1px solid #ddd", borderRadius: 10, background: "#fff", cursor: "pointer" },
  btnPrimary: { padding: "10px 16px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 10, cursor: "pointer" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  grid: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, alignItems: "start" },
  sticky: { position: "sticky", top: 16, alignSelf: "start", border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" },
  row: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", border: "1px solid #eee", borderRadius: 8, marginBottom: 6 },
  numberBar: { marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12 },
  numberBtn: (isCurrent, answered) => ({
    padding: "6px 10px",
    border: "1px solid",
    borderColor: isCurrent ? "#111" : "#ddd",
    background: isCurrent ? "#f7f7f7" : answered ? "#f0f0f0" : "#fff",
    borderRadius: 8,
    cursor: "pointer",
  }),
};

/* 샘플 문제 데이터 */
const QUESTIONS = [
  { id: 1, type: "mc", question: "HTTP 404는 무엇을 의미하는가?", choices: ["서버오류","권한없음","찾을 수 없음","리다이렉트","요청시간초과"], answerIndex: 2 },
  { id: 2, type: "mc", question: "원소기호 Fe는?", choices: ["구리","철","은","알루미늄","아연"], answerIndex: 1 },
  { id: 3, type: "mc", question: "대한민국의 수도는?", choices: ["부산","도쿄","서울","평양","타이베이"], answerIndex: 2 },
  { id: 4, type: "mc", question: "const 설명으로 맞는 것은?", choices: ["재할당 가능/재선언 가능","재할당 불가, 참조형 내부 변경 가능","항상 원시값","함수 스코프","모듈 전역"], answerIndex: 1 },
  { id: 5, type: "mc", question: "전송계층 프로토콜이 아닌 것은?", choices: ["TCP","UDP","TLS","SCTP","ICMP"], answerIndex: 4 },
  { id: 6, type: "mc", question: "문항6", choices: ["A","B","C","D","E"], answerIndex: 0 },
  { id: 7, type: "mc", question: "문항7", choices: ["A","B","C","D","E"], answerIndex: 1 },
  { id: 8, type: "mc", question: "문항8", choices: ["A","B","C","D","E"], answerIndex: 2 },
  { id: 9, type: "mc", question: "문항9", choices: ["A","B","C","D","E"], answerIndex: 3 },
  { id:10, type: "mc", question: "문항10", choices: ["A","B","C","D","E"], answerIndex: 4 },
  { id:11, type: "mc", question: "문항11", choices: ["A","B","C","D","E"], answerIndex: 0 },
  { id:12, type: "mc", question: "문항12", choices: ["A","B","C","D","E"], answerIndex: 1 },
  { id:13, type: "mc", question: "문항13", choices: ["A","B","C","D","E"], answerIndex: 2 },
  { id:14, type: "mc", question: "문항14", choices: ["A","B","C","D","E"], answerIndex: 3 },
  { id:15, type: "mc", question: "문항15", choices: ["A","B","C","D","E"], answerIndex: 4 },
  { id:16, type:"sa", question:"지구의 자연위성 이름은?", answer:["달","moon","Moon"] },
  { id:17, type:"sa", question:"JS 배열 길이 프로퍼티는?", answer:["length"] },
  { id:18, type:"sa", question:"대한민국 ISO-3166 알파-2 코드는?", answer:["KR","kr"] },
  { id:19, type:"sa", question:"React에서 상태 업데이트 함수 이름 예시?", answer:["setState","setCount","setValue"] },
  { id:20, type:"sa", question:"DNS가 해석하는 것은 무엇인가? (한 단어)", answer:["도메인","domain","Domain"] },
];

const Main = () => {
  const [phase, setPhase] = useState("start"); // start | exam | end
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(LIMIT_SECONDS);
  const [answers, setAnswers] = useState(() =>
    QUESTIONS.map((q) => (q.type === "mc" ? null : ""))
  );

  // 오답 재풀이 목록
  const [visibleIndices, setVisibleIndices] = useState(null); // null이면 전체

  // 타이머
  useEffect(() => {
    if (phase !== "exam") return;
    if (seconds <= 0) {
      setPhase("end");
      return;
    }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, seconds]);

  // 액션
  const startExam = () => {
    setAnswers(QUESTIONS.map((q) => (q.type === "mc" ? null : "")));
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setVisibleIndices(null); 
    setPhase("exam");
  };

  const submitExam = () => setPhase("end");

  const restartToStart = () => {
    setAnswers(QUESTIONS.map((q) => (q.type === "mc" ? null : "")));
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setVisibleIndices(null);
    setPhase("start");
  };

  const setAnswerAt = (index, val) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });

  // 틀린 문제만 다시 풀기
  const retryWrong = (wrongIdxList) => {
    if (!wrongIdxList || wrongIdxList.length === 0) return;
    // 틀린 문제들 답안 초기화
    setAnswers((prev) => {
      const next = [...prev];
      wrongIdxList.forEach((i) => {
        next[i] = QUESTIONS[i].type === "mc" ? null : "";
      });
      return next;
    });
    setVisibleIndices(wrongIdxList);
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setPhase("exam");
  };

  // 결과 페이지에서 특정 문제로 점프
  const goToQuestionFromEnd = (qid) => {
    const idx = QUESTIONS.findIndex((q) => q.id === qid);
    if (idx >= 0) {
      setVisibleIndices(null); // 전체로 복귀
      setCurrent(idx);
      setPhase("exam");
    }
  };

  return (
    <div style={S.page}>
<header style={S.header}>
  {/* 제목에 클릭 이벤트 추가 */}
  <h1
    style={{
      fontSize: 22,
      fontWeight: 800,
      margin: 0,
      cursor: "pointer",
      userSelect: "none",
    }}
    onClick={() => {
      // 시험 중이든 결과 중이든 무조건 처음 화면으로
      setAnswers(QUESTIONS.map((q) => (q.type === "mc" ? null : "")));
      setCurrent(0);
      setSeconds(LIMIT_SECONDS);
      setVisibleIndices(null);
      setPhase("start");
    }}
  >
    상식 모의고사
  </h1>

  {phase === "exam" && (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 12, color: "#666" }}>남은 시간</div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 18,
          fontWeight: 700,
          color: seconds <= 30 ? "#d11" : "#000",
        }}
      >
        {timeTxt(seconds)}
      </div>
    </div>
  )}
</header>

      {phase === "start" && (
        <StartPage
          total={QUESTIONS.length}
          limitMinutes={Math.floor(LIMIT_SECONDS / 60)}
          onStart={startExam}
          S={S}
        />
      )}

      {phase === "exam" && (
        <TestPage
          questions={QUESTIONS}
          current={current}
          setCurrent={setCurrent}
          seconds={seconds}
          onSubmit={submitExam}
          answers={answers}
          setAnswerAt={setAnswerAt}
          S={S}
          timeTxt={timeTxt}
          ABCDE={ABCDE}
          visibleIndices={visibleIndices} // 오답만 재풀이 시 목록 전달
          onBackToStart={restartToStart} // 풀이 도중에도 시작으로 복귀
        />
      )}

      {phase === "end" && (
        <EndPage
          questions={QUESTIONS}
          answers={answers}
          S={S}
          onRestart={restartToStart}
          onGoToQuestion={goToQuestionFromEnd}
          onRetryWrong={retryWrong} // 오답만 다시 풀기
        />
      )}

      <footer style={{ marginTop: 18, fontSize: 12, color: "#888", textAlign: "center" }}>
        © {new Date().getFullYear()} Mock Exam Template
      </footer>
    </div>
  );
};

export default Main;