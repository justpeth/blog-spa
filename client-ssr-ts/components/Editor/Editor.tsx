import React from "react";
import ReactDOM from "react-dom";
import { Icon } from "antd";
import clsx from "clsx";
import * as qiniu from 'qiniu-js'

import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

import Hicon from "../Hicon";
import * as tool from "../../utils/tool";
import Decorate from "../../utils/decorate";
import _config from "./editorConfig";
import DropList from "./DropList";
import TableList from "./TableList";
import InputFile from "./InputFile";
import "./Editor.styl";

interface HtmlRenderProps {
  html?: string;
  className?: string;
}

export class HtmlRender extends React.Component<HtmlRenderProps> {
  render() {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: this.props.html }}
        className={`custom-html-style ${this.props.className || ""}`}
      />
    );
  }
}

interface HtmlCodeProps {
  className?: string;
  html?: string;
}

class HtmlCode extends React.Component<HtmlCodeProps> {
  render() {
    return (
      <textarea
        className={`html-code ${this.props.className || ""}`}
        value={this.props.html}
        onChange={() => {}}
      ></textarea>
    );
  }
}

interface EditorProps {
  name?: string;
  value?: string;
  style?: React.CSSProperties;
  config?: {
    view?: {
      menu: boolean;
      md: boolean;
      html: boolean;
      fullScreen: boolean;
    };
    htmlClass?: string;
    markdownClass?: string;
    syncScrollMode?: Array<string>;
    imageUrl?: string;
    imageAccept?: string;
    linkUrl?: string;
    table?: {
      maxRow: number;
      maxCol: number;
    };
  };
  onChange?: (
    data: {
      text: string;
      html: string;
    },
    event: any
  ) => void;
  // onImageUpload?: (file: File, callback: (url: string) => void) => void;
  onBeforeClear?: () => boolean | Promise<boolean>;
}

const initialSelection = {
  isSelected: false,
  start: 0,
  end: 0,
  text: ""
};

