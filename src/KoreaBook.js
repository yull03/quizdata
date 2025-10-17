import React from "react";
import "./style/KoreaBook.scss";

/**
 * KoreaBook: 조선 책자 레이아웃 래퍼
 * - variant: "spread" | "cover"
 * - title, footer: 상단/하단 장식 텍스트(선택)
 * - left, right: spread일 때 좌우 페이지 콘텐츠
 * - children: cover처럼 단일 페이지일 때 사용
 */
const KoreaBook = ({ variant = "spread", title, footer, left, right, children }) => {
  if (variant === "cover") {
    return (
      <section className="kb kb--cover">
        <div className="kb__cloth" />
        <div className="kb__cover">
          <div className="kb__cover-inner">
            {title && <h1 className="kb__title">{title}</h1>}
            {children}
          </div>
        </div>
      </section>
    );
  }

  // spread: 본문 2쪽 펼침
  return (
    <section className="kb kb--spread">
      <div className="kb__hinge" aria-hidden />
      <div className="kb__spread">
        <article className="kb__page kb__page--left">
          {title && <div className="kb__heading">{title}</div>}
          <div className="kb__content">{left || children}</div>
          {footer && <div className="kb__footer">{footer}</div>}
        </article>

        <article className="kb__page kb__page--right">
          {title && <div className="kb__heading kb__heading--ghost" aria-hidden>{title}</div>}
          <div className="kb__content">{right}</div>
          {footer && <div className="kb__footer kb__footer--right">{footer}</div>}
        </article>
      </div>
    </section>
  );
};

export default KoreaBook;