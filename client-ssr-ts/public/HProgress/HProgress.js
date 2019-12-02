(function (root, factory) {
  root.HProgress = factory();
})(this, function () {

  var Settings = {
    minimum: 0.08,
    easing: "linear",
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: "body",
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div><div>'
  };

  /**
   * 队列
   */
  var queue = (function () {
    var pending = [];
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }
    return function (fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * 获取值 如果n在min和max之间 返回n 比min小返回min 比max大返回max
   * @param {number} n 
   * @param {number} min 
   * @param {number} max 
   */
  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * 将 (`0..1`) 之间的数字 转换成 translateX的用的百分数的数值
   * @param {number} n 
   * @returns -100%..0%的数字
   */
  function toBarPerc(n) {
    return (-1 + n) * 100;
  }

  /**
   * 
   * @param {number} n translatex的百分比数值
   * @param {number} speed transform动画持续时间 
   * @param {string} ease transfrom动画的变化曲线
   */
  function barPositionCSS(n, speed, ease) {
    return {
      transform: "translate3d(" + toBarPerc(n) + "%,0,0)",
      transition: "all " + speed + "ms " + ease
    }
  }

  /**
   * 给元素赋值css属性
   * @param {HTMLElement} element
   * @param {cssProps} css对象
   */
  var css = (function () {
    var cssProps = {};

    /**
     * 将string转化成驼峰命名的方式
     * @param {string} string 
     */
    function camelCase(string) {
      return string
        .replace(/-([\da-z])/gi, function (match, letter) {
          return letter.toUpperCase();
        });
    }
    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = name);
    }
    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} prop css名字
     * @param {string} value css值
     */
    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function (element, properties) {
      var args = arguments,
        prop,
        value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop))
            applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    };
  })();

  /**
   * 删除标签
   * @param {HTMLElement} element 
   */
  function removeElement(element) {
    element &&
      element.parentNode &&
      element.parentNode.removeChild(element);
  }

  var HProgress = {
    version: '1.0.0',
    // 状态
    status: null,
    // 设置进度条的值 n为0.0到1.0的值
    set: function (n) {
      // 判断是否开始
      var started = (typeof this.status === "number");
      n = clamp(n, Settings.minimum, 1);
      this.status = n === 1 ? null : n;
      var progress = this.render(!started);
      var bar = progress.querySelector(Settings.barSelector);
      var speed = Settings.speed;
      var ease = Settings.easing;
      progress.offsetWidth; // 重绘
      var self = this;
      queue(function (next) {
        css(bar, barPositionCSS(n, speed, ease));
        if (n === 1) {
          css(progress, {
            transition: "none",
            opacity: 1
          });
          progress.offsetWidth; // 重绘
          setTimeout(function () {
            css(progress, {
              transition: "all " + speed + "ms linear",
              opacity: 0
            });
            setTimeout(function () {
              self.remove();
              next();
            }, speed);
          }, speed);
        } else {
          setTimeout(next, speed);
        }
      });
      return this;
    },
    // 进度条开始
    start: function () {
      if (!this.status) {
        this.set(0)
      };
      var self = this;
      var work = function () {
        setTimeout(function () {
          if (!self.status) return;
          self.trickle();
          work();
        }, Settings.trickleSpeed);
      };
      if (Settings.trickle) work();
      return this;
    },
    // 进度条完成
    done: function (force) {
      if (!force && !this.status) return this;
      return this.inc(0.3 + 0.5 * Math.random()).set(1);
    },
    // 随机增加进度
    inc: function (amount) {
      var n = this.status;

      if (!n) {
        return this.start();
      } else if (n > 1) {
        return;
      } else {
        if (typeof amount !== "number") {
          if (n >= 0 && n < 0.2) {
            amount = 0.1;
          } else if (n >= 0.2 && n < 0.5) {
            amount = 0.04;
          } else if (n >= 0.5 && n < 0.8) {
            amount = 0.02;
          } else if (n >= 0.8 && n < 0.99) {
            amount = 0.005;
          } else {
            amount = 0;
          }
        }

        n = clamp(n + amount, 0, 0.994);
        return this.set(n);
      }
    },
    trickle: function () {
      return this.inc();
    },
    // 渲染进度条
    render: function (fromStart) {
      if (!!document.getElementById("hprogress"))
        return document.getElementById("hprogress");

      document.documentElement.classList.add('hprogress-busy')

      var progress = document.createElement("div");
      progress.id = "hprogress";
      progress.innerHTML = Settings.template;

      var bar = progress.querySelector(Settings.barSelector),
        perc = fromStart ? "-100" : toBarPerc(HProgress.status || 0),
        parent = document.querySelector(Settings.parent),
        spinner;

      css(bar, {
        transition: "all 0 linear",
        transform: "translate3d(" + perc + "%,0,0)"
      });

      if (!Settings.showSpinner) {
        spinner = progress.querySelector(Settings.spinnerSelector);
        spinner && removeElement(spinner);
      }

      if (parent != document.body) {
        document.documentElement.classList.add('progress-custom-parent')
      }

      parent.appendChild(progress);
      return progress;
    },
    // 移除
    remove: function () {
      document.documentElement.classList.remove('progress-busy');
      document.querySelector(Settings.parent).classList.remove('progress-custom-parent');
      var progress = document.getElementById("progress");
      progress && removeElement(progress);
    }
  };
  return HProgress;
});