import React from 'react';

import './Footer.styl';

const Footer: React.FunctionComponent = () => (
  <div className="footer">
    <div className="footer-inner">
      <p className="copyright">Copyright© 2019 By justpeth</p>
      <p>
        <a
          className="footer-link"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51010802000779"
          rel="noopener noreferrer"
          target="_blank"
        >
          蜀公网安备51010802000779号
        </a>
        <a
          className="footer-link"
          href="http://www.beian.miit.gov.cn/"
          rel="noopener noreferrer"
          target="_blank"
        >
          蜀ICP备19027770号-1
        </a>
      </p>
    </div>
  </div>
)
export default Footer;