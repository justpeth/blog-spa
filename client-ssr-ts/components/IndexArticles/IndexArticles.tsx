import React, {useEffect, useState} from "react";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import { CSSTransition } from "react-transition-group";
import { Empty } from "antd";

import "./IndexArticles.styl";
import { ARTICLES } from "../../apollo/queries";

const IndexArticles: React.FunctionComponent = () => {
  const [ani, setAni] = useState(false)
  const { data } = useQuery(ARTICLES);
  let articles: Array<any> = [];
  if (data.articles) {
    articles = data.articles;
  }
  useEffect(
    () => {
      setTimeout(() => {
        setAni(true)
      }, 900);
    },
    []
  );
  return (
    <CSSTransition
      timeout={400}
      classNames="article"
      in={ani}
      appear
      mountOnEnter
      unmountOnExit
    >
      <div className="front index-articles">
        {articles.length ? (
          <>
            {articles.map((article: any) => (
              <div key={article.id} className="index-article">
                <h3 className="index-article-title">
                  <Link href={`detail/${article.id}`}>
                    <span className="index-article-link">{article.title}</span>
                  </Link>
                </h3>
                <div className="index-article-meta">
                  <span className="iconfont icon-riqi"></span>
                  <time>{article.formatDate}</time>
                  {article.tags.length ? (
                    <span>
                      <span className="index-article-meta-line">&nbsp;|&nbsp;</span>
                      <span className="iconfont icon-biaoqian"></span>
                      {article.tags.map(tag => (
                        <span key={tag.id} className="index-article-tag">
                          {tag.name}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
                {article.summary && (
                  <div
                    className="index-article-summary"
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  ></div>
                )}
              </div>
            ))}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="你有看到我的日志么，我的日志不见了..."
          />
        )}
      </div>
    </CSSTransition>
  );
};

export default IndexArticles;
