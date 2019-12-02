import React, { useState } from 'react';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import { PoetryType } from '../Layout/Layout';

import './Header.styl';

interface HeaderProps {
  poetry: PoetryType
}

const Header: React.FunctionComponent<HeaderProps> = ({ poetry }) => {
  let [poetryAni, setPoetryAni] = useState(false);

  return (
    <div className="header">
      <div className="header-line" />
      <div className="header-inner">
        <div className="site-name">
          <Link href="/">
            <div className="site-name-inner">
              <CSSTransition in={true} timeout={300} classNames="fade" appear onEntered={() => setPoetryAni(true)}>
                <div className="site-name-text">H。</div>
              </CSSTransition>
            </div>
          </Link>
        </div>
        <div className="poetry">
          <CSSTransition in={poetryAni} timeout={300} classNames="fade" unmountOnExit>
            <div>
              <div>{poetry.content}</div>
              <div>{`——  ${poetry.author} 《${poetry.origin}》`}</div>
            </div>
          </CSSTransition>
        </div>


        <div className="nav-links-wrapper">
          <CSSTransition
            in
            timeout={300}
            classNames="fade"
            unmountOnExit
          // onEntered={() => changeHeaderReady()}
          >
            <div className="nav-links">
              {/* <Link href="/archive">
                <div className="iconfont icon-archive"></div>
                <div>Archive</div>
              </Link>
              <Link href="/tags">
                <div className="iconfont icon-tag"></div>
                <div>Tags</div>
              </Link> */}
              <div
                className="nav-link"
                onClick={e => {
                  // if (!searchStatus) {
                  //   setSearchStatus(true);
                  // }
                }}
              >
                <div className="iconfont icon-search" />
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
