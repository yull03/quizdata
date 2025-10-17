import React, { useState } from "react";

const StartPage = ({ total, limitMinutes, onStart }) => {
  const [leaving, setLeaving] = useState(false);
  const [name, setName] = useState("");
  const [greet, setGreet] = useState(false);

  const handleClick = (e) => {
    // 인풋 영역 클릭 무시
    if (e?.target && e.target.closest(".book__input-wrap")) return;
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      onStart();
      setLeaving(false);
    }, 650);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter" && name.trim() !== "") {
      setGreet(true);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const stopAll = (e) => e.stopPropagation();

  return (
    <section className="start">
      <div
        className={`book ${leaving ? "book--leave" : ""}`}
        onClick={handleClick}
        role="button"
        aria-label="시험 시작"
      >
        <div className="book__cover">
          <div className="book__ribbon">도동서당</div>

          <div className="book__content">
            <h1 className="book__title">
              <span>을사년</span><br />
              도깨비 능력평가<br />제 1회
            </h1>
            <p className="book__subtitle">[가] 형</p>

            <div className="book__input-wrap" onClick={stopAll}>
              <input
                type="text"
                className="book__input"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (greet) setGreet(false);
                }}
                onKeyDown={handleNameKeyDown}
                onClick={stopAll}
              />
              {greet && (
                <p className="book__greet">
                  <strong>{name}</strong>님, 반갑습니다!
                </p>
              )}
            </div>

            <p className="book__meta">
              총 {total}문제
              <span className="meta-divider">-</span>
              풀이시간 {limitMinutes}분
            </p>
          </div>

          <div className="book__seal">
            <img src="/Image/logo.png" alt="도장" className="book__seal-img" />
          </div>
        </div>
      </div>

      <p className="start__hint">
        책을 클릭하면 시험이 시작됩니다.
        <br />
        <span>© 제작자: 막걸리 (보름 뒤 청주)</span>
        <br />
      </p>
    </section>
  );
};

export default StartPage;