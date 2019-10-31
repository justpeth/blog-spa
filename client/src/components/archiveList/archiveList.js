import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import './archiveList.scss';

const ArchiveList = ({ path, list, edit = false }) => {
  return (
    <div className="d-article-list">
      {
        list.map(item => (
          <div className="d-article-item" key={item.id}>
            <h3 className="d-article-item-title">
              <Link className="d-article-item-link" to={`${path}${item.id}`}>{item.title}</Link>
              <Link to="/" data-title="编辑" className="d-article-item-edit">
                <span className="iconfont icon-edit"></span>
              </Link>
            </h3>
            <div className="d-article-item-date">{moment(item.updatedAt - 0).format('YYYY-MM-DD')}</div>
          </div>
        ))
      }
    </div>
  )
};

export default ArchiveList;