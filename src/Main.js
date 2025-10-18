import React, { useEffect, useState } from "react";
import StartPage from "./StartPage";
import TestPage from "./TestPage";
import EndPage from "./EndPage";
import "./style/Main.scss";
import "./App.scss";

const LIMIT_SECONDS = 40 * 60; // 타이머
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

/* 문제 데이터 */
const QUESTIONS = [
    { id: 1, type: "mc", question: "화비의 X(구 트위터) 아이디는?", choices: ["1) DO77HBi_DoHwaBi","2) Do7HBi_DoHwaBi","3) Do77HBi_DoHwaBi","4) Do77HBe_DoHwaBe","5) Do77HBe_DoHwaBi"], answerIndex: 2 },
    { id: 2, type: "mc", question: "화비의 3D 대뷔 방송이 유튜브 '도화비' 채널에 업로드 된 날짜는 언제인가?", choices: ["1) 2025.07.22","2) 2025.07.25","3) 2025.07.28","4) 2025.07.29","5) 2025.07.31"], answerIndex: 1 },
    { id: 3, type: "mc", question: "최근 10월14일 깜짝 노래방송에서 부르지 않은 곡은 무엇인가?", choices: ["1) 오르트구름","2) Flos","3) 염라","4) 여우비","5) 잇테"], answerIndex: 2 },
    { id: 4, type: "mc", question: "화비가 실크송 하던 어느 날 황야날개(회색황야 지역 보스) 클리어까지의 트라이 횟수는  멋번인가?", choices: ["1) 14회", "2) 19회" ,"3) 21회","4) 28회","5) 31회"], answerIndex: 3 },
    { id: 5, type: "mc", question: "도화비 팬카페 재오픈 기념 월페이퍼 배포 날짜는 언제인가?", choices: ["1) 10월8일","2) 10월9","3) 10월10일","4) 10월11일","5) 10월12일"], answerIndex: 2 },
    { id: 6, type: "mc", question: "최근 화비는 아팠던 적이 있어 병원을 가서 진단을 받은적이 있다. 의사에게 진단 받은 병명은 무엇인가?", choices: ["1) 고관절 충돌 증후군","2)고관절 유착 증후군","3)고관절 신경증","4) 허리디스크","5) 말초신경병증"], answerIndex: 0 },
    { id: 7, type: "mc", question: "도화비의 생일이 언제인지 고르시오.", choices: ["1) 5월 21일 ","2) 5월 25일 ","3) 5월27일 ","4) 5월28일 ","5) 5월 29일 "], answerIndex: 1 },
    { id: 8, type: "mc", question: "화비는 10월 15일 합방을 하면서 미소녀에게 상습 무례를 범할 때 했던 말이 아닌것은? ", choices: ["1) 내성발톱 있으세요? ","2) 하코챤님 목줄, 욕 취향 이신가보네요. ","3) 앞으로 언니라고 불러요. 서열정리 끝났네요. ","4) 이 새끼가 ","5) 때릴거면은 엉덩이 때려주세요 "], answerIndex: 0 },
    { id: 9, type: "mc", question: "화비의 사랑스럽고 매우 귀여운 반려견의 이름은?", choices: ["1) 햄이","2) 솜이","3) 설몽이 ","4) 구름이","5) 하몽이 "], answerIndex: 3 },
    { id:10, type: "mc", question: "화비는 편식을 한다 보기 중에 화비가 제일 싫어하는것을 고르시오.", choices: ["1) 오이","2) 콩나물","3) 막창","4) 굴(석화)","5) 팥"], answerIndex: 4 },
    { id:11, type: "mc", question: "최근 화비는 대학 아야기를 하였다 2026년에 가려고 하는 학과는 어디인가?", choices: ["1) (반려)동물 보건학과 ","2) 애견 미용과 ","3) (반려)동물 식품과학과 ","4) (반려)동물 사회학과 ","5)(반려)동물산업학과 "], answerIndex: 0 },
    { id:12, type: "mc", question: "10월 13일 화비는 게임 중 노래를 하나 재밌게 불렀다 불렀던 노래의 제목은?", choices: ["1)  둥글게 둥글게","2) 회전목마","3) 까만 리무진","4) 창귀","5) 달려라 하니"], answerIndex: 1 },
    { id:13, type: "mc", question: "현재 화비의 방송 시간은 대부분 오후 2시 이다 오후 2시는 조선시대 때 몇시라고 하였는가?", choices: ["1) 이시 ","2) 술시 ","3) 미시 ","4) 축시","5) 해시"], answerIndex: 2 },
    { id:14, type: "mc", question: "도화비의 소개로 적절한 것은?", choices: ["1) 해태와 같이 여행하는 도깨비 ","2) 봉인에서 풀려 난 조선시대 도깨비","3) 집에서 쫏겨나 현대로 이사 온 도깨비","4) 해태탈을 좋아하는 도깨비 ","5) 족자봉을 통해 현대로 넘어온 도깨비 "], answerIndex: 3 },
    { id:15, type: "mc", question: "화비는 4월 달 가족과 일본 여행을 갔다고 한다 일본여행에서 화비가 가지 않은 곳은?", choices: ["1)오사카 ","2) 나라 ","3) 고베 ","4) 교토 ","5) 아라시야마"], answerIndex: 4 },
    { id:16, type:"sa", question:"화비의 다음 주년방송 날짜를 적으시오.(띄어쓰기 필수)(예시: 0000년 0월 00일)", answer:["2028년 2월 29일"] },
    { id:17, type:"sa", question:"현재 팬카페 '도화비서당'의 회원수는 몇명인지 적으시오.", answer:["49명","49"]},
    { id:18, type:"sa", question:"10월11일 화비가 '아무말이나 하시게'에 올렸던 개시글의 제목은?", answer:["사주도 인정한 입닫으면 분내나는 스트리머"] },
    { id:19, type:"sa", question:"화비의 치지직 첫 생방송 날짜를 적으시오. (띄어쓰기 필수)(예시: 0000년 0월 00일)", answer:["2024년 2월 04일","2024년 2월 4일"] },
    { id:20, type:"sa", question:"애교 해주세요! '점수를 받으려면 '네' 를 작성해 주시길 바랍니다. 애교를 못하시겠다면... 뭐... 점수도 못 얻고... 도동이는 슬퍼지고...", answer:["네"] },
  ];

