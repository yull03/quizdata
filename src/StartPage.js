import React, { useState } from "react";

/**
 * 표지 카드 위에 종이 여러 장이
 * 호버 시 오른쪽-아래 대각선으로 '촤라락' 펼쳐지는 효과.
 * 터치 기기에서는 탭 시 잠깐 펼쳐지도록 처리.
 */
const StartPage = ({ total, limitMinutes, onStart }) => {
  const [leaving, setLeaving] = useState(false);
  const [name, setName] = useState("");
  const [greet, setGreet] = useState(false);
  const [isHover, setIsHover] = useState(false); // 호버/터치 공용

  const handleClick = (e) => {
    if (e?.target && e.target.closest(".startcard__input-wrap")) return;
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
        className={`startcard ${leaving ? "is-leaving" : ""} ${isHover ? "is-hovered" : ""}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onTouchStart={() => {
          setIsHover(true);
          setTimeout(() => setIsHover(false), 450);
        }}
        role="button"
        aria-label="시험 시작"
      >
        {/* 뒤에 숨어있다 펼쳐질 종이들 */}
        <div className="sheet s1" aria-hidden="true" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}/>
        <div className="sheet s2" aria-hidden="true" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}/>
        <div className="sheet s3" aria-hidden="true" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}/>
        <div className="sheet s4" aria-hidden="true" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}/>
        <div className="sheet s5" aria-hidden="true" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}>
          <span>도</span>
          <span>화</span>
          <span>비</span>
          <span>메</span>
          <span>롱</span>
          <span className="face">😝</span>
        </div>

        {/* 메인 카드 면 */}
        <div className="startcard__inner" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Image/paper.jpg)` }}>
          <div className="startcard__ribbon">도동서당</div>

          <h1 className="startcard__title">
            <span>도화비</span>
            <br />
            <span className="text-main-sub">정보처리 기능사 필기</span>
            <br />
            제 1회
          </h1>
          <p className="startcard__subtitle">[가] 형</p>

          <div className="startcard__input-wrap" onClick={stopAll}>
            <input
              type="text"
              className="startcard__input"
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
              <p className="startcard__greet">
                <strong>{name}</strong>님, 반갑습니다!
              </p>
            )}
          </div>

          <p className="startcard__meta">
            총 {total}문제
            <span className="meta-divider">-</span>
            풀이시간 {limitMinutes}분
          </p>

          <div className="startcard__seal">
            <img src="/Image/logo.png" alt="도장" className="startcard__seal-img" />
          </div>
        </div>
      </div>

      <p className="start__hint">
        화면을 클릭하면 필기시험이 시작됩니다.
        <br />
        <span>© 제작자: 막걸리 (보름 뒤 청주)</span>
        <br />
      </p>
    </section>
  );
};

export default StartPage;