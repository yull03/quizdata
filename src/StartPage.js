import React, { useState } from "react";

const StartPage = ({ total, limitMinutes, onStart }) => {
  const [leaving, setLeaving] = useState(false);

  const handleClick = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      onStart();
      setLeaving(false);
    }, 650);
  };

  return (
    <section className="start">
      {/* 3D는 .book + .book__cover 두 개면 끝 */}
      <div
        className={`book ${leaving ? "book--leave" : ""}`}
        onClick={handleClick}
        role="button"
        aria-label="시험 시작"
      >
        <div className="book__cover">
          <div className="book__ribbon">도동서당</div>
          <h1 className="book__title">도깨비 정5품 과거시험</h1>
          <p className="book__subtitle">(가) 형</p>
          <p className="book__meta">
            총 {total}문제 · 제한시간 {limitMinutes}분
          </p>

          {/* 1) 기본: 텍스트 도장 */}
          <div className="book__seal">試</div>

          {/*
          2) 이미지 도장 쓰고 싶다면 위 div 지우고 아래 주석 해제:
          <div className="book__seal">
            <img className="book__sealImg" src="/seal.png" alt="" />
          </div>
          */}
        </div>
      </div>

      <p className="start__hint">책을 클릭하면 시험이 시작됩니다.</p>
      <p className="start__credit">© {new Date().getFullYear()} Made In 'Do Dong'</p>
    </section>
  );
};

export default StartPage;