const Main = () => {
  const [phase, setPhase] = useState("start"); // start | exam | end
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(LIMIT_SECONDS);
  const [answers, setAnswers] = useState(() =>
    QUESTIONS.map((q) => (q.type === "mc" ? null : ""))
  );

  // 공개용: 오답 재풀이 시 정답을 보여줄 문제 인덱스 집합(Set<number>)
  const [revealSet, setRevealSet] = useState(null); // 기본 null

  // 오답 재풀이 목록
  const [visibleIndices, setVisibleIndices] = useState(null); // null이면 전체

  // 타이머
  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setPhase("end");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // 액션
  const startExam = () => {
    setAnswers(QUESTIONS.map((q) => (q.type === "mc" ? null : "")));
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setVisibleIndices(null);
    setRevealSet(null);               // 일반 모드: 정답 공개 안 함
    setPhase("exam");
  };

  const submitExam = () => setPhase("end");

  const restartToStart = () => {
    setAnswers(QUESTIONS.map((q) => (q.type === "mc" ? null : "")));
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setVisibleIndices(null);
    setRevealSet(null);               // 초기화
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
    setAnswers((prev) => {
      const next = [...prev];
      wrongIdxList.forEach((i) => {
        next[i] = QUESTIONS[i].type === "mc" ? null : "";
      });
      return next;
    });
    setVisibleIndices(wrongIdxList);
    setRevealSet(new Set(wrongIdxList));  // ← 여기! 이 목록은 정답 공개
    setCurrent(0);
    setSeconds(LIMIT_SECONDS);
    setPhase("exam");
  };

  // 결과 페이지에서 특정 문제로 점프(이건 정답 공개 없이)
  const goToQuestionFromEnd = (qid) => {
    const idx = QUESTIONS.findIndex((q) => q.id === qid);
    if (idx >= 0) {
      setVisibleIndices(null);
      setRevealSet(null);            // ← 공개 해제
      setCurrent(idx);
      setPhase("exam");
    }
  };

  return (
    <div style={S.page}>
      <header style={S.header}>
        <h1
          style={{ fontSize: 22, fontWeight: 800, margin: 0, cursor: "pointer", userSelect: "none" }}
          onClick={restartToStart}
        />
        <div />
      </header>

      {phase === "start" && (
        <>
          <StartPage
            total={QUESTIONS.length}
            limitMinutes={Math.floor(LIMIT_SECONDS / 60)}
            onStart={startExam}
            S={S}
          />
          <aside className="start-vertical-quotes" aria-hidden="true">
            <span>책을 펼치면 이미 늦었다</span>
            <span>모든 답은 도화비가 알고 있다</span>
            <span>정답은 마음속에 있다 근데 틀릴 거다</span>
          </aside>
        </>
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
          visibleIndices={visibleIndices}
          onBackToStart={restartToStart}
          revealSet={revealSet}      // ← 전달!
        />
      )}

      {phase === "end" && (
        <EndPage
          questions={QUESTIONS}
          answers={answers}
          S={S}
          onRestart={restartToStart}
          onGoToQuestion={goToQuestionFromEnd}
          onRetryWrong={retryWrong}
        />
      )}
    </div>
  );
};

export default Main;