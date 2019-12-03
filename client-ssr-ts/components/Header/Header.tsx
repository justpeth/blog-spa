import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { PoetryType } from '../Layout';

import './Header.styl';

interface HeaderProps {
  poetry: PoetryType;
}

const Header: React.FunctionComponent<HeaderProps> = ({ poetry }) => {
  let [poetryAni, setPoetryAni] = useState(false);
  let [linkAni, setLinkAni] = useState(false);
  return (
    <div className="header">
      <div className="header-line" />
      <div className="header-inner">
        <div className="site-name">
          <a href="/">
            <div className="site-name-inner">
              <CSSTransition
                in
                timeout={300}
                classNames="fade"
                appear
                onEntered={() => setPoetryAni(true)}
              >
                <div className="site-name-text">H。</div>
              </CSSTransition>
            </div>
          </a>
        </div>
        <div className="poetry">
          <CSSTransition
            in={poetryAni}
            timeout={300}
            classNames="fade"
            unmountOnExit
            onEntered={() => setLinkAni(true)}
          >
            <div>
              <div>{poetry.content}</div>
              <div>{`——  ${poetry.author} 《${poetry.origin}》`}</div>
            </div>
          </CSSTransition>
        </div>
        <div className="nav-links-wrapper">
          <CSSTransition
            in={linkAni}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="nav-links">
              <a href="/archive" className="nav-link">
                <div className="iconfont icon-archive"/>
                <div>Archive</div>
              </a>
              <a href="/tags" className="nav-link">
                <div className="iconfont icon-tag"/>
                <div>Tags</div>
              </a>
              <div
                className="nav-link"
                onClick={e => {
                  // if (!searchStatus) {
                  //   setSearchStatus(true)
                  // }
                }}
              >
                <div className="iconfont icon-search"/>
                <div>Search</div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
};

export default Header;
