import React, { useEffect, useState } from "react";
import StartPage from "./StartPage";
import TestPage from "./TestPage";
import EndPage from "./EndPage";
import "./style/Main.scss";
import "./App.scss";

const LIMIT_SECONDS = 60 * 60; // 타이머
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
    { id: 1, type: "mc", question: "화비의 이메일로 알맞은 주소는 무엇인가?", choices: ["heche0525@gmail.com","hachi0525@gmail.com","hechi0525@gmail.com","hechie0525@gmail.com","hechee0525@gmail.comi"], answerIndex: 2 },
    { id: 2, type: "mc", question: "화비의 3D 대뷔 방송이 유튜브 '도화비' 채널에 업로드 된 날짜는 언제인가?", choices: ["2025.07.22","2025.07.25","2025.07.28","2025.07.29","2025.07.31"], answerIndex: 1 },
    { id: 3, type: "mc", question: "최근 10월14일 깜짝 노래방송에서 부르지 않은 곡은 무엇인가?", choices: ["오르트구름","Flos","인연","여우비","잇테"], answerIndex: 2 },
    { id: 4, type: "mc", question: "화비가 실크송 하던 날 보스 '황야날개' 클리어까지의 트라이 횟수는  멋번인가?", choices: ["14회", "19회" ,"21회","28회","31회"], answerIndex: 3 },
    { id: 5, type: "mc", question: "도화비 팬카페 재오픈 기념 월페이퍼 배포 날짜는 언제인가?", choices: ["10월8일","10월9일","10월10일","10월11일","10월12일"], answerIndex: 2 },
    { id: 6, type: "mc", question: "최근 화비는 아팠던 적이 있어 병원을 가서 진단을 받은적이 있다. 의사에게 진단 받은 병명은 무엇인가?", choices: ["고관절 충돌 증후군","고관절 유착 증후군","고관절 신경증","허리디스크","퇴행성 관절염"], answerIndex: 0 },
    { id: 7, type: "mc", question: "도화비의 생일이 언제인지 고르시오.", choices: ["5월 21일 ","5월 25일 ","5월27일 ","5월28일 ","5월 29일 "], answerIndex: 1 },
    { id: 8, type: "mc", question: "(나락 문제) 독도라고 정확히 표기 된 것을 고르시오. ", choices: ["ด็อกก์โด ","ด็อก-โด ","โตกโต ","ด็อกโด ","ด็อคโด "], answerIndex: 3 },
    { id: 9, type: "mc", question: "화비의 사랑스럽고 매우 귀여운 반려견의 이름은?", choices: ["햄이","솜이","설몽이 ","구름이","하몽이 "], answerIndex: 3 },
    { id:10, type: "mc", question: "화비는 편식을 한다 보기 중에 화비가 제일 싫어하는것을 고르시오.", choices: ["오이","콩나물","생마늘","굴(석화)","팥"], answerIndex: 4 },
    { id:11, type: "mc", question: "최근 화비는 대학 아야기를 하였다 2026년에 가려고 하는 학과는 어디인가?", choices: ["동물 보건학과 ","애견 미용과 ","동물 식품과학과 ","동물 사회학과 ","동물산업학과 "], answerIndex: 0 },
    { id:12, type: "mc", question: "10월 13일 화비는 게임 중 노래를 하나 재밌게 불렀다 불렀던 노래의 제목은?", choices: ["둥글게 둥글게","회전목마","쎄쎄쎄","창귀","달려있는 하니"], answerIndex: 1 },
    { id:13, type: "mc", question: "(상식 문제) 측우기를 기획, 추진을 한 인물은 누구인가??", choices: ["장영실 ","정약용 ","세종대왕 ","이천","도화비"], answerIndex: 2 },
    { id:14, type: "mc", question: "도화비의 소개로 적절한 것은?", choices: ["해태와 같이 여행하는 도깨비 ","봉인에서 풀려 난 조선시대 도깨비","집에서 쫏겨나 현대로 이사 온 도깨비","해태탈을 좋아하는 도깨비 ","족자봉을 통해 현대로 넘어온 도깨비 "], answerIndex: 3 },
    { id:15, type: "mc", question: "도화비의 트위터 가입일은??", choices: ["2023년 4월 ","2023년 5월 ","2023년 6월 ","2023년 7월 ","2023년 8월 "], answerIndex: 2 },
    { id:16, type: "mc", question: "화비의 현재 치지직 팔로워 수는?", choices: ["1.2만 ","1.3만 ","1.4만 ","1.5만 ","1.6만"], answerIndex: 2 },
    { id:17, type: "mc", question: "도깨비 빤스는 깨끗하다?", choices: ["아니어야만해 ","아닐껄? ","아니오 ","네 ","네니오"], answerIndex: 2 },
    { id:18, type: "mc", question: "화비는 취미로 '이것'을 배우고 있다 '이것'은 무엇인가?", choices: ["프로그래밍 ","보디빌더 ","꽹과리 ","장구 ","프로 레슬링"], answerIndex: 2 },
    { id:19, type: "mc", question: "화비의 포켓몬A-Z 뚜꾸리의 이름은?", choices: ["석쇠 불고기","크리스 P 베이컨 ","불족발 ","두루치기 ","제육"], answerIndex: 4 },
    { id:20, type: "mc", question: "화비는 매우 큰 꿈을 가지고 있다 그 꿈은 무엇인가?", choices: ["'아라하시 타비'님과의 합방 ","세후 문제없는 50억 입금 ","연애 ","인싸 만학도 ","빌게이츠의 삶 살기"], answerIndex: 0 },
    { id:21, type:"sa", question: "(상식 문제) 도깨비를 시각적으로 표현한 내용이 실록에 총 35건 이상 ‘oo’로 표현된 기사가 있고, 이 oo가 곧 도깨비-유사 존재로 해석된다고 분석하고 있습니다. oo 의 단어를 적으시오.", answer:["귀매"] },
    { id:22, type:"sa", question: "(이건 틀리면 안될텐데) '이토 히로부미'는 어떤 사람인가?.", answer:["정말 나쁜 사람이다","정말나쁜사람이다", "정말 나쁜사람 이다"] },
    { id:23, type:"sa", question: "화비가 좋아하는 LCK 팀 이름은?(대문자로 적어주세요.)", answer:["T1"] },
    { id:24, type:"sa", question: "최근에 구름이가 미용을 했다 구름이 미용날짜는 언제인가?(예시 : 00월 00일(띄어쓰기필수)", answer:["10월 21일"] },
    { id:25, type:"sa", question: "도화비 방송 내수용 밈으로 이 단어를 말하고 뒤에 '괄호()'로 이떠한 단어를 작성한다 이 '내수용 밈'은 어떤것인가?", answer:["언니","언니(덜렁)","언니(굵직)"] },
    { id:26, type:"sa", question:"화비의 다음 대뷔 기념방송 날짜를 적으시오.(띄어쓰기 필수)(예시: 0000년 0월 00일)", answer:["2028년 2월 29일"] },
    { id:27, type:"sa", question:"현재 팬카페 '도화비서당'의 회원수는 몇명인지 적으시오.", answer:["51명","51"]},
    { id:28, type:"sa", question:"(상식문제) 조선왕조에서 게장을 먹고 사망한 왕의 이름은?", answer:["경종"] },
    { id:29, type:"sa", question:"화비의 치지직 첫 생방송 날짜를 적으시오. (띄어쓰기 필수)(예시: 0000년 0월 00일)", answer:["2024년 2월 04일","2024년 2월 4일"] },
    { id:30, type:"sa", question:"애교 또 해주세요! 한번 더 시킬 줄은 몰랐죠? '점수를 받으려면 '네' 를 작성해 주시길 바랍니다. 이번에 또 걸리신거면 애교를 하고 싶으신거 같아서 특별히 안지워 봤어요. 감사합니다", answer:["네"] },
  ];

const Main = () => {
  const [phase, setPhase] = useState("start");
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
            limitMinutes={Math.floor(LIMIT_SECONDS / 80)}
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