class Editor extends React.Component<EditorProps, any> {
  config: any;
  handleChange: () => void;
  handleInputSelect: () => void;
  handleImageUpload: () => void;
  handleToggleFullScreen: () => void;
  handleInputScroll: () => void;
  handlePreviewScroll: () => void;
  willScrollEle: "md" | "html";
  hasContentChanged: boolean;
  inputFile: any;
  nodeMdPreviewWraper: any;
  nodeMdText: any;
  scale: number;
  nodeMdPreview: any;
  selection: {
    isSelected: boolean;
    start: number;
    end: number;
    text: string;
  };
  mdParser: any;
  static defaultProps = {
    onBeforeClear: function() {
      return new Promise(resolve => {
        if (window.confirm && typeof window.confirm === "function") {
          const result = window.confirm(this.config.clearTip);
          const toClear = result ? true : false;
          resolve(toClear);
        } else {
          resolve(true);
        }
      });
    }
  };
  constructor(props: any) {
    super(props);
    this.config = this.initConfig();

    this.state = {
      text: (this.formatString(this.props.value) || "").replace(/↵/g, "\n"),
      html: "",
      view: this.config.view,
      htmlType: "render", // 'render' 'source'
      dropButton: {
        header: false,
        table: false
      },
      fullScreen: false,
      table: this.config.table
    };
    this.selection = { ...initialSelection };
    this.handleChange = this._handleChange.bind(this);
    this.handleInputSelect = this._handleInputSelect.bind(this);
    this.handleImageUpload = this._handleImageUpload.bind(this);
    this.handleToggleFullScreen = this._handleToggleFullScreen.bind(this);

    this.handleInputScroll = tool.throttle((e: any) => {
      const { syncScrollMode = [] } = this.config;
      if (!syncScrollMode.includes("rightFollowLeft")) {
        return;
      }
      e.persist();
      if (this.willScrollEle === "md") {
        this.hasContentChanged && this._setScrollValue();
        if (this.nodeMdPreviewWraper && this.nodeMdText) {
          this.nodeMdPreviewWraper.scrollTop =
            this.nodeMdText.scrollTop / this.scale;
        }
      }
    }, 1000 / 60);
    this.handlePreviewScroll = tool.throttle((e: any) => {
      const { syncScrollMode = [] } = this.config;
      if (!syncScrollMode.includes("leftFollowRight")) {
        return;
      }
      e.persist();
      if (this.willScrollEle === "html") {
        this.hasContentChanged && this._setScrollValue();
        if (this.nodeMdText && this.nodeMdPreviewWraper)
          this.nodeMdText.scrollTop =
            this.nodeMdPreviewWraper.scrollTop * this.scale;
      }
    }, 1000 / 60);
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return ""; // use external default escaping
      }
    })
      .use(emoji)
      .use(subscript)
      .use(superscript)
      .use(footnote)
      .use(deflist)
      .use(abbreviation)
      .use(insert)
      .use(mark)
      // .use(tasklists, { enabled: this.taskLists });
  }

  initConfig() {
    return { ..._config, ...this.props.config };
  }
  formatString(value: string) {
    if (typeof this.props.value !== "string") {
      console &&
        console.error &&
        console.error('The type of "value" must be String!');
      return new String(value).toString();
    }
    return value;
  }
  _handleToggleFullScreen() {
    this.setState({
      fullScreen: !this.state.fullScreen
    });
  }
  _handleImageUpload() {
    this.inputFile && this.inputFile.click();
    // const { onImageUpload } = this.props;
    // if (typeof onImageUpload === "function") {
    //   this.inputFile && this.inputFile.click();
    // } else {
    //   this.handleDecorate("image");
    // }
  }
  _handleChange(e: any) {
    e.persist();
    const value = e.target.value;
    if (!this.hasContentChanged) {
      this.hasContentChanged = true;
    }
    this._setMdText(value, e);
  }
  _setScrollValue() {
    // 设置值，方便 scrollBy 操作
    const {
      nodeMdText = {},
      nodeMdPreview = {},
      nodeMdPreviewWraper = {}
    } = this;
    this.scale =
      (nodeMdText.scrollHeight - nodeMdText.offsetHeight + 35) /
      (nodeMdPreview.offsetHeight - nodeMdPreviewWraper.offsetHeight + 35);
    this.hasContentChanged = false;
  }
  _handleInputSelect(e: any) {
    e.persist();
    this.selection = Object.assign(
      {},
      this.selection,
      { isSelected: true },
      this._getSelectionInfo(e)
    );
  }
  _getSelectionInfo(e) {
    const source = e.srcElement || e.target;
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const text = (source.value || "").slice(start, end);
    const selection = { start, end, text };
    return selection;
  }
  _setMdText(value = "", e?: any) {
    const text = value.replace(/↵/g, "\n");
    this.setState({
      text: value
    });
    this.renderHTML(text).then(html => {
      this.setState({
        html
      });
      this.onEmit(
        {
          text,
          html
        },
        e
      );
    });
  }
  renderHTML(markdownText: string) {
    const res = this.mdParser.render(markdownText)
    if (typeof res === "string") {
      return Promise.resolve(res);
    } else if (typeof res === "function") {
      // @ts-ignore
      return Promise.resolve(res());
    } else if (typeof res === "object" && typeof res.then === "function") {
      return res;
    }
    return res;
  }
  onEmit(output: any, event: any) {
    const { onChange } = this.props;
    typeof onChange === "function" && onChange(output, event);
  }
  handleDecorate(type: string, option = {}) {
    const clearList = [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "unordered",
      "order",
      "quote",
      "hr",
      "inlinecode",
      "code",
      "table",
      "image",
      "link"
    ];
    if (clearList.indexOf(type) > -1) {
      if (!this.selection.isSelected) {
        return;
      }
      const content = this._getDecoratedText(type, option);
      this._setMdText(content);
      this._clearSelection();
    } else {
      const content = this._getDecoratedText(type, option);
      this._setMdText(content);
    }
  }
  handleScrollEle(node: "md" | "html") {
    this.willScrollEle = node;
  }
  _clearSelection() {
    this.selection = Object.assign({}, initialSelection);
  }
  _getDecoratedText(type: string, option: any) {
    const { text = "" } = this.state;
    const { selection } = this;
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(selection.end, text.length);
    const decorate = new Decorate(selection.text);
    let decoratedText = "";
    if (type === "image") {
      decoratedText = decorate.getDecoratedText(type, {
        target: option.target || "",
        imageUrl: option.imageUrl || this.config.imageUrl
      });
    } else if (type === "link") {
      decoratedText = decorate.getDecoratedText(type, {
        linkUrl: this.config.linkUrl
      });
    } else {
      decoratedText = decorate.getDecoratedText(type, option);
    }
    const result = beforeContent + `${decoratedText}` + afterContent;
    return result;
  }
  showDropList(type = "table", flag: boolean) {
    const { dropButton } = this.state;
    this.setState({
      dropButton: { ...dropButton, [type]: flag }
    });
  }
  onImageChanged(file: any) {
    console.log(file)
    // const { onImageUpload } = this.props;
    // onImageUpload(file, imageUrl => {
    //   this.handleDecorate("image", { target: file.name, imageUrl });
    // });
  }

  render() {
    let { dropButton, table, fullScreen } = this.state;
    let editorClsString = clsx("h-editor", { full: fullScreen });
    const renderContent = () => {
      const { html, text, view, htmlType } = this.state;
      const res = [];
      if (view.md) {
        res.push(
          <section className="h-editor-md" key="md">
            <textarea
              id="textarea"
              name={this.props.name || "textarea"}
              ref={node => (this.nodeMdText = node)}
              value={text}
              className={`input ${this.config.markdownClass || ""}`}
              wrap="hard"
              onChange={this.handleChange}
              onSelect={this.handleInputSelect}
              onScroll={this.handleInputScroll}
              onMouseOver={() => this.handleScrollEle("md")}
            />
          </section>
        );
      }
      if (view.html) {
        res.push(
          <section className="h-editor-html" key="html">
            {htmlType === "render" ? (
              <div
                className="html-wrap"
                ref={node => (this.nodeMdPreviewWraper = node)}
                onMouseOver={() => this.handleScrollEle("html")}
                onScroll={this.handlePreviewScroll}
              >
                <HtmlRender
                  html={html}
                  className={this.config.htmlClass}
                  ref={node =>
                    (this.nodeMdPreview = ReactDOM.findDOMNode(node))
                  }
                />
              </div>
            ) : (
              <div
                className={"html-code-wrap"}
                ref={node =>
                  (this.nodeMdPreviewWraper = ReactDOM.findDOMNode(node))
                }
                onScroll={this.handlePreviewScroll}
              >
                <HtmlCode
                  html={html}
                  className={this.config.htmlClass}
                  ref={node =>
                    (this.nodeMdPreview = ReactDOM.findDOMNode(node))
                  }
                />
              </div>
            )}
          </section>
        );
      }
      return res;
    };
    return (
      <div className={editorClsString}>
        {/* 编辑器菜单 */}
        <div className="h-editor-navigation">
          <div className="h-editor-navigation-nav">
            <div className="h-editor-button-wrap">
              <span
                className="h-editor-button"
                title="加粗"
                onClick={() => this.handleDecorate("bold")}
              >
                <Icon type="bold" />
              </span>
              <span
                className="h-editor-button"
                title="斜体"
                onClick={() => this.handleDecorate("italic")}
              >
                <Icon type="italic" />
              </span>
              <span
                className="h-editor-button"
                title="下划线"
                onClick={() => this.handleDecorate("underline")}
              >
                <Icon type="underline" />
              </span>
              <span
                className="h-editor-button"
                title="删除线"
                onClick={() => this.handleDecorate("strikethrough")}
              >
                <Icon type="strikethrough" />
              </span>
              <span
                className="h-editor-button"
                title="有序列表"
                onClick={() => this.handleDecorate("order")}
              >
                <Icon type="ordered-list" />
              </span>
              <span
                className="h-editor-button"
                title="无序列表"
                onClick={() => this.handleDecorate("unordered")}
              >
                <Icon type="unordered-list" />
              </span>
              <span
                className="h-editor-button"
                title="引用"
                onClick={() => this.handleDecorate("quote")}
              >
                <Hicon type="icon-quote-left" />
              </span>
              <span
                className="h-editor-button"
                title="分隔线"
                onClick={() => this.handleDecorate("hr")}
              >
                <Hicon type="icon-hr" />
              </span>
              <span
                className="h-editor-button"
                title="行内代码"
                onClick={() => this.handleDecorate("inlinecode")}
              >
                <Hicon type="icon-code-line" />
              </span>
              <span
                className="h-editor-button"
                title="代码块"
                onClick={() => this.handleDecorate("code")}
              >
                <Hicon type="icon-code" />
              </span>
              <span
                className="h-editor-button"
                title="表格"
                onMouseEnter={() => this.showDropList("table", true)}
                onMouseLeave={() => this.showDropList("table", false)}
              >
                <Icon type="table" />
                <DropList
                  show={dropButton.table}
                  onClose={() => {
                    this.showDropList("table", false);
                  }}
                  render={() => {
                    return (
                      <TableList
                        maxRow={table.maxRow}
                        maxCol={table.maxCol}
                        onSetTable={option => {
                          this.handleDecorate("table", option);
                        }}
                      />
                    );
                  }}
                />
              </span>
              <span
                className="h-editor-button"
                title="上传图片"
                onClick={this.handleImageUpload}
                style={{ position: "relative" }}
              >
                <Hicon type="icon-pic" />
                <InputFile
                  accept={this.config.imageAccept || ""}
                  ref={input => {
                    this.inputFile = input;
                  }}
                  onChange={e => {
                    e.persist();
                    const file = e.target.files[0];
                    this.onImageChanged(file);
                  }}
                />
              </span>
              {/* <Icon type="file-image" /> */}
              <span
                className="h-editor-button"
                title="链接"
                onClick={() => this.handleDecorate("link")}
              >
                <Icon type="link" />
              </span>
              <span
                className="h-editor-button"
                title={fullScreen ? "退出全屏" : "全屏"}
                onClick={this.handleToggleFullScreen}
              >
                {fullScreen ? (
                  <Hicon type="icon-suoxiao"></Hicon>
                ) : (
                  <Hicon type="icon-full" />
                )}
              </span>
            </div>
          </div>
        </div>
        {/* 编辑器展示区域 */}
        <div className="h-editor-container">{renderContent()}</div>
      </div>
    );
  }
}

export default Editor;
