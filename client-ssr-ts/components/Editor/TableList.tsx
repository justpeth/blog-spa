// TableList
import React from "react";

interface Iprops {
  maxRow?: number;
  maxCol?: number;
  onSetTable?: (parmas: onSetTableParams) => void;
}

interface onSetTableParams {
  row: number;
  col: number;
}

interface Istate {
  maxRow: number;
  maxCol: number;
  list: Array<Array<number>>;
}

class TableList extends React.Component<Iprops, Istate> {
  config = {
    padding: 3,
    width: 20,
    height: 20
  };

  constructor(props: Iprops) {
    super(props);
    const { maxRow = 5, maxCol = 6 } = props;
    this.state = {
      maxRow: maxRow,
      maxCol: maxCol,
      list: this.formatTableModel(maxRow, maxCol)
    };
  }

  formatTableModel(maxRow = 0, maxCol = 0) {
    const result = new Array(maxRow).fill(1);
    return result.map(v => {
      return new Array(maxCol).fill(0);
    });
  }

  calcWrapStyle() {
    const { maxRow, maxCol } = this.state;
    const { width, height, padding } = this.config;
    const wrapWidth = (width + padding) * maxCol - padding;
    const wrapHeight = (height + padding) * maxRow - padding;
    return {
      width: `${wrapWidth}px`,
      height: `${wrapHeight}px`
    };
  }

  calcItemStyle(row = 0, col = 0) {
    const { width, height, padding } = this.config;
    const top = (height + padding) * row;
    const left = (width + padding) * col;
    return {
      top: `${top}px`,
      left: `${left}px`
    };
  }

  handleHover(i: number, j: number) {
    const { list } = this.state;
    const newList = list.map((v, row) => {
      return v.map((item: number, col: number) => {
        if (row <= i && col <= j) {
          item = 1;
        } else {
          item = 0;
        }
        return item;
      });
    });
    this.setState({
      list: newList
    });
  }

  handleSetTable(i: number, j: number) {
    const { onSetTable } = this.props;
    typeof onSetTable === "function" && onSetTable({ row: i, col: j });
  }

  render() {
    const { list } = this.state;
    return (
      <ul className="h-table-list" style={this.calcWrapStyle()}>
        {list.map((row, i) => {
          return row.map((col: number, j:number) => {
            return (
              <li
                className={`list-item ${col === 1 ? "active" : ""}`}
                key={`${i}-${j}`}
                style={this.calcItemStyle(i, j)}
                onMouseOver={this.handleHover.bind(this, i, j)}
                onClick={this.handleSetTable.bind(this, i, j)}
              ></li>
            );
          });
        })}
      </ul>
    );
  }
}
export default TableList;
