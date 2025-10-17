import React from "react";

const StartPage = ({ total, limitMinutes, onStart, S }) => {
  return (
    <section style={S.card}>
      <div style={{ marginBottom: 12 }}>
        총 {total}문제 (객관식 15, 주관식 5). 제한시간 {limitMinutes}분.
      </div>
      <button style={S.btnPrimary} onClick={onStart}>시험 시작</button>
    </section>
  );
};

export default StartPage;