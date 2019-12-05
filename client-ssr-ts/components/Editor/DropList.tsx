import React from "react";

interface IProps {
  render: () => JSX.Element;
  onClose: () => void;
  show: boolean;
}

class DropList extends React.Component<IProps> {
  constructor(props:IProps) {
    super(props);
  }
  _handleClose(e: Event) {
    e.stopPropagation();
    const { onClose } = this.props;
    typeof onClose === "function" && onClose();
  }
  render() {
    return (
      <div
        className={`h-drop-wrap ${this.props.show ? "show" : "hidden"}`}
        onClick={this._handleClose.bind(this)}
      >
        {typeof this.props.render === "function" && this.props.render()}
      </div>
    );
  }
}
export default DropList;
