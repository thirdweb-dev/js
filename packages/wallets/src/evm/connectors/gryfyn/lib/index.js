const Lib = (() => {
  var e = {
      145: (e, t) => {
        "use strict";
        (t.__esModule = !0), (t.detectIncognito = void 0);
        t.detectIncognito = function () {
          return new Promise(function (e, t) {
            var n,
              r,
              s = "Unknown";
            function i(t) {
              e({ isPrivate: t, browserName: s });
            }
            function o(e) {
              return e === eval.toString().length;
            }
            function a() {
              void 0 !== navigator.maxTouchPoints
                ? (function () {
                    var e = String(Math.random());
                    try {
                      window.indexedDB.open(e, 1).onupgradeneeded = function (
                        t,
                      ) {
                        var n,
                          r,
                          s =
                            null === (n = t.target) || void 0 === n
                              ? void 0
                              : n.result;
                        try {
                          s
                            .createObjectStore("test", { autoIncrement: !0 })
                            .put(new Blob()),
                            i(!1);
                        } catch (e) {
                          var o = e;
                          return (
                            e instanceof Error &&
                              (o =
                                null !== (r = e.message) && void 0 !== r
                                  ? r
                                  : e),
                            i(
                              "string" == typeof o &&
                                /BlobURLs are not yet supported/.test(o),
                            )
                          );
                        } finally {
                          s.close(), window.indexedDB.deleteDatabase(e);
                        }
                      };
                    } catch (e) {
                      return i(!1);
                    }
                  })()
                : (function () {
                    var e = window.openDatabase,
                      t = window.localStorage;
                    try {
                      e(null, null, null, null);
                    } catch (e) {
                      return i(!0);
                    }
                    try {
                      t.setItem("test", "1"), t.removeItem("test");
                    } catch (e) {
                      return i(!0);
                    }
                    i(!1);
                  })();
            }
            function c() {
              navigator.webkitTemporaryStorage.queryUsageAndQuota(
                function (e, t) {
                  var n;
                  i(
                    Math.round(t / 1048576) <
                      2 *
                        Math.round(
                          (void 0 !== (n = window).performance &&
                          void 0 !== n.performance.memory &&
                          void 0 !== n.performance.memory.jsHeapSizeLimit
                            ? performance.memory.jsHeapSizeLimit
                            : 1073741824) / 1048576,
                        ),
                  );
                },
                function (e) {
                  t(
                    new Error(
                      "detectIncognito somehow failed to query storage quota: " +
                        e.message,
                    ),
                  );
                },
              );
            }
            function u() {
              void 0 !== self.Promise && void 0 !== self.Promise.allSettled
                ? c()
                : (0, window.webkitRequestFileSystem)(
                    0,
                    1,
                    function () {
                      i(!1);
                    },
                    function () {
                      i(!0);
                    },
                  );
            }
            void 0 !== (r = navigator.vendor) &&
            0 === r.indexOf("Apple") &&
            o(37)
              ? ((s = "Safari"), a())
              : (function () {
                  var e = navigator.vendor;
                  return void 0 !== e && 0 === e.indexOf("Google") && o(33);
                })()
              ? ((n = navigator.userAgent),
                (s = n.match(/Chrome/)
                  ? void 0 !== navigator.brave
                    ? "Brave"
                    : n.match(/Edg/)
                    ? "Edge"
                    : n.match(/OPR/)
                    ? "Opera"
                    : "Chrome"
                  : "Chromium"),
                u())
              : void 0 !== document.documentElement &&
                void 0 !== document.documentElement.style.MozAppearance &&
                o(37)
              ? ((s = "Firefox"), i(void 0 === navigator.serviceWorker))
              : void 0 !== navigator.msSaveBlob && o(39)
              ? ((s = "Internet Explorer"), i(void 0 === window.indexedDB))
              : t(new Error("detectIncognito cannot determine the browser"));
          });
        };
      },
      187: (e) => {
        "use strict";
        var t,
          n = "object" == typeof Reflect ? Reflect : null,
          r =
            n && "function" == typeof n.apply
              ? n.apply
              : function (e, t, n) {
                  return Function.prototype.apply.call(e, t, n);
                };
        t =
          n && "function" == typeof n.ownKeys
            ? n.ownKeys
            : Object.getOwnPropertySymbols
            ? function (e) {
                return Object.getOwnPropertyNames(e).concat(
                  Object.getOwnPropertySymbols(e),
                );
              }
            : function (e) {
                return Object.getOwnPropertyNames(e);
              };
        var s =
          Number.isNaN ||
          function (e) {
            return e != e;
          };
        function i() {
          i.init.call(this);
        }
        (e.exports = i),
          (e.exports.once = function (e, t) {
            return new Promise(function (n, r) {
              function s(n) {
                e.removeListener(t, i), r(n);
              }
              function i() {
                "function" == typeof e.removeListener &&
                  e.removeListener("error", s),
                  n([].slice.call(arguments));
              }
              y(e, t, i, { once: !0 }),
                "error" !== t &&
                  (function (e, t, n) {
                    "function" == typeof e.on && y(e, "error", t, n);
                  })(e, s, { once: !0 });
            });
          }),
          (i.EventEmitter = i),
          (i.prototype._events = void 0),
          (i.prototype._eventsCount = 0),
          (i.prototype._maxListeners = void 0);
        var o = 10;
        function a(e) {
          if ("function" != typeof e)
            throw new TypeError(
              'The "listener" argument must be of type Function. Received type ' +
                typeof e,
            );
        }
        function c(e) {
          return void 0 === e._maxListeners
            ? i.defaultMaxListeners
            : e._maxListeners;
        }
        function u(e, t, n, r) {
          var s, i, o, u;
          if (
            (a(n),
            void 0 === (i = e._events)
              ? ((i = e._events = Object.create(null)), (e._eventsCount = 0))
              : (void 0 !== i.newListener &&
                  (e.emit("newListener", t, n.listener ? n.listener : n),
                  (i = e._events)),
                (o = i[t])),
            void 0 === o)
          )
            (o = i[t] = n), ++e._eventsCount;
          else if (
            ("function" == typeof o
              ? (o = i[t] = r ? [n, o] : [o, n])
              : r
              ? o.unshift(n)
              : o.push(n),
            (s = c(e)) > 0 && o.length > s && !o.warned)
          ) {
            o.warned = !0;
            var l = new Error(
              "Possible EventEmitter memory leak detected. " +
                o.length +
                " " +
                String(t) +
                " listeners added. Use emitter.setMaxListeners() to increase limit",
            );
            (l.name = "MaxListenersExceededWarning"),
              (l.emitter = e),
              (l.type = t),
              (l.count = o.length),
              (u = l),
              console && console.warn && console.warn(u);
          }
          return e;
        }
        function l() {
          if (!this.fired)
            return (
              this.target.removeListener(this.type, this.wrapFn),
              (this.fired = !0),
              0 === arguments.length
                ? this.listener.call(this.target)
                : this.listener.apply(this.target, arguments)
            );
        }
        function h(e, t, n) {
          var r = {
              fired: !1,
              wrapFn: void 0,
              target: e,
              type: t,
              listener: n,
            },
            s = l.bind(r);
          return (s.listener = n), (r.wrapFn = s), s;
        }
        function d(e, t, n) {
          var r = e._events;
          if (void 0 === r) return [];
          var s = r[t];
          return void 0 === s
            ? []
            : "function" == typeof s
            ? n
              ? [s.listener || s]
              : [s]
            : n
            ? (function (e) {
                for (var t = new Array(e.length), n = 0; n < t.length; ++n)
                  t[n] = e[n].listener || e[n];
                return t;
              })(s)
            : p(s, s.length);
        }
        function f(e) {
          var t = this._events;
          if (void 0 !== t) {
            var n = t[e];
            if ("function" == typeof n) return 1;
            if (void 0 !== n) return n.length;
          }
          return 0;
        }
        function p(e, t) {
          for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
          return n;
        }
        function y(e, t, n, r) {
          if ("function" == typeof e.on) r.once ? e.once(t, n) : e.on(t, n);
          else {
            if ("function" != typeof e.addEventListener)
              throw new TypeError(
                'The "emitter" argument must be of type EventEmitter. Received type ' +
                  typeof e,
              );
            e.addEventListener(t, function s(i) {
              r.once && e.removeEventListener(t, s), n(i);
            });
          }
        }
        Object.defineProperty(i, "defaultMaxListeners", {
          enumerable: !0,
          get: function () {
            return o;
          },
          set: function (e) {
            if ("number" != typeof e || e < 0 || s(e))
              throw new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                  e +
                  ".",
              );
            o = e;
          },
        }),
          (i.init = function () {
            (void 0 !== this._events &&
              this._events !== Object.getPrototypeOf(this)._events) ||
              ((this._events = Object.create(null)), (this._eventsCount = 0)),
              (this._maxListeners = this._maxListeners || void 0);
          }),
          (i.prototype.setMaxListeners = function (e) {
            if ("number" != typeof e || e < 0 || s(e))
              throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative number. Received ' +
                  e +
                  ".",
              );
            return (this._maxListeners = e), this;
          }),
          (i.prototype.getMaxListeners = function () {
            return c(this);
          }),
          (i.prototype.emit = function (e) {
            for (var t = [], n = 1; n < arguments.length; n++)
              t.push(arguments[n]);
            var s = "error" === e,
              i = this._events;
            if (void 0 !== i) s = s && void 0 === i.error;
            else if (!s) return !1;
            if (s) {
              var o;
              if ((t.length > 0 && (o = t[0]), o instanceof Error)) throw o;
              var a = new Error(
                "Unhandled error." + (o ? " (" + o.message + ")" : ""),
              );
              throw ((a.context = o), a);
            }
            var c = i[e];
            if (void 0 === c) return !1;
            if ("function" == typeof c) r(c, this, t);
            else {
              var u = c.length,
                l = p(c, u);
              for (n = 0; n < u; ++n) r(l[n], this, t);
            }
            return !0;
          }),
          (i.prototype.addListener = function (e, t) {
            return u(this, e, t, !1);
          }),
          (i.prototype.on = i.prototype.addListener),
          (i.prototype.prependListener = function (e, t) {
            return u(this, e, t, !0);
          }),
          (i.prototype.once = function (e, t) {
            return a(t), this.on(e, h(this, e, t)), this;
          }),
          (i.prototype.prependOnceListener = function (e, t) {
            return a(t), this.prependListener(e, h(this, e, t)), this;
          }),
          (i.prototype.removeListener = function (e, t) {
            var n, r, s, i, o;
            if ((a(t), void 0 === (r = this._events))) return this;
            if (void 0 === (n = r[e])) return this;
            if (n === t || n.listener === t)
              0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : (delete r[e],
                  r.removeListener &&
                    this.emit("removeListener", e, n.listener || t));
            else if ("function" != typeof n) {
              for (s = -1, i = n.length - 1; i >= 0; i--)
                if (n[i] === t || n[i].listener === t) {
                  (o = n[i].listener), (s = i);
                  break;
                }
              if (s < 0) return this;
              0 === s
                ? n.shift()
                : (function (e, t) {
                    for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                    e.pop();
                  })(n, s),
                1 === n.length && (r[e] = n[0]),
                void 0 !== r.removeListener &&
                  this.emit("removeListener", e, o || t);
            }
            return this;
          }),
          (i.prototype.off = i.prototype.removeListener),
          (i.prototype.removeAllListeners = function (e) {
            var t, n, r;
            if (void 0 === (n = this._events)) return this;
            if (void 0 === n.removeListener)
              return (
                0 === arguments.length
                  ? ((this._events = Object.create(null)),
                    (this._eventsCount = 0))
                  : void 0 !== n[e] &&
                    (0 == --this._eventsCount
                      ? (this._events = Object.create(null))
                      : delete n[e]),
                this
              );
            if (0 === arguments.length) {
              var s,
                i = Object.keys(n);
              for (r = 0; r < i.length; ++r)
                "removeListener" !== (s = i[r]) && this.removeAllListeners(s);
              return (
                this.removeAllListeners("removeListener"),
                (this._events = Object.create(null)),
                (this._eventsCount = 0),
                this
              );
            }
            if ("function" == typeof (t = n[e])) this.removeListener(e, t);
            else if (void 0 !== t)
              for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
            return this;
          }),
          (i.prototype.listeners = function (e) {
            return d(this, e, !0);
          }),
          (i.prototype.rawListeners = function (e) {
            return d(this, e, !1);
          }),
          (i.listenerCount = function (e, t) {
            return "function" == typeof e.listenerCount
              ? e.listenerCount(t)
              : f.call(e, t);
          }),
          (i.prototype.listenerCount = f),
          (i.prototype.eventNames = function () {
            return this._eventsCount > 0 ? t(this._events) : [];
          });
      },
      230: (e) => {
        e.exports = "object" == typeof self ? self.FormData : window.FormData;
      },
      913: function (e, t, n) {
        "use strict";
        var r,
          s =
            (this && this.__extends) ||
            ((r = function (e, t) {
              return (
                (r =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t)
                      Object.prototype.hasOwnProperty.call(t, n) &&
                        (e[n] = t[n]);
                  }),
                r(e, t)
              );
            }),
            function (e, t) {
              if ("function" != typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null",
                );
              function n() {
                this.constructor = e;
              }
              r(e, t),
                (e.prototype =
                  null === t
                    ? Object.create(t)
                    : ((n.prototype = t.prototype), new n()));
            }),
          i =
            (this && this.__awaiter) ||
            function (e, t, n, r) {
              return new (n || (n = Promise))(function (s, i) {
                function o(e) {
                  try {
                    c(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(e) {
                  try {
                    c(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(o, a);
                }
                c((r = r.apply(e, t || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                r,
                s,
                i,
                o = {
                  label: 0,
                  sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(i) {
                return function (a) {
                  return (function (i) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; o; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (s =
                              2 & i[0]
                                ? r.return
                                : i[0]
                                ? r.throw || ((s = r.return) && s.call(r), 0)
                                : r.next) &&
                            !(s = s.call(r, i[1])).done)
                        )
                          return s;
                        switch (
                          ((r = 0), s && (i = [2 & i[0], s.value]), i[0])
                        ) {
                          case 0:
                          case 1:
                            s = i;
                            break;
                          case 4:
                            return o.label++, { value: i[1], done: !1 };
                          case 5:
                            o.label++, (r = i[1]), (i = [0]);
                            continue;
                          case 7:
                            (i = o.ops.pop()), o.trys.pop();
                            continue;
                          default:
                            if (
                              !((s = o.trys),
                              (s = s.length > 0 && s[s.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0]))
                            ) {
                              o = 0;
                              continue;
                            }
                            if (
                              3 === i[0] &&
                              (!s || (i[1] > s[0] && i[1] < s[3]))
                            ) {
                              o.label = i[1];
                              break;
                            }
                            if (6 === i[0] && o.label < s[1]) {
                              (o.label = s[1]), (s = i);
                              break;
                            }
                            if (s && o.label < s[2]) {
                              (o.label = s[2]), o.ops.push(i);
                              break;
                            }
                            s[2] && o.ops.pop(), o.trys.pop();
                            continue;
                        }
                        i = t.call(e, o);
                      } catch (e) {
                        (i = [6, e]), (r = 0);
                      } finally {
                        n = s = 0;
                      }
                    if (5 & i[0]) throw i[1];
                    return { value: i[0] ? i[1] : void 0, done: !0 };
                  })([i, a]);
                };
              }
            },
          a =
            (this && this.__asyncValues) ||
            function (e) {
              if (!Symbol.asyncIterator)
                throw new TypeError("Symbol.asyncIterator is not defined.");
              var t,
                n = e[Symbol.asyncIterator];
              return n
                ? n.call(e)
                : ((e =
                    "function" == typeof __values
                      ? __values(e)
                      : e[Symbol.iterator]()),
                  (t = {}),
                  r("next"),
                  r("throw"),
                  r("return"),
                  (t[Symbol.asyncIterator] = function () {
                    return this;
                  }),
                  t);
              function r(n) {
                t[n] =
                  e[n] &&
                  function (t) {
                    return new Promise(function (r, s) {
                      (function (e, t, n, r) {
                        Promise.resolve(r).then(function (t) {
                          e({ value: t, done: n });
                        }, t);
                      })(r, s, (t = e[n](t)).done, t.value);
                    });
                  };
              }
            },
          c =
            (this && this.__spreadArray) ||
            function (e, t, n) {
              if (n || 2 === arguments.length)
                for (var r, s = 0, i = t.length; s < i; s++)
                  (!r && s in t) ||
                    (r || (r = Array.prototype.slice.call(t, 0, s)),
                    (r[s] = t[s]));
              return e.concat(r || Array.prototype.slice.call(t));
            },
          u =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.GryFynProvider = void 0);
        var l,
          h = u(n(187)),
          d = u(n(721)),
          f = n(882),
          p = n(279),
          y = { code: 4100, data: "", message: "Not login" };
        !(function (e) {
          (e.CONNECTED = "gryfyn_connected"),
            (e.DISCONNECTED = "gryfyn_disconnected"),
            (e.CHAIN_CHANGED = "gryfyn_chainChanged"),
            (e.CLOSE_WALLET = "gryfyn_close_wallet"),
            (e.CLOSE_WALLET_FROM_LOADER = "gryfyn_close_wallet_from_loader");
        })(l || (l = {}));
        var m = (function (e) {
          function t(t) {
            void 0 === t && (t = "default");
            var n = e.call(this) || this;
            return (
              (n.isFrameReady = !1),
              (n.iFrameLoading = !1),
              (n.apiKey = ""),
              (n.messageHeader = "{gryfyn_message}"),
              (n.responseMap = new Map()),
              (n.responseIdx = 0),
              (n.src = ""),
              (n.preventCloseFrame = !1),
              (n.chainIdHex = ""),
              (n.isLogin = !1),
              (n.chainIdDec = ""),
              (n.selectedAccount = ""),
              (n.isMetaMask = !1),
              (n.isGryfyn = !0),
              (n.isGryFyn = !0),
              (n.currentSignEventId = -1),
              (n.loaderIFrame = null),
              (n.apiKey = t),
              (n.API_ORIGIN = "https://loader.uat-testnet.metazens.xyz"),
              (n.src = "".concat(n.API_ORIGIN, "/iframe/").concat(t)),
              n.on("disconnect", function () {
                (n.isLogin = !1),
                  (n.chainIdDec = ""),
                  (n.chainIdHex = ""),
                  (n.selectedAccount = ""),
                  Array.from(n.responseMap.values()).forEach(function (e) {
                    e({ error: "disconnected" });
                  }),
                  (n.responseMap = new Map());
              }),
              window.addEventListener("message", function (e) {
                var t;
                if (e.origin === n.API_ORIGIN)
                  try {
                    if (
                      e &&
                      e.data &&
                      e.data.toString().startsWith(n.messageHeader)
                    ) {
                      var r = JSON.parse(e.data.replace(n.messageHeader, ""));
                      if (null == r ? void 0 : r.error)
                        return (
                          n.responseMap.get(r.id)({ error: r.error }),
                          void (n.preventCloseFrame = !1)
                        );
                      switch (r.method) {
                        case "closeIFrame":
                          n.closeIFrame();
                          break;
                        case l.CHAIN_CHANGED:
                          var s = r.response.chainId;
                          (a = (0, f.dec2hex)(s)) !== n.chainIdHex &&
                            ((n.chainIdHex = a),
                            (n.chainIdDec = Number(s).toString(10)),
                            n.emit("chainChanged", {
                              chainId: n.chainIdHex,
                            }));
                          break;
                        case l.CLOSE_WALLET:
                          n.preventCloseFrame
                            ? ((n.preventCloseFrame = !1),
                              n.closeIFrame(),
                              n.currentSignEventId > 0 &&
                                (n.responseMap.get(n.currentSignEventId)({
                                  error: (0, p.getProviderErrors)(
                                    p.ErrorType.USER_REJECTED,
                                  ),
                                }),
                                (n.currentSignEventId = -1)))
                            : n.closeIFrame();
                          break;
                        case l.CLOSE_WALLET_FROM_LOADER:
                          n.closeIFrame();
                          break;
                        case l.CONNECTED:
                          n.isLogin = !0;
                          var i = r.response,
                            o = ((s = i.chainId), i.addresses),
                            a = (0, f.dec2hex)(s);
                          (n.chainIdHex = a),
                            (n.chainIdDec = Number(s).toString(10)),
                            (n.selectedAccount =
                              null !== (t = null == o ? void 0 : o[0]) &&
                              void 0 !== t
                                ? t
                                : ""),
                            n.emit("connect", { chainId: n.chainIdHex }),
                            n.emit("chainChanged", { chainId: n.chainIdHex }),
                            n.emit("accountsChanged", o);
                          break;
                        case l.DISCONNECTED:
                          n.isLogin = !1;
                          s = r.response.chainId;
                          n.emit("disconnect", {}), n.removeIFrame();
                          break;
                        default:
                          if ("function" != typeof n.responseMap.get(r.id))
                            return;
                          n.responseMap.get(r.id)(r.response),
                            n.responseMap.delete(r.id);
                      }
                    }
                  } catch (e) {
                    console.log("ERROR", null == e ? void 0 : e.data);
                  }
              }),
              n
            );
          }
          return (
            s(t, e),
            (t.prototype.chainId = function () {
              return this.chainIdHex;
            }),
            (t.prototype.getSupportedChainID = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_get_supported_chain_id", {}),
                      ];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainID = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.request = function (e) {
              var t, n;
              return i(this, void 0, void 0, function () {
                var r,
                  s,
                  i,
                  u,
                  l,
                  h,
                  m,
                  g,
                  v,
                  w,
                  _,
                  I,
                  b,
                  E,
                  P,
                  A,
                  O,
                  x,
                  C,
                  S,
                  F,
                  R,
                  L,
                  N,
                  T = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      if (null == e.method) return [2, null];
                      switch (e.method) {
                        case "gryfyn_requestKYC":
                          return [3, 1];
                        case "eth_accounts":
                        case "eth_requestAccounts":
                          return [3, 8];
                        case "eth_getBalance":
                          return [3, 14];
                        case "gryfyn_send_transaction":
                        case "eth_sendTransaction":
                          return [3, 19];
                        case "eth_chainId":
                          return [3, 38];
                        case "eth_signTypedData":
                        case "gryfyn_sign_typed_data":
                          return [3, 40];
                        case "personal_sign":
                        case "gryfyn_sign_message":
                        case "eth_sign":
                          return [3, 47];
                        case "personal_ecRecover":
                          return [3, 53];
                      }
                      return [3, 56];
                    case 1:
                      return this.isLogin ? [3, 4] : [4, this.openWindow()];
                    case 2:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 3:
                      return o.sent(), [2, y];
                    case 4:
                      return [4, this.openWindow()];
                    case 5:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 6:
                      return (
                        o.sent(),
                        [
                          4,
                          this.requestAPI("gryfyn_open_screen", {
                            deeplink: "/page/account-level",
                          }),
                        ]
                      );
                    case 7:
                      o.sent(), (o.label = 8);
                    case 8:
                      return (
                        o.trys.push([8, 13, , 14]),
                        this.isLogin ? [3, 11] : [4, this.openWindow()]
                      );
                    case 9:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 10:
                      return o.sent(), [2, y];
                    case 11:
                      return [4, this.requestAPI("gryfyn_account", {})];
                    case 12:
                      return (N = o.sent()).length > 0
                        ? ((r = N[0]),
                          (S = r.address),
                          (s = r.chain_id),
                          (this.selectedAccount = S),
                          (this.chainIdDec = s),
                          (this.chainIdHex = "0x".concat(
                            Number(this.chainIdDec).toString(16),
                          )),
                          this.emit("connect", { chainId: this.chainIdHex }),
                          this.emit(
                            "accountsChanged",
                            N.map(function (e) {
                              var t = e.address;
                              return null != t ? t : "";
                            }),
                          ),
                          [2, [S]])
                        : [3, 14];
                    case 13:
                      throw (
                        ((i = o.sent()),
                        this.emit("disconnect"),
                        (0, p.getProviderErrors)(
                          p.ErrorType.DISCONNECTED,
                          null == i ? void 0 : i.message,
                        ))
                      );
                    case 14:
                      return this.isLogin ? [3, 17] : [4, this.openWindow()];
                    case 15:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 16:
                      return o.sent(), [2, y];
                    case 17:
                      return [4, this.requestAPI("gryfyn_balance", {})];
                    case 18:
                      return (
                        (N = o.sent()),
                        (u =
                          N.find(function (e) {
                            var t = e.chainId,
                              n = e.assetId;
                            return t === T.chainIdDec && -1 === n.indexOf("0x");
                          }) || {}),
                        (l = (null == u ? void 0 : u.balance) || "0"),
                        [2, "0x".concat(Number(l).toString(16))]
                      );
                    case 19:
                      return this.isLogin ? [4, this.openWindow()] : [3, 37];
                    case 20:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 21:
                      o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (h = []),
                        (o.label = 22);
                    case 22:
                      o.trys.push([22, 27, 28, 33]),
                        (m = a(e.params)),
                        (o.label = 23);
                    case 23:
                      return [4, m.next()];
                    case 24:
                      if ((g = o.sent()).done) return [3, 26];
                      ((v = g.value).chainId = v.chainId || C),
                        (v.from = S),
                        (v.type = 2),
                        void 0 === v.maxFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxFeePerGas = v.gasPrice),
                        void 0 === v.maxPriorityFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxPriorityFeePerGas = v.gasPrice),
                        h.push(v),
                        (o.label = 25);
                    case 25:
                      return [3, 23];
                    case 26:
                      return [3, 33];
                    case 27:
                      return (w = o.sent()), (t = { error: w }), [3, 33];
                    case 28:
                      return (
                        o.trys.push([28, , 31, 32]),
                        g && !g.done && (n = m.return)
                          ? [4, n.call(m)]
                          : [3, 30]
                      );
                    case 29:
                      o.sent(), (o.label = 30);
                    case 30:
                      return [3, 32];
                    case 31:
                      if (t) throw t.error;
                      return [7];
                    case 32:
                      return [7];
                    case 33:
                      (this.preventCloseFrame = !0), (o.label = 34);
                    case 34:
                      return (
                        o.trys.push([34, 36, , 37]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [
                          4,
                          this.requestAPI(
                            "gryfyn_send_transaction",
                            c([C, S], h, !0),
                          ),
                        ]
                      );
                    case 35:
                      return (
                        (N = o.sent()), (this.preventCloseFrame = !1), [2, N]
                      );
                    case 36:
                      throw ((_ = o.sent()), (this.preventCloseFrame = !1), _);
                    case 37:
                      return [2, y];
                    case 38:
                      return [4, this.requestAPI("gryfyn_chain_id", {})];
                    case 39:
                      return (
                        (C = o.sent().chainId),
                        (0, f.dec2hex)(C) !== this.chainIdHex &&
                          ((this.chainIdHex = (0, f.dec2hex)(C)),
                          (this.chainIdDec = Number(C).toString(10)),
                          this.emit("chainChanged", {
                            chainId: this.chainIdHex,
                          })),
                        [2, this.chainIdHex]
                      );
                    case 40:
                      return this.isLogin ? [4, this.openWallet()] : [3, 46];
                    case 41:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 42:
                      if (
                        (o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        !(I = e.params) ||
                          "0x" === I ||
                          I.length < 1 ||
                          !I[0] ||
                          "0x" === I[0])
                      )
                        return [2, p.ErrorType.PARAM_ERROR];
                      (F = c([C, S], I, !0)),
                        (this.preventCloseFrame = !0),
                        (o.label = 43);
                    case 43:
                      return (
                        o.trys.push([43, 45, , 46]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_typed_data", F)]
                      );
                    case 44:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 45:
                      throw ((b = o.sent()), (this.preventCloseFrame = !1), b);
                    case 46:
                      return [2, y];
                    case 47:
                      return this.isLogin ? [4, this.openWallet()] : [3, 52];
                    case 48:
                      if (
                        (o.sent(),
                        (E = e.params),
                        (P = E[0]),
                        (A = E[1]),
                        E[2],
                        null == P || "" === P || "0x" === P)
                      )
                        return [2, p.ErrorType.PARAM_ERROR];
                      (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (O = decodeURIComponent(
                          "%".concat(
                            P.slice(2)
                              .match(/.{1,2}/g)
                              .join("%"),
                          ),
                        )),
                        (F = [C, null != S ? S : A, O]),
                        (o.label = 49);
                    case 49:
                      return (
                        o.trys.push([49, 51, , 52]),
                        (this.preventCloseFrame = !0),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_message", F)]
                      );
                    case 50:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 51:
                      throw ((x = o.sent()), (this.preventCloseFrame = !1), x);
                    case 52:
                      return [2, y];
                    case 53:
                      return this.isLogin
                        ? ((C = this.chainIdDec),
                          (S = this.selectedAccount),
                          (F = c(
                            [C, null != S ? S : this.selectedAccount],
                            e.params,
                            !0,
                          )),
                          [4, this.requestAPI("gryfyn_ecrecovery", F)])
                        : [3, 55];
                    case 54:
                      return [2, (R = o.sent())];
                    case 55:
                      return [2, y];
                    case 56:
                      return (
                        (L = ""
                          .concat(this.API_ORIGIN, "?chainId=")
                          .concat(this.chainIdDec)),
                        null == e.id && (e.id = 1),
                        [4, d.default.post(L, e, {})]
                      );
                    case 57:
                      if ((N = o.sent()).data && N.data.result)
                        return [2, N.data.result];
                      if (N.data && N.data.error) throw N.data.error;
                      return [2, N.data];
                  }
                });
              });
            }),
            (t.prototype.listen = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.dequeue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enable = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enqueue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.send = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.sendAsync = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, (0, f.sleep)(1e3)];
                    case 1:
                      return (
                        e.sent(),
                        [
                          2,
                          new Promise(function (e) {
                            setTimeout(function () {
                              e(1);
                            }, 5e3);
                          }),
                        ]
                      );
                  }
                });
              });
            }),
            (t.prototype.getGryfynIframe = function () {
              var e = document.getElementById("gryfynIFrame");
              return null != e ? e : null;
            }),
            (t.prototype.openWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.isFrameReady
                        ? [4, this.openIFrame(this.src)]
                        : [3, 2];
                    case 1:
                      return e.sent(), [2];
                    case 2:
                      throw (0,
                      p.getProviderErrors)(p.ErrorType.DISCONNECTED, "Connect wallet first!");
                  }
                });
              });
            }),
            (t.prototype.closeWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.isFrameReady
                        ? [4, this.closeIFrame()]
                        : [3, 2];
                    case 1:
                      return e.sent(), [2];
                    case 2:
                      throw (0,
                      p.getProviderErrors)(p.ErrorType.DISCONNECTED, "Connect wallet first!");
                  }
                });
              });
            }),
            (t.prototype.openWindow = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.openIFrame(this.src)];
                    case 1:
                      return e.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.getUserLevel = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.requestAPI("gryfyn_get_user_level", {})];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainId = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return [2, t.sent()];
                  }
                });
              });
            }),
            (t.prototype.requestAPI = function (e, t) {
              return i(this, void 0, void 0, function () {
                var n,
                  r,
                  s,
                  i,
                  a = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return (
                        (this.responseIdx += 1),
                        (n = this.responseIdx),
                        (r = this.getGryfynIframe()),
                        this.isFrameReady
                          ? [3, 2]
                          : [4, this.openIFrame(this.src)]
                      );
                    case 1:
                      (r = o.sent()), (o.label = 2);
                    case 2:
                      return null != r && null != r.contentWindow
                        ? ((s = { method: e, params: t, id: n }),
                          console.log("PROVIDER - data to emit: ", r.src),
                          this.postMessage(r, s),
                          (i = function (e, t) {
                            return function (n) {
                              var r = n.error;
                              r ? t(r) : e(n);
                            };
                          }),
                          [
                            2,
                            new Promise(function (e, t) {
                              a.responseMap.set(n, i(e, t));
                            }),
                          ])
                        : [2, null];
                  }
                });
              });
            }),
            (t.prototype.setHostname = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return (
                        (e = window.location.hostname),
                        [
                          4,
                          this.requestAPI("gryfyn_set_hostname", {
                            hostname: e,
                          }),
                        ]
                      );
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.closeIFrame = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    this.preventCloseFrame ||
                      ((this.preventCloseFrame = !1),
                      null != (e = this.getGryfynIframe()) &&
                        ((e.style.display = "none"),
                        (e.style.width = "0px"),
                        (e.style.height = "0px"),
                        (e.style.zIndex = "-1"))),
                    [2]
                  );
                });
              });
            }),
            (t.prototype.removeIFrame = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    this.preventCloseFrame ||
                      ((this.preventCloseFrame = !1),
                      (e = this.getGryfynIframe()) &&
                        (e.remove(),
                        (this.isFrameReady = !1),
                        (this.iFrameLoading = !1))),
                    [2]
                  );
                });
              });
            }),
            (t.prototype.openIFrame = function (e) {
              return i(this, void 0, void 0, function () {
                var t;
                return o(this, function (n) {
                  switch (n.label) {
                    case 0:
                      return this.iFrameLoading
                        ? [2, null]
                        : null != (t = this.getGryfynIframe())
                        ? [3, 2]
                        : [4, this.initIframe(e)];
                    case 1:
                      (t = n.sent()), (n.label = 2);
                    case 2:
                      return (
                        t &&
                          (this.setHostname(),
                          this.requestAPI("gryfyn_open_wallet", {}),
                          (t.style.display = "block"),
                          (t.style.width = "100%"),
                          (t.style.height = "100%"),
                          (t.style.zIndex = "16777271")),
                        [2, t]
                      );
                  }
                });
              });
            }),
            (t.prototype.initIframe = function (e) {
              return i(this, void 0, void 0, function () {
                var t = this;
                return o(this, function (n) {
                  return this.iFrameLoading || null != this.getGryfynIframe()
                    ? [2, null]
                    : [
                        2,
                        new Promise(function (n, r) {
                          var s = document.createElement("iframe");
                          (t.isFrameReady = !1),
                            (t.iFrameLoading = !0),
                            (s.id = "gryfynIFrame"),
                            s.setAttribute("src", e),
                            s.setAttribute("frameborder", "0"),
                            s.setAttribute(
                              "allow",
                              "camera *; microphone *; geolocation *; clipboard-write *",
                            ),
                            (s.style.width = "0%"),
                            (s.style.height = "0%"),
                            (s.style.userSelect = "none"),
                            (s.style.zIndex = "16777271"),
                            (s.style.position = "fixed"),
                            (s.style.top = "0px"),
                            (s.style.left = "0px"),
                            (s.style.paddingLeft = "0px"),
                            (s.style.paddingTop = "0px"),
                            (s.style.display = "hidden"),
                            (s.onload = function () {
                              return i(t, void 0, void 0, function () {
                                var e,
                                  t = this;
                                return o(this, function (r) {
                                  return (
                                    (e = function (r) {
                                      var i;
                                      if (r.origin === t.API_ORIGIN) {
                                        var o =
                                          null ===
                                            (i = r.data.split(
                                              t.messageHeader,
                                            )) || void 0 === i
                                            ? void 0
                                            : i[1];
                                        if (o) {
                                          var a = JSON.parse(o);
                                          "loaded" === a.method &&
                                            !0 === a.response &&
                                            ((t.isFrameReady = !0),
                                            (t.iFrameLoading = !1),
                                            t.setHostname(),
                                            (t.loaderIFrame = s),
                                            window.removeEventListener(
                                              "message",
                                              e,
                                            ),
                                            n(s));
                                        }
                                      }
                                    }),
                                    window.addEventListener("message", e),
                                    this.postMessage(s, {
                                      method: "gryfyn_api_handshake",
                                      params: {},
                                    }),
                                    [2]
                                  );
                                });
                              });
                            }),
                            document.body.appendChild(s);
                        }),
                      ];
                });
              });
            }),
            (t.prototype.postMessage = function (e, t) {
              e.contentWindow &&
                e.contentWindow.postMessage(
                  this.messageHeader + JSON.stringify(t),
                  this.API_ORIGIN,
                );
            }),
            (t.prototype.connect = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return this.getGryfynIframe()
                        ? [3, 5]
                        : [4, this.initIframe(this.src)];
                    case 1:
                      return (
                        t.sent(), [4, this.requestAPI("gryfyn_is_login", {})]
                      );
                    case 2:
                      return (
                        (e = t.sent().isLogin),
                        (this.isLogin = e),
                        e ? [3, 5] : [4, this.openWallet()]
                      );
                    case 3:
                      return (
                        t.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 4:
                      throw (
                        (t.sent(),
                        this.emit("disconnect"),
                        (0, p.getProviderErrors)(p.ErrorType.DISCONNECTED))
                      );
                    case 5:
                      return [2];
                  }
                });
              });
            }),
            (t.prototype.logout = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    null != (e = this.getGryfynIframe()) &&
                      this.postMessage(e, {
                        method: "gryfyn_logout",
                        params: {},
                      }),
                    [2]
                  );
                });
              });
            }),
            t
          );
        })(h.default);
        t.GryFynProvider = m;
      },
      41: function (e, t, n) {
        "use strict";
        var r,
          s =
            (this && this.__extends) ||
            ((r = function (e, t) {
              return (
                (r =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t)
                      Object.prototype.hasOwnProperty.call(t, n) &&
                        (e[n] = t[n]);
                  }),
                r(e, t)
              );
            }),
            function (e, t) {
              if ("function" != typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null",
                );
              function n() {
                this.constructor = e;
              }
              r(e, t),
                (e.prototype =
                  null === t
                    ? Object.create(t)
                    : ((n.prototype = t.prototype), new n()));
            }),
          i =
            (this && this.__awaiter) ||
            function (e, t, n, r) {
              return new (n || (n = Promise))(function (s, i) {
                function o(e) {
                  try {
                    c(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(e) {
                  try {
                    c(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(o, a);
                }
                c((r = r.apply(e, t || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                r,
                s,
                i,
                o = {
                  label: 0,
                  sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(i) {
                return function (a) {
                  return (function (i) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; o; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (s =
                              2 & i[0]
                                ? r.return
                                : i[0]
                                ? r.throw || ((s = r.return) && s.call(r), 0)
                                : r.next) &&
                            !(s = s.call(r, i[1])).done)
                        )
                          return s;
                        switch (
                          ((r = 0), s && (i = [2 & i[0], s.value]), i[0])
                        ) {
                          case 0:
                          case 1:
                            s = i;
                            break;
                          case 4:
                            return o.label++, { value: i[1], done: !1 };
                          case 5:
                            o.label++, (r = i[1]), (i = [0]);
                            continue;
                          case 7:
                            (i = o.ops.pop()), o.trys.pop();
                            continue;
                          default:
                            if (
                              !((s = o.trys),
                              (s = s.length > 0 && s[s.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0]))
                            ) {
                              o = 0;
                              continue;
                            }
                            if (
                              3 === i[0] &&
                              (!s || (i[1] > s[0] && i[1] < s[3]))
                            ) {
                              o.label = i[1];
                              break;
                            }
                            if (6 === i[0] && o.label < s[1]) {
                              (o.label = s[1]), (s = i);
                              break;
                            }
                            if (s && o.label < s[2]) {
                              (o.label = s[2]), o.ops.push(i);
                              break;
                            }
                            s[2] && o.ops.pop(), o.trys.pop();
                            continue;
                        }
                        i = t.call(e, o);
                      } catch (e) {
                        (i = [6, e]), (r = 0);
                      } finally {
                        n = s = 0;
                      }
                    if (5 & i[0]) throw i[1];
                    return { value: i[0] ? i[1] : void 0, done: !0 };
                  })([i, a]);
                };
              }
            },
          a =
            (this && this.__asyncValues) ||
            function (e) {
              if (!Symbol.asyncIterator)
                throw new TypeError("Symbol.asyncIterator is not defined.");
              var t,
                n = e[Symbol.asyncIterator];
              return n
                ? n.call(e)
                : ((e =
                    "function" == typeof __values
                      ? __values(e)
                      : e[Symbol.iterator]()),
                  (t = {}),
                  r("next"),
                  r("throw"),
                  r("return"),
                  (t[Symbol.asyncIterator] = function () {
                    return this;
                  }),
                  t);
              function r(n) {
                t[n] =
                  e[n] &&
                  function (t) {
                    return new Promise(function (r, s) {
                      (function (e, t, n, r) {
                        Promise.resolve(r).then(function (t) {
                          e({ value: t, done: n });
                        }, t);
                      })(r, s, (t = e[n](t)).done, t.value);
                    });
                  };
              }
            },
          c =
            (this && this.__spreadArray) ||
            function (e, t, n) {
              if (n || 2 === arguments.length)
                for (var r, s = 0, i = t.length; s < i; s++)
                  (!r && s in t) ||
                    (r || (r = Array.prototype.slice.call(t, 0, s)),
                    (r[s] = t[s]));
              return e.concat(r || Array.prototype.slice.call(t));
            },
          u =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.GryFynProviderPopup = void 0);
        var l,
          h = u(n(187)),
          d = u(n(721)),
          f = n(145),
          p = n(882),
          y = n(279),
          m = "https://uat-testnet.metazens.xyz",
          g = { code: 4100, data: "", message: "Not login" };
        !(function (e) {
          (e.CONNECTED = "gryfyn_connected"),
            (e.DISCONNECTED = "gryfyn_disconnected"),
            (e.CHAIN_CHANGED = "gryfyn_chainChanged"),
            (e.CLOSE_WALLET = "gryfyn_close_wallet"),
            (e.CLOSE_WALLET_FROM_LOADER = "gryfyn_close_wallet_from_loader"),
            (e.REDIRECT_LOGIN = "gryfyn_redirect_login");
        })(l || (l = {}));
        var v = (function (e) {
          function t(t, n) {
            void 0 === t && (t = "default"), void 0 === n && (n = {});
            var r = e.call(this) || this;
            if (
              ((r.isFrameReady = !1),
              (r.walletLoading = !1),
              (r.apiKey = ""),
              (r.walletMode = 1),
              (r.messageHeader = "{gryfyn_message}"),
              (r.responseMap = new Map()),
              (r.responseIdx = 0),
              (r.defaultiFrameSrc = ""),
              (r.src = ""),
              (r.preventCloseFrame = !1),
              (r.chainIdHex = ""),
              (r.isLogin = !1),
              (r.chainIdDec = ""),
              (r.selectedAccount = ""),
              (r.isIncognito = !1),
              (r.isMetaMask = !1),
              (r.isGryfyn = !0),
              (r.isGryFyn = !0),
              (r.currentSignEventId = -1),
              (r.loaderIFrame = null),
              (r.loaderWindows = null),
              (r.apiKey = t),
              (r.API_ORIGIN = "https://loader.uat-testnet.metazens.xyz"),
              (r.defaultiFrameSrc = ""
                .concat(r.API_ORIGIN, "/iframe/")
                .concat(t)),
              (r.src = r.defaultiFrameSrc),
              r.on("disconnect", function () {
                (r.isLogin = !1),
                  (r.chainIdDec = ""),
                  (r.chainIdHex = ""),
                  (r.selectedAccount = ""),
                  Array.from(r.responseMap.values()).forEach(function (e) {
                    e({ error: "disconnected" });
                  }),
                  (r.responseMap = new Map());
              }),
              window.location.search.includes("fromGryfyn"))
            ) {
              var s = new URLSearchParams(window.location.search).get(
                "fromGryfyn",
              );
              try {
                var i = JSON.parse(atob(s || "")),
                  o = localStorage.getItem("gryfyn_redirect_id");
                i &&
                  i.url &&
                  o === i.redirectId &&
                  (i.redirectId &&
                    (r.src = ""
                      .concat(r.src, "?iFrameSrc=")
                      .concat(encodeURIComponent(i.url))),
                  localStorage.removeItem("gryfyn_redirect_id"),
                  setTimeout(function () {
                    r.connect();
                  }, 500));
              } catch (e) {
                console.log(e);
              }
            }
            return (
              (0, f.detectIncognito)().then(function (e) {
                r.isIncognito = e.isPrivate;
              }),
              n && n.walletMode && (r.walletMode = n.walletMode),
              window.addEventListener("message", function (e) {
                var t;
                if (e.origin === r.API_ORIGIN)
                  try {
                    if (
                      e &&
                      e.data &&
                      e.data.toString().startsWith(r.messageHeader)
                    ) {
                      var n = JSON.parse(e.data.replace(r.messageHeader, ""));
                      if (null == n ? void 0 : n.error)
                        return (
                          r.responseMap.get(n.id)({ error: n.error }),
                          void (r.preventCloseFrame = !1)
                        );
                      switch (n.method) {
                        case "closeIFrame":
                          r.closeIFrame();
                          break;
                        case l.CHAIN_CHANGED:
                          var s = n.response.chainId;
                          (a = (0, p.dec2hex)(s)) !== r.chainIdHex &&
                            ((r.chainIdHex = a),
                            (r.chainIdDec = Number(s).toString(10)),
                            r.emit("chainChanged", {
                              chainId: r.chainIdHex,
                            }));
                          break;
                        case l.CLOSE_WALLET:
                          r.preventCloseFrame
                            ? ((r.preventCloseFrame = !1),
                              r.closeIFrame(),
                              r.currentSignEventId > 0 &&
                                (r.responseMap.get(r.currentSignEventId)({
                                  error: (0, y.getProviderErrors)(
                                    y.ErrorType.USER_REJECTED,
                                  ),
                                }),
                                (r.currentSignEventId = -1)))
                            : r.closeIFrame();
                          break;
                        case l.CLOSE_WALLET_FROM_LOADER:
                          r.closeIFrame();
                          break;
                        case l.CONNECTED:
                          r.isLogin = !0;
                          var i = n.response,
                            o = ((s = i.chainId), i.addresses),
                            a = (0, p.dec2hex)(s);
                          (r.chainIdHex = a),
                            (r.chainIdDec = Number(s).toString(10)),
                            (r.selectedAccount =
                              null !== (t = null == o ? void 0 : o[0]) &&
                              void 0 !== t
                                ? t
                                : ""),
                            r.setHostname(),
                            r.emit("connect", { chainId: r.chainIdHex }),
                            r.emit("chainChanged", { chainId: r.chainIdHex }),
                            r.emit("accountsChanged", o);
                          break;
                        case l.DISCONNECTED:
                          (r.isLogin = !1),
                            (r.isFrameReady = !1),
                            (r.walletLoading = !1),
                            r.emit("disconnect", {}),
                            r.removeIFrame(!1);
                          break;
                        case l.REDIRECT_LOGIN:
                          var c = n.response.redirectUrl;
                          if (c) {
                            var u = new URL(window.location.href);
                            u.searchParams.delete("fromGryfyn");
                            var h = u.href,
                              d = Math.random().toString(36).substring(7);
                            localStorage.setItem("gryfyn_redirect_id", d);
                            var f = ""
                              .concat(
                                m,
                                "/setRedirectToLocalStorage?gameOrigin=",
                              )
                              .concat(encodeURIComponent(h), "&redirectUrl=")
                              .concat(encodeURIComponent(c), "&redirectId=")
                              .concat(d);
                            setTimeout(function () {
                              window.location.href = f;
                            }, 10);
                            break;
                          }
                        default:
                          if ("function" != typeof r.responseMap.get(n.id))
                            return;
                          r.responseMap.get(n.id)(n.response),
                            r.responseMap.delete(n.id);
                      }
                    }
                  } catch (t) {
                    console.log("ERROR", t, JSON.stringify(e));
                  }
              }),
              r
            );
          }
          return (
            s(t, e),
            (t.prototype.chainId = function () {
              return this.chainIdHex;
            }),
            (t.prototype.getSupportedChainID = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_get_supported_chain_id", {}),
                      ];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainID = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.request = function (e) {
              var t, n;
              return i(this, void 0, void 0, function () {
                var r,
                  s,
                  i,
                  u,
                  l,
                  h,
                  f,
                  m,
                  v,
                  w,
                  _,
                  I,
                  b,
                  E,
                  P,
                  A,
                  O,
                  x,
                  C,
                  S,
                  F,
                  R,
                  L,
                  N,
                  T = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      if (null == e.method) return [2, null];
                      switch (e.method) {
                        case "gryfyn_requestKYC":
                          return [3, 1];
                        case "eth_accounts":
                        case "eth_requestAccounts":
                          return [3, 8];
                        case "eth_getBalance":
                          return [3, 14];
                        case "gryfyn_send_transaction":
                        case "eth_sendTransaction":
                          return [3, 19];
                        case "eth_chainId":
                          return [3, 38];
                        case "eth_signTypedData":
                        case "gryfyn_sign_typed_data":
                          return [3, 40];
                        case "personal_sign":
                        case "gryfyn_sign_message":
                        case "eth_sign":
                          return [3, 47];
                        case "personal_ecRecover":
                          return [3, 53];
                      }
                      return [3, 56];
                    case 1:
                      return this.isLogin ? [3, 4] : [4, this.openWallet()];
                    case 2:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 3:
                      if ((o.sent(), !this.isLogin)) return [2, g];
                      o.label = 4;
                    case 4:
                      return [4, this.openWallet()];
                    case 5:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 6:
                      return (
                        o.sent(),
                        [
                          4,
                          this.requestAPI("gryfyn_open_screen", {
                            deeplink: "/page/account-level",
                          }),
                        ]
                      );
                    case 7:
                      o.sent(), (o.label = 8);
                    case 8:
                      return (
                        o.trys.push([8, 13, , 14]),
                        this.isLogin ? [3, 11] : [4, this.openWallet()]
                      );
                    case 9:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 10:
                      if ((o.sent(), !this.isLogin)) return [2, g];
                      o.label = 11;
                    case 11:
                      return [4, this.requestAPI("gryfyn_account", {})];
                    case 12:
                      return (N = o.sent()).length > 0
                        ? ((r = N[0]),
                          (S = r.address),
                          (s = r.chain_id),
                          (this.selectedAccount = S),
                          (this.chainIdDec = s),
                          (this.chainIdHex = "0x".concat(
                            Number(this.chainIdDec).toString(16),
                          )),
                          this.emit("connect", { chainId: this.chainIdHex }),
                          this.emit(
                            "accountsChanged",
                            N.map(function (e) {
                              var t = e.address;
                              return null != t ? t : "";
                            }),
                          ),
                          [2, [S]])
                        : [3, 14];
                    case 13:
                      throw (
                        ((i = o.sent()),
                        this.emit("disconnect"),
                        (0, y.getProviderErrors)(
                          y.ErrorType.DISCONNECTED,
                          null == i ? void 0 : i.message,
                        ))
                      );
                    case 14:
                      return this.isLogin ? [3, 17] : [4, this.openWallet()];
                    case 15:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 16:
                      if ((o.sent(), !this.isLogin)) return [2, g];
                      o.label = 17;
                    case 17:
                      return [4, this.requestAPI("gryfyn_balance", {})];
                    case 18:
                      return (
                        (N = o.sent()),
                        (u =
                          N.find(function (e) {
                            var t = e.chainId,
                              n = e.assetId;
                            return t === T.chainIdDec && -1 === n.indexOf("0x");
                          }) || {}),
                        (l = (null == u ? void 0 : u.balance) || "0"),
                        [2, "0x".concat(Number(l).toString(16))]
                      );
                    case 19:
                      return this.isLogin ? [4, this.openWallet()] : [3, 37];
                    case 20:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 21:
                      o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (h = []),
                        (o.label = 22);
                    case 22:
                      o.trys.push([22, 27, 28, 33]),
                        (f = a(e.params)),
                        (o.label = 23);
                    case 23:
                      return [4, f.next()];
                    case 24:
                      if ((m = o.sent()).done) return [3, 26];
                      ((v = m.value).chainId = v.chainId || C),
                        (v.from = S),
                        (v.type = 2),
                        void 0 === v.maxFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxFeePerGas = v.gasPrice),
                        void 0 === v.maxPriorityFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxPriorityFeePerGas = v.gasPrice),
                        h.push(v),
                        (o.label = 25);
                    case 25:
                      return [3, 23];
                    case 26:
                      return [3, 33];
                    case 27:
                      return (w = o.sent()), (t = { error: w }), [3, 33];
                    case 28:
                      return (
                        o.trys.push([28, , 31, 32]),
                        m && !m.done && (n = f.return)
                          ? [4, n.call(f)]
                          : [3, 30]
                      );
                    case 29:
                      o.sent(), (o.label = 30);
                    case 30:
                      return [3, 32];
                    case 31:
                      if (t) throw t.error;
                      return [7];
                    case 32:
                      return [7];
                    case 33:
                      (this.preventCloseFrame = !0), (o.label = 34);
                    case 34:
                      return (
                        o.trys.push([34, 36, , 37]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [
                          4,
                          this.requestAPI(
                            "gryfyn_send_transaction",
                            c([C, S], h, !0),
                          ),
                        ]
                      );
                    case 35:
                      return (
                        (N = o.sent()), (this.preventCloseFrame = !1), [2, N]
                      );
                    case 36:
                      throw ((_ = o.sent()), (this.preventCloseFrame = !1), _);
                    case 37:
                      return [2, g];
                    case 38:
                      return [4, this.requestAPI("gryfyn_chain_id", {})];
                    case 39:
                      return (
                        (C = o.sent().chainId),
                        (0, p.dec2hex)(C) !== this.chainIdHex &&
                          ((this.chainIdHex = (0, p.dec2hex)(C)),
                          (this.chainIdDec = Number(C).toString(10)),
                          this.emit("chainChanged", {
                            chainId: this.chainIdHex,
                          })),
                        [2, this.chainIdHex]
                      );
                    case 40:
                      return this.isLogin ? [4, this.openWallet()] : [3, 46];
                    case 41:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 42:
                      if (
                        (o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        !(I = e.params) ||
                          "0x" === I ||
                          I.length < 1 ||
                          !I[0] ||
                          "0x" === I[0])
                      )
                        return [2, y.ErrorType.PARAM_ERROR];
                      (F = c([C, S], I, !0)),
                        (this.preventCloseFrame = !0),
                        (o.label = 43);
                    case 43:
                      return (
                        o.trys.push([43, 45, , 46]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_typed_data", F)]
                      );
                    case 44:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 45:
                      throw ((b = o.sent()), (this.preventCloseFrame = !1), b);
                    case 46:
                      return [2, g];
                    case 47:
                      return this.isLogin ? [4, this.openWallet()] : [3, 52];
                    case 48:
                      if (
                        (o.sent(),
                        (E = e.params),
                        (P = E[0]),
                        (A = E[1]),
                        E[2],
                        null == P || "" === P || "0x" === P)
                      )
                        return [2, y.ErrorType.PARAM_ERROR];
                      (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (O = decodeURIComponent(
                          "%".concat(
                            P.slice(2)
                              .match(/.{1,2}/g)
                              .join("%"),
                          ),
                        )),
                        (F = [C, null != S ? S : A, O]),
                        (o.label = 49);
                    case 49:
                      return (
                        o.trys.push([49, 51, , 52]),
                        (this.preventCloseFrame = !0),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_message", F)]
                      );
                    case 50:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 51:
                      throw ((x = o.sent()), (this.preventCloseFrame = !1), x);
                    case 52:
                      return [2, g];
                    case 53:
                      return this.isLogin
                        ? ((C = this.chainIdDec),
                          (S = this.selectedAccount),
                          (F = c(
                            [C, null != S ? S : this.selectedAccount],
                            e.params,
                            !0,
                          )),
                          [4, this.requestAPI("gryfyn_ecrecovery", F)])
                        : [3, 55];
                    case 54:
                      return [2, (R = o.sent())];
                    case 55:
                      return [2, g];
                    case 56:
                      return (
                        (L = ""
                          .concat(this.API_ORIGIN, "?chainId=")
                          .concat(this.chainIdDec)),
                        null == e.id && (e.id = 1),
                        [4, d.default.post(L, e, {})]
                      );
                    case 57:
                      if ((N = o.sent()).data && N.data.result)
                        return [2, N.data.result];
                      if (N.data && N.data.error) throw N.data.error;
                      return [2, N.data];
                  }
                });
              });
            }),
            (t.prototype.listen = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.dequeue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enable = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enqueue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.send = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.sendAsync = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, (0, p.sleep)(1e3)];
                    case 1:
                      return (
                        e.sent(),
                        [
                          2,
                          new Promise(function (e) {
                            setTimeout(function () {
                              e(1);
                            }, 5e3);
                          }),
                        ]
                      );
                  }
                });
              });
            }),
            (t.prototype.getGryfynLoader = function () {
              var e = document.getElementById("gryfynIFrame");
              return null != e
                ? { iframe: e, window: null }
                : { iframe: null, window: this.loaderWindows };
            }),
            (t.prototype.closeWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.loaderWindows
                        ? (this.removeIFrame(), [2])
                        : this.isFrameReady
                        ? [4, this.closeIFrame()]
                        : [3, 2];
                    case 1:
                      return e.sent(), [2];
                    case 2:
                      throw (0,
                      y.getProviderErrors)(y.ErrorType.DISCONNECTED, "Connect wallet first!");
                  }
                });
              });
            }),
            (t.prototype.shouldUsePopupWindow = function () {
              return (
                1 !== this.walletMode &&
                (2 === this.walletMode ||
                  this.isIncognito ||
                  [
                    "iPad Simulator",
                    "iPhone Simulator",
                    "iPod Simulator",
                    "iPad",
                    "iPhone",
                    "iPod",
                  ].includes(navigator.platform) ||
                  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
                  navigator.userAgent.includes("SamsungBrowser") ||
                  navigator.userAgent.includes("OPR") ||
                  navigator.userAgent.match(
                    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
                  ))
              );
            }),
            (t.prototype.openWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.shouldUsePopupWindow()
                        ? [4, this.openSubWindow(this.src)]
                        : [3, 2];
                    case 1:
                      return e.sent(), [3, 4];
                    case 2:
                      return [4, this.openIFrame(this.src)];
                    case 3:
                      e.sent(), (e.label = 4);
                    case 4:
                      return [2];
                  }
                });
              });
            }),
            (t.prototype.getUserLevel = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.requestAPI("gryfyn_get_user_level", {})];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainId = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return [2, t.sent()];
                  }
                });
              });
            }),
            (t.prototype.requestAPI = function (e, t) {
              return i(this, void 0, void 0, function () {
                var n,
                  r,
                  s,
                  i,
                  a,
                  c = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return (
                        (this.responseIdx += 1),
                        (n = function (e, t) {
                          return function (n) {
                            var r = n.error;
                            r ? t(r) : e(n);
                          };
                        }),
                        (r = this.responseIdx),
                        (s = this.getGryfynLoader()),
                        (i = s.iframe),
                        s.window,
                        this.shouldUsePopupWindow()
                          ? ((a = { method: e, params: t, id: r }),
                            this.loaderWindows
                              ? [3, 2]
                              : [4, this.openSubWindow(this.src)])
                          : [3, 3]
                      );
                    case 1:
                      o.sent(), (o.label = 2);
                    case 2:
                      return (
                        this.postMessageWindow(a),
                        [
                          2,
                          new Promise(function (e, t) {
                            c.responseMap.set(r, n(e, t));
                          }),
                        ]
                      );
                    case 3:
                      return this.isFrameReady
                        ? [3, 5]
                        : [4, this.openIFrame(this.src)];
                    case 4:
                      (i = o.sent()), (o.label = 5);
                    case 5:
                      if (null != i && null != i.contentWindow)
                        return (
                          (a = { method: e, params: t, id: r }),
                          this.postMessageFrame(i, a),
                          [
                            2,
                            new Promise(function (e, t) {
                              c.responseMap.set(r, n(e, t));
                            }),
                          ]
                        );
                      o.label = 6;
                    case 6:
                      return [2, null];
                  }
                });
              });
            }),
            (t.prototype.setHostname = function () {
              return i(this, void 0, void 0, function () {
                var e,
                  t,
                  n = this;
                return o(this, function (r) {
                  switch (r.label) {
                    case 0:
                      return (
                        (e = window.location.hostname),
                        !0,
                        (t = {
                          hostname: e,
                          href: window.location.href,
                          isRedirectMode: true,
                        }),
                        [4, this.requestAPI("gryfyn_set_hostname", t)]
                      );
                    case 1:
                      return (
                        r.sent(),
                        setTimeout(function () {
                          n.requestAPI("gryfyn_set_hostname", t);
                        }, 500),
                        setTimeout(function () {
                          n.requestAPI("gryfyn_set_hostname", t);
                        }, 2e3),
                        [2]
                      );
                  }
                });
              });
            }),
            (t.prototype.closeIFrame = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    this.preventCloseFrame ||
                      ((this.preventCloseFrame = !1),
                      (e = this.getGryfynLoader().iframe) &&
                        ((e.style.display = "none"),
                        (e.style.width = "0px"),
                        (e.style.height = "0px"),
                        (e.style.zIndex = "-1"))),
                    [2]
                  );
                });
              });
            }),
            (t.prototype.removeIFrame = function (e) {
              return (
                void 0 === e && (e = !0),
                i(this, void 0, void 0, function () {
                  var t,
                    n = this;
                  return o(this, function (r) {
                    return (
                      this.preventCloseFrame ||
                        ((this.preventCloseFrame = !1),
                        (t = this.getGryfynLoader().iframe)
                          ? (t.remove(),
                            (this.isFrameReady = !1),
                            (this.walletLoading = !1))
                          : this.loaderWindows &&
                            ((this.isFrameReady = !1),
                            (this.walletLoading = !1),
                            (this.isLogin = !1),
                            this.requestAPI("gryfyn_close_popup", {}),
                            e && this.emit("disconnect", {}),
                            setTimeout(function () {
                              n.loaderWindows = null;
                            }, 1e3))),
                      [2]
                    );
                  });
                })
              );
            }),
            (t.prototype.openIFrame = function (e) {
              return i(this, void 0, void 0, function () {
                var t, n, r;
                return o(this, function (s) {
                  switch (s.label) {
                    case 0:
                      return this.walletLoading
                        ? [2, null]
                        : ((t = this.getGryfynLoader()),
                          (n = t.iframe),
                          (r = t.window),
                          null != n || null != r
                            ? [3, 2]
                            : [4, this.initIframe(e)]);
                    case 1:
                      (n = s.sent()), (s.label = 2);
                    case 2:
                      return (
                        n &&
                          ((this.src = this.defaultiFrameSrc),
                          this.setHostname(),
                          this.requestAPI("gryfyn_open_wallet", {}),
                          (n.style.display = "block"),
                          (n.style.width = "100%"),
                          (n.style.height = "100%"),
                          (n.style.zIndex = "16777271")),
                        [2, n]
                      );
                  }
                });
              });
            }),
            (t.prototype.openSubWindow = function (e) {
              return i(this, void 0, void 0, function () {
                var t, n, r;
                return o(this, function (s) {
                  switch (s.label) {
                    case 0:
                      return this.walletLoading
                        ? [2, null]
                        : ((t = this.getGryfynLoader()),
                          (n = t.iframe),
                          (r = t.window),
                          null != n || null != r
                            ? [3, 2]
                            : [4, this.initSubWindow(e)]);
                    case 1:
                      s.sent(),
                        this.setHostname(),
                        this.requestAPI("gryfyn_open_wallet", {
                          target: "window",
                        }),
                        (s.label = 2);
                    case 2:
                      return (
                        this.loaderWindows && this.loaderWindows.focus(), [2, r]
                      );
                  }
                });
              });
            }),
            (t.prototype.initSubWindow = function (e) {
              return i(this, void 0, void 0, function () {
                var t = this;
                return o(this, function (n) {
                  return this.walletLoading
                    ? [2, null]
                    : [
                        2,
                        new Promise(function (n, r) {
                          if (
                            ((t.loaderWindows = window.open(
                              e,
                              "popup",
                              "width=360,height=640,scrollbars=no,rel=opener",
                            )),
                            (t.isFrameReady = !1),
                            (t.walletLoading = !0),
                            null != t.loaderWindows)
                          ) {
                            var s = setInterval(function () {
                              return i(t, void 0, void 0, function () {
                                return o(this, function (e) {
                                  return (
                                    this.postMessageWindow({
                                      method: "gryfyn_api_handshake",
                                      params: { isWindow: !0 },
                                    }),
                                    [2]
                                  );
                                });
                              });
                            }, 500);
                            setTimeout(function () {
                              s && clearInterval(s);
                            }, 1e4);
                            var a = function (e) {
                              return i(t, void 0, void 0, function () {
                                var t, r, i, c, u;
                                return o(this, function (o) {
                                  switch (o.label) {
                                    case 0:
                                      return e.origin !== this.API_ORIGIN
                                        ? [2]
                                        : (t =
                                            null ===
                                              (u = e.data.split(
                                                this.messageHeader,
                                              )) || void 0 === u
                                              ? void 0
                                              : u[1])
                                        ? ("loaded" ===
                                            (r = JSON.parse(t)).method &&
                                            !0 === r.response) ||
                                          ("gryfyn_open_wallet" === r.method &&
                                            "gryfyn_open_wallet_success" ===
                                              r.response)
                                          ? (clearInterval(s),
                                            (this.isFrameReady = !0),
                                            (this.walletLoading = !1),
                                            this.setHostname(),
                                            window.removeEventListener(
                                              "message",
                                              a,
                                            ),
                                            [
                                              4,
                                              this.requestAPI(
                                                "gryfyn_is_login",
                                                {},
                                              ),
                                            ])
                                          : [3, 3]
                                        : [2];
                                    case 1:
                                      return (
                                        null != (i = o.sent()) &&
                                          (c = i.isLogin) &&
                                          (this.isLogin = c),
                                        this.loaderWindows
                                          ? [4, (0, p.sleep)(50)]
                                          : [3, 3]
                                      );
                                    case 2:
                                      o.sent(),
                                        n(this.loaderWindows),
                                        (o.label = 3);
                                    case 3:
                                      return [2];
                                  }
                                });
                              });
                            };
                            window.addEventListener("message", a);
                          }
                        }),
                      ];
                });
              });
            }),
            (t.prototype.initIframe = function (e) {
              return i(this, void 0, void 0, function () {
                var t = this;
                return o(this, function (n) {
                  return this.walletLoading
                    ? [2, null]
                    : [
                        2,
                        new Promise(function (n, r) {
                          var s = document.createElement("iframe");
                          (t.isFrameReady = !1), (t.walletLoading = !0);
                          var a = setInterval(function () {
                            return i(t, void 0, void 0, function () {
                              return o(this, function (e) {
                                return (
                                  this.postMessageFrame(s, {
                                    method: "gryfyn_api_handshake",
                                    params: {},
                                  }),
                                  [2]
                                );
                              });
                            });
                          }, 500);
                          setTimeout(function () {
                            a && clearInterval(a);
                          }, 1e4),
                            (s.id = "gryfynIFrame"),
                            s.setAttribute("src", e),
                            s.setAttribute("frameborder", "0"),
                            s.setAttribute(
                              "allow",
                              "camera *; microphone *; geolocation *; clipboard-write *",
                            ),
                            (s.style.width = "0%"),
                            (s.style.height = "0%"),
                            (s.style.userSelect = "none"),
                            (s.style.zIndex = "16777271"),
                            (s.style.position = "fixed"),
                            (s.style.top = "0px"),
                            (s.style.left = "0px"),
                            (s.style.paddingLeft = "0px"),
                            (s.style.paddingTop = "0px"),
                            (s.style.display = "hidden"),
                            (s.onload = function () {
                              return i(t, void 0, void 0, function () {
                                var e,
                                  t = this;
                                return o(this, function (r) {
                                  return (
                                    (e = function (r) {
                                      var i;
                                      if (r.origin === t.API_ORIGIN) {
                                        var o =
                                          null ===
                                            (i = r.data.split(
                                              t.messageHeader,
                                            )) || void 0 === i
                                            ? void 0
                                            : i[1];
                                        if (o) {
                                          var c = JSON.parse(o);
                                          clearInterval(a),
                                            "loaded" === c.method &&
                                              !0 === c.response &&
                                              ((t.isFrameReady = !0),
                                              (t.walletLoading = !1),
                                              t.setHostname(),
                                              (t.loaderIFrame = s),
                                              window.removeEventListener(
                                                "message",
                                                e,
                                              ),
                                              n(s));
                                        }
                                      }
                                    }),
                                    window.addEventListener("message", e),
                                    this.postMessageFrame(s, {
                                      method: "gryfyn_api_handshake",
                                      params: {},
                                    }),
                                    [2]
                                  );
                                });
                              });
                            }),
                            document.body.appendChild(s);
                        }),
                      ];
                });
              });
            }),
            (t.prototype.postMessageFrame = function (e, t) {
              e.contentWindow &&
                e.contentWindow.postMessage(
                  this.messageHeader + JSON.stringify(t),
                  this.API_ORIGIN,
                );
            }),
            (t.prototype.postMessageWindow = function (e) {
              this.loaderWindows &&
                this.loaderWindows.postMessage(
                  this.messageHeader + JSON.stringify(e),
                  this.API_ORIGIN,
                );
            }),
            (t.prototype.connect = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return this.shouldUsePopupWindow()
                        ? null != this.loaderWindows
                          ? [3, 2]
                          : [4, this.openSubWindow(this.src)]
                        : [3, 3];
                    case 1:
                      t.sent(), (t.label = 2);
                    case 2:
                      return [3, 5];
                    case 3:
                      return this.getGryfynLoader().iframe
                        ? [3, 5]
                        : [4, this.initIframe(this.src)];
                    case 4:
                      t.sent(),
                        (this.src = this.defaultiFrameSrc),
                        (t.label = 5);
                    case 5:
                      return [4, this.requestAPI("gryfyn_is_login", {})];
                    case 6:
                      return (
                        (e = t.sent().isLogin),
                        (this.isLogin = e),
                        e ? [3, 9] : [4, this.openWallet()]
                      );
                    case 7:
                      return (
                        t.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 8:
                      throw (
                        (t.sent(),
                        this.emit("disconnect"),
                        (0, y.getProviderErrors)(y.ErrorType.DISCONNECTED))
                      );
                    case 9:
                      return [2];
                  }
                });
              });
            }),
            (t.prototype.signMessageCustom = function (e, t) {
              return i(this, void 0, void 0, function () {
                var n, r, s, i, a;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return this.isLogin ? [4, this.openWallet()] : [3, 5];
                    case 1:
                      o.sent(),
                        (n = this.chainIdDec),
                        (r = this.selectedAccount),
                        (s = [n, r, e, t.title, t.button]),
                        (o.label = 2);
                    case 2:
                      return (
                        o.trys.push([2, 4, , 5]),
                        (this.preventCloseFrame = !0),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_message", s)]
                      );
                    case 3:
                      return (
                        (i = o.sent()), (this.preventCloseFrame = !1), [2, i]
                      );
                    case 4:
                      throw ((a = o.sent()), (this.preventCloseFrame = !1), a);
                    case 5:
                      return [2, g];
                  }
                });
              });
            }),
            (t.prototype.logout = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return this.isFrameReady ? [3, 2] : [4, this.connect()];
                    case 1:
                      t.sent(), (t.label = 2);
                    case 2:
                      return (
                        null != (e = this.getGryfynLoader().iframe)
                          ? this.postMessageFrame(e, {
                              method: "gryfyn_logout",
                              params: {},
                            })
                          : null != this.loaderWindows &&
                            this.postMessageWindow({
                              method: "gryfyn_logout",
                              params: {},
                            }),
                        [2]
                      );
                  }
                });
              });
            }),
            (t.prototype.setWalletMode = function (e) {
              this.walletMode = e;
            }),
            (t.prototype.checkIsLogin = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return (
                        t.trys.push([0, 2, , 3]),
                        [4, fetch("".concat(m, "/api/login/status"))]
                      );
                    case 1:
                      return (
                        (e = t.sent()),
                        console.log("checkIsLogin", e),
                        (this.isLogin = !0),
                        [2, !0]
                      );
                    case 2:
                      return t.sent(), [2, !1];
                    case 3:
                      return [2];
                  }
                });
              });
            }),
            t
          );
        })(h.default);
        t.GryFynProviderPopup = v;
      },
      412: function (e, t, n) {
        "use strict";
        var r,
          s =
            (this && this.__extends) ||
            ((r = function (e, t) {
              return (
                (r =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t)
                      Object.prototype.hasOwnProperty.call(t, n) &&
                        (e[n] = t[n]);
                  }),
                r(e, t)
              );
            }),
            function (e, t) {
              if ("function" != typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null",
                );
              function n() {
                this.constructor = e;
              }
              r(e, t),
                (e.prototype =
                  null === t
                    ? Object.create(t)
                    : ((n.prototype = t.prototype), new n()));
            }),
          i =
            (this && this.__awaiter) ||
            function (e, t, n, r) {
              return new (n || (n = Promise))(function (s, i) {
                function o(e) {
                  try {
                    c(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(e) {
                  try {
                    c(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(o, a);
                }
                c((r = r.apply(e, t || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                r,
                s,
                i,
                o = {
                  label: 0,
                  sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(i) {
                return function (a) {
                  return (function (i) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; o; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (s =
                              2 & i[0]
                                ? r.return
                                : i[0]
                                ? r.throw || ((s = r.return) && s.call(r), 0)
                                : r.next) &&
                            !(s = s.call(r, i[1])).done)
                        )
                          return s;
                        switch (
                          ((r = 0), s && (i = [2 & i[0], s.value]), i[0])
                        ) {
                          case 0:
                          case 1:
                            s = i;
                            break;
                          case 4:
                            return o.label++, { value: i[1], done: !1 };
                          case 5:
                            o.label++, (r = i[1]), (i = [0]);
                            continue;
                          case 7:
                            (i = o.ops.pop()), o.trys.pop();
                            continue;
                          default:
                            if (
                              !((s = o.trys),
                              (s = s.length > 0 && s[s.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0]))
                            ) {
                              o = 0;
                              continue;
                            }
                            if (
                              3 === i[0] &&
                              (!s || (i[1] > s[0] && i[1] < s[3]))
                            ) {
                              o.label = i[1];
                              break;
                            }
                            if (6 === i[0] && o.label < s[1]) {
                              (o.label = s[1]), (s = i);
                              break;
                            }
                            if (s && o.label < s[2]) {
                              (o.label = s[2]), o.ops.push(i);
                              break;
                            }
                            s[2] && o.ops.pop(), o.trys.pop();
                            continue;
                        }
                        i = t.call(e, o);
                      } catch (e) {
                        (i = [6, e]), (r = 0);
                      } finally {
                        n = s = 0;
                      }
                    if (5 & i[0]) throw i[1];
                    return { value: i[0] ? i[1] : void 0, done: !0 };
                  })([i, a]);
                };
              }
            },
          a =
            (this && this.__asyncValues) ||
            function (e) {
              if (!Symbol.asyncIterator)
                throw new TypeError("Symbol.asyncIterator is not defined.");
              var t,
                n = e[Symbol.asyncIterator];
              return n
                ? n.call(e)
                : ((e =
                    "function" == typeof __values
                      ? __values(e)
                      : e[Symbol.iterator]()),
                  (t = {}),
                  r("next"),
                  r("throw"),
                  r("return"),
                  (t[Symbol.asyncIterator] = function () {
                    return this;
                  }),
                  t);
              function r(n) {
                t[n] =
                  e[n] &&
                  function (t) {
                    return new Promise(function (r, s) {
                      (function (e, t, n, r) {
                        Promise.resolve(r).then(function (t) {
                          e({ value: t, done: n });
                        }, t);
                      })(r, s, (t = e[n](t)).done, t.value);
                    });
                  };
              }
            },
          c =
            (this && this.__spreadArray) ||
            function (e, t, n) {
              if (n || 2 === arguments.length)
                for (var r, s = 0, i = t.length; s < i; s++)
                  (!r && s in t) ||
                    (r || (r = Array.prototype.slice.call(t, 0, s)),
                    (r[s] = t[s]));
              return e.concat(r || Array.prototype.slice.call(t));
            },
          u =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.GryFynProviderWeb = void 0);
        var l,
          h = u(n(187)),
          d = u(n(721)),
          f = n(882),
          p = n(279),
          y = { code: 4100, data: "", message: "Not login" };
        !(function (e) {
          (e.CONNECTED = "gryfyn_connected"),
            (e.DISCONNECTED = "gryfyn_disconnected"),
            (e.CHAIN_CHANGED = "gryfyn_chainChanged"),
            (e.OPEN_WALLET = "gryfyn_open_wallet"),
            (e.CLOSE_WALLET = "gryfyn_close_wallet"),
            (e.CLOSE_WALLET_FROM_LOADER = "gryfyn_close_wallet_from_loader");
        })(l || (l = {}));
        var m = (function (e) {
          function t(t) {
            void 0 === t && (t = "default");
            var n = e.call(this) || this;
            return (
              (n.isFrameReady = !1),
              (n.apiKey = ""),
              (n.messageHeader = "{gryfyn_message}"),
              (n.responseMap = new Map()),
              (n.responseIdx = 0),
              (n.src = ""),
              (n.preventCloseFrame = !1),
              (n.chainIdHex = ""),
              (n.isLogin = !1),
              (n.chainIdDec = ""),
              (n.selectedAccount = ""),
              (n.isMetaMask = !1),
              (n.isGryfyn = !0),
              (n.isOpen = !1),
              (n.currentSignEventId = -1),
              (n.loaderIFrame = null),
              (n.apiKey = t),
              (n.API_ORIGIN = "https://loader.uat-testnet.metazens.xyz"),
              (n.src = "".concat(n.API_ORIGIN, "/iframe/").concat(t)),
              n.on("disconnect", function () {
                (n.isLogin = !1),
                  (n.chainIdDec = ""),
                  (n.chainIdHex = ""),
                  (n.selectedAccount = ""),
                  Array.from(n.responseMap.values()).forEach(function (e) {
                    e({ error: "disconnected" });
                  }),
                  (n.responseMap = new Map()),
                  console.log("--- on disconnect triggered:", n);
              }),
              window.addEventListener("message", function (e) {
                var t;
                if (e.origin === n.API_ORIGIN)
                  try {
                    if (
                      e &&
                      e.data &&
                      e.data.toString().startsWith(n.messageHeader)
                    ) {
                      var r = JSON.parse(e.data.replace(n.messageHeader, ""));
                      if (null == r ? void 0 : r.error)
                        return (
                          n.responseMap.get(r.id)({ error: r.error }),
                          void (n.preventCloseFrame = !1)
                        );
                      switch (r.method) {
                        case "closeIFrame":
                          n.closeIFrame();
                          break;
                        case l.CHAIN_CHANGED:
                          var s = r.response.chainId;
                          (a = (0, f.dec2hex)(s)) !== n.chainIdHex &&
                            ((n.chainIdHex = a),
                            (n.chainIdDec = Number(s).toString(10)),
                            n.emit("chainChanged", {
                              chainId: n.chainIdHex,
                            }));
                          break;
                        case l.CLOSE_WALLET:
                          n.preventCloseFrame
                            ? ((n.preventCloseFrame = !1),
                              n.closeIFrame(),
                              n.currentSignEventId > 0 &&
                                (n.responseMap.get(n.currentSignEventId)({
                                  error: (0, p.getProviderErrors)(
                                    p.ErrorType.USER_REJECTED,
                                  ),
                                }),
                                (n.currentSignEventId = -1)))
                            : n.closeIFrame(),
                            n.emit("close_wallet", {});
                          break;
                        case l.CLOSE_WALLET_FROM_LOADER:
                          n.closeIFrame(), n.emit("close_wallet", {});
                          break;
                        case l.CONNECTED:
                          (n.isLogin = !0), (n.isOpen = !0);
                          var i = r.response,
                            o = ((s = i.chainId), i.addresses),
                            a = (0, f.dec2hex)(s);
                          (n.chainIdHex = a),
                            (n.chainIdDec = Number(s).toString(10)),
                            (n.selectedAccount =
                              null !== (t = null == o ? void 0 : o[0]) &&
                              void 0 !== t
                                ? t
                                : ""),
                            n.emit("connect", { chainId: n.chainIdHex }),
                            n.emit("chainChanged", { chainId: n.chainIdHex }),
                            n.emit("accountsChanged", o);
                          break;
                        case l.DISCONNECTED:
                          n.isLogin = !1;
                          s = r.response.chainId;
                          n.emit("disconnect", {}),
                            n.emit("close_wallet"),
                            n.removeIFrame();
                          break;
                        default:
                          if ("function" != typeof n.responseMap.get(r.id))
                            return;
                          n.responseMap.get(r.id)(r.response),
                            n.responseMap.delete(r.id);
                      }
                    }
                  } catch (e) {
                    console.log("ERROR", null == e ? void 0 : e.data);
                  }
              }),
              n
            );
          }
          return (
            s(t, e),
            (t.prototype.chainId = function () {
              return this.chainIdHex;
            }),
            (t.prototype.getSupportedChainID = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_get_supported_chain_id", {}),
                      ];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainID = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.request = function (e) {
              var t, n;
              return i(this, void 0, void 0, function () {
                var r,
                  s,
                  i,
                  u,
                  l,
                  h,
                  m,
                  g,
                  v,
                  w,
                  _,
                  I,
                  b,
                  E,
                  P,
                  A,
                  O,
                  x,
                  C,
                  S,
                  F,
                  R,
                  L,
                  N,
                  T = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      if (null == e.method) return [2, null];
                      switch (e.method) {
                        case "gryfyn_requestKYC":
                          return [3, 1];
                        case "eth_accounts":
                        case "eth_requestAccounts":
                          return [3, 8];
                        case "eth_getBalance":
                          return [3, 14];
                        case "gryfyn_send_transaction":
                        case "eth_sendTransaction":
                          return [3, 19];
                        case "eth_chainId":
                          return [3, 38];
                        case "eth_signTypedData":
                        case "gryfyn_sign_typed_data":
                          return [3, 40];
                        case "personal_sign":
                        case "gryfyn_sign_message":
                        case "eth_sign":
                          return [3, 47];
                        case "personal_ecRecover":
                          return [3, 53];
                      }
                      return [3, 56];
                    case 1:
                      return this.isLogin ? [3, 4] : [4, this.openWindow()];
                    case 2:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 3:
                      return o.sent(), [2, y];
                    case 4:
                      return [4, this.openWindow()];
                    case 5:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 6:
                      return (
                        o.sent(),
                        [
                          4,
                          this.requestAPI("gryfyn_open_screen", {
                            deeplink: "/page/account-level",
                          }),
                        ]
                      );
                    case 7:
                      o.sent(), (o.label = 8);
                    case 8:
                      return (
                        o.trys.push([8, 13, , 14]),
                        this.isLogin ? [3, 11] : [4, this.openWindow()]
                      );
                    case 9:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 10:
                      return o.sent(), [2, y];
                    case 11:
                      return [4, this.requestAPI("gryfyn_account", {})];
                    case 12:
                      return (N = o.sent()).length > 0
                        ? ((r = N[0]),
                          (S = r.address),
                          (s = r.chain_id),
                          (this.selectedAccount = S),
                          (this.chainIdDec = s),
                          (this.chainIdHex = "0x".concat(
                            Number(this.chainIdDec).toString(16),
                          )),
                          this.emit("connect", { chainId: this.chainIdHex }),
                          this.emit(
                            "accountsChanged",
                            N.map(function (e) {
                              var t = e.address;
                              return null != t ? t : "";
                            }),
                          ),
                          [2, [S]])
                        : [3, 14];
                    case 13:
                      throw (
                        ((i = o.sent()),
                        this.emit("disconnect"),
                        this.emit("close_wallet"),
                        (0, p.getProviderErrors)(
                          p.ErrorType.DISCONNECTED,
                          null == i ? void 0 : i.message,
                        ))
                      );
                    case 14:
                      return this.isLogin ? [3, 17] : [4, this.openWindow()];
                    case 15:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 16:
                      return o.sent(), [2, y];
                    case 17:
                      return [4, this.requestAPI("gryfyn_balance", {})];
                    case 18:
                      return (
                        (N = o.sent()),
                        (u =
                          N.find(function (e) {
                            var t = e.chainId,
                              n = e.assetId;
                            return t === T.chainIdDec && -1 === n.indexOf("0x");
                          }) || {}),
                        (l = (null == u ? void 0 : u.balance) || "0"),
                        [2, "0x".concat(Number(l).toString(16))]
                      );
                    case 19:
                      return this.isLogin ? [4, this.openWindow()] : [3, 37];
                    case 20:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 21:
                      o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (h = []),
                        (o.label = 22);
                    case 22:
                      o.trys.push([22, 27, 28, 33]),
                        (m = a(e.params)),
                        (o.label = 23);
                    case 23:
                      return [4, m.next()];
                    case 24:
                      if ((g = o.sent()).done) return [3, 26];
                      ((v = g.value).chainId = v.chainId || C),
                        (v.from = S),
                        (v.type = 2),
                        void 0 === v.maxFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxFeePerGas = v.gasPrice),
                        void 0 === v.maxPriorityFeePerGas &&
                          void 0 !== v.gasPrice &&
                          (v.maxPriorityFeePerGas = v.gasPrice),
                        h.push(v),
                        (o.label = 25);
                    case 25:
                      return [3, 23];
                    case 26:
                      return [3, 33];
                    case 27:
                      return (w = o.sent()), (t = { error: w }), [3, 33];
                    case 28:
                      return (
                        o.trys.push([28, , 31, 32]),
                        g && !g.done && (n = m.return)
                          ? [4, n.call(m)]
                          : [3, 30]
                      );
                    case 29:
                      o.sent(), (o.label = 30);
                    case 30:
                      return [3, 32];
                    case 31:
                      if (t) throw t.error;
                      return [7];
                    case 32:
                      return [7];
                    case 33:
                      (this.preventCloseFrame = !0), (o.label = 34);
                    case 34:
                      return (
                        o.trys.push([34, 36, , 37]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [
                          4,
                          this.requestAPI(
                            "gryfyn_send_transaction",
                            c([C, S], h, !0),
                          ),
                        ]
                      );
                    case 35:
                      return (
                        (N = o.sent()), (this.preventCloseFrame = !1), [2, N]
                      );
                    case 36:
                      throw ((_ = o.sent()), (this.preventCloseFrame = !1), _);
                    case 37:
                      return [2, y];
                    case 38:
                      return [4, this.requestAPI("gryfyn_chain_id", {})];
                    case 39:
                      return (
                        (C = o.sent().chainId),
                        (0, f.dec2hex)(C) !== this.chainIdHex &&
                          ((this.chainIdHex = (0, f.dec2hex)(C)),
                          (this.chainIdDec = Number(C).toString(10)),
                          this.emit("chainChanged", {
                            chainId: this.chainIdHex,
                          })),
                        [2, this.chainIdHex]
                      );
                    case 40:
                      return this.isLogin ? [4, this.openWallet()] : [3, 46];
                    case 41:
                      return (
                        o.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 42:
                      if (
                        (o.sent(),
                        (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        !(I = e.params) ||
                          "0x" === I ||
                          I.length < 1 ||
                          !I[0] ||
                          "0x" === I[0])
                      )
                        return [2, p.ErrorType.PARAM_ERROR];
                      (F = c([C, S], I, !0)),
                        (this.preventCloseFrame = !0),
                        (o.label = 43);
                    case 43:
                      return (
                        o.trys.push([43, 45, , 46]),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_typed_data", F)]
                      );
                    case 44:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 45:
                      throw ((b = o.sent()), (this.preventCloseFrame = !1), b);
                    case 46:
                      return [2, y];
                    case 47:
                      return this.isLogin ? [4, this.openWallet()] : [3, 52];
                    case 48:
                      if (
                        (o.sent(),
                        (E = e.params),
                        (P = E[0]),
                        (A = E[1]),
                        E[2],
                        null == P || "" === P || "0x" === P)
                      )
                        return [2, p.ErrorType.PARAM_ERROR];
                      (C = this.chainIdDec),
                        (S = this.selectedAccount),
                        (O = decodeURIComponent(
                          "%".concat(
                            P.slice(2)
                              .match(/.{1,2}/g)
                              .join("%"),
                          ),
                        )),
                        (F = [C, null != S ? S : A, O]),
                        (o.label = 49);
                    case 49:
                      return (
                        o.trys.push([49, 51, , 52]),
                        (this.preventCloseFrame = !0),
                        (this.currentSignEventId = this.responseIdx + 1),
                        [4, this.requestAPI("gryfyn_sign_message", F)]
                      );
                    case 50:
                      return (
                        (R = o.sent()), (this.preventCloseFrame = !1), [2, R]
                      );
                    case 51:
                      throw ((x = o.sent()), (this.preventCloseFrame = !1), x);
                    case 52:
                      return [2, y];
                    case 53:
                      return this.isLogin
                        ? ((C = this.chainIdDec),
                          (S = this.selectedAccount),
                          (F = c(
                            [C, null != S ? S : this.selectedAccount],
                            e.params,
                            !0,
                          )),
                          [4, this.requestAPI("gryfyn_ecrecovery", F)])
                        : [3, 55];
                    case 54:
                      return [2, (R = o.sent())];
                    case 55:
                      return [2, y];
                    case 56:
                      return (
                        (L = ""
                          .concat(this.API_ORIGIN, "?chainId=")
                          .concat(this.chainIdDec)),
                        null == e.id && (e.id = 1),
                        [4, d.default.post(L, e, {})]
                      );
                    case 57:
                      if ((N = o.sent()).data && N.data.result)
                        return [2, N.data.result];
                      if (N.data && N.data.error) throw N.data.error;
                      return [2, N.data];
                  }
                });
              });
            }),
            (t.prototype.listen = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  return console.log(e), [2];
                });
              });
            }),
            (t.prototype.dequeue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enable = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.enqueue = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.send = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  return [2];
                });
              });
            }),
            (t.prototype.sendAsync = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, (0, f.sleep)(1e3)];
                    case 1:
                      return (
                        e.sent(),
                        [
                          2,
                          new Promise(function (e) {
                            setTimeout(function () {
                              e(1);
                            }, 5e3);
                          }),
                        ]
                      );
                  }
                });
              });
            }),
            (t.prototype.getGryfynIframe = function () {
              var e = document.getElementById("gryfynIFrame");
              return null != e ? e : null;
            }),
            (t.prototype.openWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.isFrameReady
                        ? [4, this.openIFrame(this.src)]
                        : [3, 2];
                    case 1:
                      return e.sent(), [2];
                    case 2:
                      throw (0,
                      p.getProviderErrors)(p.ErrorType.DISCONNECTED, "Connect wallet first!");
                  }
                });
              });
            }),
            (t.prototype.closeWallet = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return this.isFrameReady
                        ? [4, this.closeIFrame()]
                        : [3, 2];
                    case 1:
                      return e.sent(), [2];
                    case 2:
                      throw (0,
                      p.getProviderErrors)(p.ErrorType.DISCONNECTED, "Connect wallet first!");
                  }
                });
              });
            }),
            (t.prototype.openWindow = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.openIFrame(this.src)];
                    case 1:
                      return e.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.getUserLevel = function () {
              return i(this, void 0, void 0, function () {
                return o(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.requestAPI("gryfyn_get_user_level", {})];
                    case 1:
                      return [2, e.sent()];
                  }
                });
              });
            }),
            (t.prototype.setChainId = function (e) {
              return i(this, void 0, void 0, function () {
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [
                        4,
                        this.requestAPI("gryfyn_set_chain_id", {
                          chainId: e,
                        }),
                      ];
                    case 1:
                      return [2, t.sent()];
                  }
                });
              });
            }),
            (t.prototype.requestAPI = function (e, t) {
              return i(this, void 0, void 0, function () {
                var n,
                  r,
                  s,
                  i,
                  a = this;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return (
                        (this.responseIdx += 1),
                        (n = this.responseIdx),
                        (r = this.getGryfynIframe()),
                        this.isFrameReady
                          ? [3, 2]
                          : [4, this.openIFrame(this.src)]
                      );
                    case 1:
                      (r = o.sent()), (o.label = 2);
                    case 2:
                      return null != r && null != r.contentWindow
                        ? ((s = { method: e, params: t, id: n }),
                          this.postMessage(r, s),
                          (i = function (e, t) {
                            return function (n) {
                              var r = n.error;
                              r ? t(r) : e(n);
                            };
                          }),
                          [
                            2,
                            new Promise(function (e, t) {
                              a.responseMap.set(n, i(e, t));
                            }),
                          ])
                        : [2, null];
                  }
                });
              });
            }),
            (t.prototype.setHostname = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return (
                        (e = window.location.hostname),
                        [
                          4,
                          this.requestAPI("gryfyn_set_hostname", {
                            hostname: e,
                          }),
                        ]
                      );
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (t.prototype.closeIFrame = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    this.preventCloseFrame ||
                      ((this.preventCloseFrame = !1),
                      null != (e = this.getGryfynIframe()) &&
                        ((e.style.display = "none"),
                        (e.style.width = "0px"),
                        (e.style.height = "0px"),
                        (e.style.zIndex = "-1"))),
                    [2]
                  );
                });
              });
            }),
            (t.prototype.removeIFrame = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  return (
                    this.preventCloseFrame ||
                      ((this.preventCloseFrame = !1),
                      (e = this.getGryfynIframe()) && e.remove()),
                    [2]
                  );
                });
              });
            }),
            (t.prototype.openIFrame = function (e) {
              var t;
              return i(this, void 0, void 0, function () {
                var n, r, s, i, a;
                return o(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return null != (n = this.getGryfynIframe())
                        ? [3, 2]
                        : [4, this.initIframe(e)];
                    case 1:
                      (n = o.sent()), (o.label = 2);
                    case 2:
                      return (
                        (r =
                          null ===
                            (t =
                              null === navigator || void 0 === navigator
                                ? void 0
                                : navigator.userAgent) || void 0 === t
                            ? void 0
                            : t.match(/iPhone|iPad|iPod/i)),
                        (s = null != r && r.length > 0),
                        (i =
                          "standalone" in navigator &&
                          !0 === navigator.standalone),
                        (a =
                          /^((?!chrome|android).)*safari/i.test(
                            navigator.userAgent,
                          ) &&
                          -1 !==
                            navigator.userAgent
                              .toLowerCase()
                              .indexOf("safari")),
                        this.setHostname(),
                        this.requestAPI("gryfyn_open_wallet", {}),
                        !0 === a &&
                          !0 === s &&
                          !0 === i &&
                          (n.style.borderBottom =
                            "28px solid rgba(9, 14, 16, 0.74)"),
                        (n.style.display = "block"),
                        (n.style.width = "100%"),
                        (n.style.height = "100%"),
                        (n.style.zIndex = "16777271"),
                        (this.isOpen = !0),
                        [2, n]
                      );
                  }
                });
              });
            }),
            (t.prototype.initIframe = function (e) {
              return i(this, void 0, void 0, function () {
                var t = this;
                return o(this, function (n) {
                  return [
                    2,
                    new Promise(function (n) {
                      var r = document.createElement("iframe");
                      (t.isFrameReady = !1),
                        (r.id = "gryfynIFrame"),
                        r.setAttribute("src", e),
                        r.setAttribute("frameborder", "0"),
                        r.setAttribute(
                          "allow",
                          "camera *; microphone *; geolocation *; clipboard-write *",
                        ),
                        (r.style.width = "0%"),
                        (r.style.height = "0%"),
                        (r.style.userSelect = "none"),
                        (r.style.zIndex = "16777271"),
                        (r.style.position = "fixed"),
                        (r.style.top = "0px"),
                        (r.style.left = "0px"),
                        (r.style.paddingLeft = "0px"),
                        (r.style.paddingTop = "0px"),
                        (r.style.display = "hidden"),
                        (r.onload = function () {
                          return i(t, void 0, void 0, function () {
                            var e,
                              t = this;
                            return o(this, function (s) {
                              return (
                                (e = function (s) {
                                  var i;
                                  if (s.origin === t.API_ORIGIN) {
                                    var o =
                                      null ===
                                        (i = s.data.split(t.messageHeader)) ||
                                      void 0 === i
                                        ? void 0
                                        : i[1];
                                    if (o) {
                                      var a = JSON.parse(o);
                                      "loaded" === a.method &&
                                        !0 === a.response &&
                                        ((t.isFrameReady = !0),
                                        t.setHostname(),
                                        (t.loaderIFrame = r),
                                        window.removeEventListener(
                                          "message",
                                          e,
                                        ),
                                        n(r));
                                    }
                                  }
                                }),
                                window.addEventListener("message", e),
                                this.postMessage(r, {
                                  method: "gryfyn_open_wallet_request",
                                  params: {},
                                }),
                                [2]
                              );
                            });
                          });
                        }),
                        document.body.appendChild(r);
                    }),
                  ];
                });
              });
            }),
            (t.prototype.postMessage = function (e, t) {
              e.contentWindow &&
                e.contentWindow.postMessage(
                  this.messageHeader + JSON.stringify(t),
                  this.API_ORIGIN,
                );
            }),
            (t.prototype.connect = function () {
              return i(this, void 0, void 0, function () {
                var e;
                return o(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return this.getGryfynIframe()
                        ? [3, 5]
                        : [4, this.initIframe(this.src)];
                    case 1:
                      return (
                        t.sent(), [4, this.requestAPI("gryfyn_is_login", {})]
                      );
                    case 2:
                      return (
                        (e = t.sent().isLogin),
                        (this.isLogin = e),
                        e ? [3, 5] : [4, this.openWallet()]
                      );
                    case 3:
                      return (
                        t.sent(), [4, this.requestAPI("gryfyn_open_wallet", {})]
                      );
                    case 4:
                      throw (
                        (t.sent(),
                        this.emit("disconnect"),
                        (0, p.getProviderErrors)(p.ErrorType.DISCONNECTED))
                      );
                    case 5:
                      return [2];
                  }
                });
              });
            }),
            t
          );
        })(h.default);
        t.GryFynProviderWeb = m;
      },
      279: function (e, t) {
        "use strict";
        var n =
          (this && this.__assign) ||
          function () {
            return (
              (n =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var s in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, s) &&
                        (e[s] = t[s]);
                  return e;
                }),
              n.apply(this, arguments)
            );
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getProviderErrors = t.ErrorType = void 0),
          (t.ErrorType = {
            USER_REJECTED: { code: 4001, message: "User Rejected request" },
            UNAUTHORIZED: { code: 4100, message: "Unauthorized" },
            UNSUPPORTED: { code: 4200, message: "Unsupported method" },
            DISCONNECTED: { code: 4900, message: "Disconnected" },
            CHAIN_DISCONNECTED: { code: 4901, message: "Chain disconnected" },
            PARAM_ERROR: {
              code: -32602,
              message: "Invalid method parameter(s).",
            },
          });
        t.getProviderErrors = function (e, t) {
          return n(n({}, e), { data: t });
        };
      },
      277: (e, t, n) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.GryFyn = void 0);
        var r = n(913),
          s = n(412),
          i = n(41),
          o = (function () {
            function e() {}
            return (
              (e.getProvider = function (e, t) {
                return (
                  this.instance ||
                    (this.instancePopup = new i.GryFynProviderPopup(e, t)),
                  this.instancePopup
                );
              }),
              (e.getProviderOld = function (e) {
                return (
                  this.instance || (this.instance = new r.GryFynProvider(e)),
                  this.instance
                );
              }),
              (e.getProviderWeb = function (e) {
                return (
                  this.instanceB ||
                    (this.instanceB = new s.GryFynProviderWeb(e)),
                  this.instanceB
                );
              }),
              e
            );
          })();
        (t.GryFyn = o), (t.default = o);
      },
      882: function (e, t) {
        "use strict";
        var n =
            (this && this.__awaiter) ||
            function (e, t, n, r) {
              return new (n || (n = Promise))(function (s, i) {
                function o(e) {
                  try {
                    c(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(e) {
                  try {
                    c(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(o, a);
                }
                c((r = r.apply(e, t || [])).next());
              });
            },
          r =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                r,
                s,
                i,
                o = {
                  label: 0,
                  sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(i) {
                return function (a) {
                  return (function (i) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; o; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (s =
                              2 & i[0]
                                ? r.return
                                : i[0]
                                ? r.throw || ((s = r.return) && s.call(r), 0)
                                : r.next) &&
                            !(s = s.call(r, i[1])).done)
                        )
                          return s;
                        switch (
                          ((r = 0), s && (i = [2 & i[0], s.value]), i[0])
                        ) {
                          case 0:
                          case 1:
                            s = i;
                            break;
                          case 4:
                            return o.label++, { value: i[1], done: !1 };
                          case 5:
                            o.label++, (r = i[1]), (i = [0]);
                            continue;
                          case 7:
                            (i = o.ops.pop()), o.trys.pop();
                            continue;
                          default:
                            if (
                              !((s = o.trys),
                              (s = s.length > 0 && s[s.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0]))
                            ) {
                              o = 0;
                              continue;
                            }
                            if (
                              3 === i[0] &&
                              (!s || (i[1] > s[0] && i[1] < s[3]))
                            ) {
                              o.label = i[1];
                              break;
                            }
                            if (6 === i[0] && o.label < s[1]) {
                              (o.label = s[1]), (s = i);
                              break;
                            }
                            if (s && o.label < s[2]) {
                              (o.label = s[2]), o.ops.push(i);
                              break;
                            }
                            s[2] && o.ops.pop(), o.trys.pop();
                            continue;
                        }
                        i = t.call(e, o);
                      } catch (e) {
                        (i = [6, e]), (r = 0);
                      } finally {
                        n = s = 0;
                      }
                    if (5 & i[0]) throw i[1];
                    return { value: i[0] ? i[1] : void 0, done: !0 };
                  })([i, a]);
                };
              }
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.dec2hex = t.sleep = void 0),
          (t.sleep = function (e) {
            return n(this, void 0, void 0, function () {
              return r(this, function (t) {
                return [
                  2,
                  new Promise(function (t) {
                    setTimeout(function () {
                      return t(null);
                    }, e);
                  }),
                ];
              });
            });
          }),
          (t.dec2hex = function (e) {
            return "0x".concat(
              "string" == typeof e
                ? parseInt(e, 10).toString(16)
                : e.toString(16),
            );
          });
      },
      721: (e, t, n) => {
        "use strict";
        function r(e, t) {
          return function () {
            return e.apply(t, arguments);
          };
        }
        n.r(t), n.d(t, { default: () => je });
        const { toString: s } = Object.prototype,
          { getPrototypeOf: i } = Object,
          o =
            ((a = Object.create(null)),
            (e) => {
              const t = s.call(e);
              return a[t] || (a[t] = t.slice(8, -1).toLowerCase());
            });
        var a;
        const c = (e) => ((e = e.toLowerCase()), (t) => o(t) === e),
          u = (e) => (t) => typeof t === e,
          { isArray: l } = Array,
          h = u("undefined");
        const d = c("ArrayBuffer");
        const f = u("string"),
          p = u("function"),
          y = u("number"),
          m = (e) => null !== e && "object" == typeof e,
          g = (e) => {
            if ("object" !== o(e)) return !1;
            const t = i(e);
            return !(
              (null !== t &&
                t !== Object.prototype &&
                null !== Object.getPrototypeOf(t)) ||
              Symbol.toStringTag in e ||
              Symbol.iterator in e
            );
          },
          v = c("Date"),
          w = c("File"),
          _ = c("Blob"),
          I = c("FileList"),
          b = c("URLSearchParams");
        function E(e, t, { allOwnKeys: n = !1 } = {}) {
          if (null == e) return;
          let r, s;
          if (("object" != typeof e && (e = [e]), l(e)))
            for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
          else {
            const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
              i = s.length;
            let o;
            for (r = 0; r < i; r++) (o = s[r]), t.call(null, e[o], o, e);
          }
        }
        const P =
          ((A = "undefined" != typeof Uint8Array && i(Uint8Array)),
          (e) => A && e instanceof A);
        var A;
        const O = c("HTMLFormElement"),
          x = (
            ({ hasOwnProperty: e }) =>
            (t, n) =>
              e.call(t, n)
          )(Object.prototype),
          C = c("RegExp"),
          S = (e, t) => {
            const n = Object.getOwnPropertyDescriptors(e),
              r = {};
            E(n, (n, s) => {
              !1 !== t(n, s, e) && (r[s] = n);
            }),
              Object.defineProperties(e, r);
          },
          F = {
            isArray: l,
            isArrayBuffer: d,
            isBuffer: function (e) {
              return (
                null !== e &&
                !h(e) &&
                null !== e.constructor &&
                !h(e.constructor) &&
                p(e.constructor.isBuffer) &&
                e.constructor.isBuffer(e)
              );
            },
            isFormData: (e) => {
              const t = "[object FormData]";
              return (
                e &&
                (("function" == typeof FormData && e instanceof FormData) ||
                  s.call(e) === t ||
                  (p(e.toString) && e.toString() === t))
              );
            },
            isArrayBufferView: function (e) {
              let t;
              return (
                (t =
                  "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
                    ? ArrayBuffer.isView(e)
                    : e && e.buffer && d(e.buffer)),
                t
              );
            },
            isString: f,
            isNumber: y,
            isBoolean: (e) => !0 === e || !1 === e,
            isObject: m,
            isPlainObject: g,
            isUndefined: h,
            isDate: v,
            isFile: w,
            isBlob: _,
            isRegExp: C,
            isFunction: p,
            isStream: (e) => m(e) && p(e.pipe),
            isURLSearchParams: b,
            isTypedArray: P,
            isFileList: I,
            forEach: E,
            merge: function e() {
              const t = {},
                n = (n, r) => {
                  g(t[r]) && g(n)
                    ? (t[r] = e(t[r], n))
                    : g(n)
                    ? (t[r] = e({}, n))
                    : l(n)
                    ? (t[r] = n.slice())
                    : (t[r] = n);
                };
              for (let e = 0, t = arguments.length; e < t; e++)
                arguments[e] && E(arguments[e], n);
              return t;
            },
            extend: (e, t, n, { allOwnKeys: s } = {}) => (
              E(
                t,
                (t, s) => {
                  n && p(t) ? (e[s] = r(t, n)) : (e[s] = t);
                },
                { allOwnKeys: s },
              ),
              e
            ),
            trim: (e) =>
              e.trim
                ? e.trim()
                : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
            stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
            inherits: (e, t, n, r) => {
              (e.prototype = Object.create(t.prototype, r)),
                (e.prototype.constructor = e),
                Object.defineProperty(e, "super", { value: t.prototype }),
                n && Object.assign(e.prototype, n);
            },
            toFlatObject: (e, t, n, r) => {
              let s, o, a;
              const c = {};
              if (((t = t || {}), null == e)) return t;
              do {
                for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
                  (a = s[o]),
                    (r && !r(a, e, t)) || c[a] || ((t[a] = e[a]), (c[a] = !0));
                e = !1 !== n && i(e);
              } while (e && (!n || n(e, t)) && e !== Object.prototype);
              return t;
            },
            kindOf: o,
            kindOfTest: c,
            endsWith: (e, t, n) => {
              (e = String(e)),
                (void 0 === n || n > e.length) && (n = e.length),
                (n -= t.length);
              const r = e.indexOf(t, n);
              return -1 !== r && r === n;
            },
            toArray: (e) => {
              if (!e) return null;
              if (l(e)) return e;
              let t = e.length;
              if (!y(t)) return null;
              const n = new Array(t);
              for (; t-- > 0; ) n[t] = e[t];
              return n;
            },
            forEachEntry: (e, t) => {
              const n = (e && e[Symbol.iterator]).call(e);
              let r;
              for (; (r = n.next()) && !r.done; ) {
                const n = r.value;
                t.call(e, n[0], n[1]);
              }
            },
            matchAll: (e, t) => {
              let n;
              const r = [];
              for (; null !== (n = e.exec(t)); ) r.push(n);
              return r;
            },
            isHTMLForm: O,
            hasOwnProperty: x,
            hasOwnProp: x,
            reduceDescriptors: S,
            freezeMethods: (e) => {
              S(e, (t, n) => {
                const r = e[n];
                p(r) &&
                  ((t.enumerable = !1),
                  "writable" in t
                    ? (t.writable = !1)
                    : t.set ||
                      (t.set = () => {
                        throw Error("Can not read-only method '" + n + "'");
                      }));
              });
            },
            toObjectSet: (e, t) => {
              const n = {},
                r = (e) => {
                  e.forEach((e) => {
                    n[e] = !0;
                  });
                };
              return l(e) ? r(e) : r(String(e).split(t)), n;
            },
            toCamelCase: (e) =>
              e
                .toLowerCase()
                .replace(/[_-\s]([a-z\d])(\w*)/g, function (e, t, n) {
                  return t.toUpperCase() + n;
                }),
            noop: () => {},
            toFiniteNumber: (e, t) => ((e = +e), Number.isFinite(e) ? e : t),
          };
        function R(e, t, n, r, s) {
          Error.call(this),
            Error.captureStackTrace
              ? Error.captureStackTrace(this, this.constructor)
              : (this.stack = new Error().stack),
            (this.message = e),
            (this.name = "AxiosError"),
            t && (this.code = t),
            n && (this.config = n),
            r && (this.request = r),
            s && (this.response = s);
        }
        F.inherits(R, Error, {
          toJSON: function () {
            return {
              message: this.message,
              name: this.name,
              description: this.description,
              number: this.number,
              fileName: this.fileName,
              lineNumber: this.lineNumber,
              columnNumber: this.columnNumber,
              stack: this.stack,
              config: this.config,
              code: this.code,
              status:
                this.response && this.response.status
                  ? this.response.status
                  : null,
            };
          },
        });
        const L = R.prototype,
          N = {};
        [
          "ERR_BAD_OPTION_VALUE",
          "ERR_BAD_OPTION",
          "ECONNABORTED",
          "ETIMEDOUT",
          "ERR_NETWORK",
          "ERR_FR_TOO_MANY_REDIRECTS",
          "ERR_DEPRECATED",
          "ERR_BAD_RESPONSE",
          "ERR_BAD_REQUEST",
          "ERR_CANCELED",
          "ERR_NOT_SUPPORT",
          "ERR_INVALID_URL",
        ].forEach((e) => {
          N[e] = { value: e };
        }),
          Object.defineProperties(R, N),
          Object.defineProperty(L, "isAxiosError", { value: !0 }),
          (R.from = (e, t, n, r, s, i) => {
            const o = Object.create(L);
            return (
              F.toFlatObject(
                e,
                o,
                function (e) {
                  return e !== Error.prototype;
                },
                (e) => "isAxiosError" !== e,
              ),
              R.call(o, e.message, t, n, r, s),
              (o.cause = e),
              (o.name = e.name),
              i && Object.assign(o, i),
              o
            );
          });
        const T = R;
        const D = n(230);
        function M(e) {
          return F.isPlainObject(e) || F.isArray(e);
        }
        function j(e) {
          return F.endsWith(e, "[]") ? e.slice(0, -2) : e;
        }
        function q(e, t, n) {
          return e
            ? e
                .concat(t)
                .map(function (e, t) {
                  return (e = j(e)), !n && t ? "[" + e + "]" : e;
                })
                .join(n ? "." : "")
            : t;
        }
        const W = F.toFlatObject(F, {}, null, function (e) {
          return /^is[A-Z]/.test(e);
        });
        const H = function (e, t, n) {
          if (!F.isObject(e)) throw new TypeError("target must be an object");
          t = t || new (D || FormData)();
          const r = (n = F.toFlatObject(
              n,
              { metaTokens: !0, dots: !1, indexes: !1 },
              !1,
              function (e, t) {
                return !F.isUndefined(t[e]);
              },
            )).metaTokens,
            s = n.visitor || l,
            i = n.dots,
            o = n.indexes,
            a =
              (n.Blob || ("undefined" != typeof Blob && Blob)) &&
              (c = t) &&
              F.isFunction(c.append) &&
              "FormData" === c[Symbol.toStringTag] &&
              c[Symbol.iterator];
          var c;
          if (!F.isFunction(s))
            throw new TypeError("visitor must be a function");
          function u(e) {
            if (null === e) return "";
            if (F.isDate(e)) return e.toISOString();
            if (!a && F.isBlob(e))
              throw new T("Blob is not supported. Use a Buffer instead.");
            return F.isArrayBuffer(e) || F.isTypedArray(e)
              ? a && "function" == typeof Blob
                ? new Blob([e])
                : Buffer.from(e)
              : e;
          }
          function l(e, n, s) {
            let a = e;
            if (e && !s && "object" == typeof e)
              if (F.endsWith(n, "{}"))
                (n = r ? n : n.slice(0, -2)), (e = JSON.stringify(e));
              else if (
                (F.isArray(e) &&
                  (function (e) {
                    return F.isArray(e) && !e.some(M);
                  })(e)) ||
                F.isFileList(e) ||
                (F.endsWith(n, "[]") && (a = F.toArray(e)))
              )
                return (
                  (n = j(n)),
                  a.forEach(function (e, r) {
                    !F.isUndefined(e) &&
                      t.append(
                        !0 === o ? q([n], r, i) : null === o ? n : n + "[]",
                        u(e),
                      );
                  }),
                  !1
                );
            return !!M(e) || (t.append(q(s, n, i), u(e)), !1);
          }
          const h = [],
            d = Object.assign(W, {
              defaultVisitor: l,
              convertValue: u,
              isVisitable: M,
            });
          if (!F.isObject(e)) throw new TypeError("data must be an object");
          return (
            (function e(n, r) {
              if (!F.isUndefined(n)) {
                if (-1 !== h.indexOf(n))
                  throw Error("Circular reference detected in " + r.join("."));
                h.push(n),
                  F.forEach(n, function (n, i) {
                    !0 ===
                      (!F.isUndefined(n) &&
                        s.call(t, n, F.isString(i) ? i.trim() : i, r, d)) &&
                      e(n, r ? r.concat(i) : [i]);
                  }),
                  h.pop();
              }
            })(e),
            t
          );
        };
        function k(e) {
          const t = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\0",
          };
          return encodeURIComponent(e).replace(
            /[!'()~]|%20|%00/g,
            function (e) {
              return t[e];
            },
          );
        }
        function G(e, t) {
          (this._pairs = []), e && H(e, this, t);
        }
        const U = G.prototype;
        (U.append = function (e, t) {
          this._pairs.push([e, t]);
        }),
          (U.toString = function (e) {
            const t = e
              ? function (t) {
                  return e.call(this, t, k);
                }
              : k;
            return this._pairs
              .map(function (e) {
                return t(e[0]) + "=" + t(e[1]);
              }, "")
              .join("&");
          });
        const B = G;
        function z(e) {
          return encodeURIComponent(e)
            .replace(/%3A/gi, ":")
            .replace(/%24/g, "$")
            .replace(/%2C/gi, ",")
            .replace(/%20/g, "+")
            .replace(/%5B/gi, "[")
            .replace(/%5D/gi, "]");
        }
        function J(e, t, n) {
          if (!t) return e;
          const r = e.indexOf("#");
          -1 !== r && (e = e.slice(0, r));
          const s = (n && n.encode) || z,
            i = F.isURLSearchParams(t) ? t.toString() : new B(t, n).toString(s);
          return i && (e += (-1 === e.indexOf("?") ? "?" : "&") + i), e;
        }
        const K = class {
            constructor() {
              this.handlers = [];
            }
            use(e, t, n) {
              return (
                this.handlers.push({
                  fulfilled: e,
                  rejected: t,
                  synchronous: !!n && n.synchronous,
                  runWhen: n ? n.runWhen : null,
                }),
                this.handlers.length - 1
              );
            }
            eject(e) {
              this.handlers[e] && (this.handlers[e] = null);
            }
            clear() {
              this.handlers && (this.handlers = []);
            }
            forEach(e) {
              F.forEach(this.handlers, function (t) {
                null !== t && e(t);
              });
            }
          },
          V = {
            silentJSONParsing: !0,
            forcedJSONParsing: !0,
            clarifyTimeoutError: !1,
          },
          $ = "undefined" != typeof URLSearchParams ? URLSearchParams : B,
          X = FormData,
          Q = (() => {
            let e;
            return (
              ("undefined" == typeof navigator ||
                ("ReactNative" !== (e = navigator.product) &&
                  "NativeScript" !== e &&
                  "NS" !== e)) &&
              "undefined" != typeof window &&
              "undefined" != typeof document
            );
          })(),
          Y = {
            isBrowser: !0,
            classes: { URLSearchParams: $, FormData: X, Blob },
            isStandardBrowserEnv: Q,
            protocols: ["http", "https", "file", "blob", "url", "data"],
          };
        const Z = function (e) {
          function t(e, n, r, s) {
            let i = e[s++];
            const o = Number.isFinite(+i),
              a = s >= e.length;
            if (((i = !i && F.isArray(r) ? r.length : i), a))
              return F.hasOwnProp(r, i) ? (r[i] = [r[i], n]) : (r[i] = n), !o;
            (r[i] && F.isObject(r[i])) || (r[i] = []);
            return (
              t(e, n, r[i], s) &&
                F.isArray(r[i]) &&
                (r[i] = (function (e) {
                  const t = {},
                    n = Object.keys(e);
                  let r;
                  const s = n.length;
                  let i;
                  for (r = 0; r < s; r++) (i = n[r]), (t[i] = e[i]);
                  return t;
                })(r[i])),
              !o
            );
          }
          if (F.isFormData(e) && F.isFunction(e.entries)) {
            const n = {};
            return (
              F.forEachEntry(e, (e, r) => {
                t(
                  (function (e) {
                    return F.matchAll(/\w+|\[(\w*)]/g, e).map((e) =>
                      "[]" === e[0] ? "" : e[1] || e[0],
                    );
                  })(e),
                  r,
                  n,
                  0,
                );
              }),
              n
            );
          }
          return null;
        };
        const ee = Y.isStandardBrowserEnv
          ? {
              write: function (e, t, n, r, s, i) {
                const o = [];
                o.push(e + "=" + encodeURIComponent(t)),
                  F.isNumber(n) &&
                    o.push("expires=" + new Date(n).toGMTString()),
                  F.isString(r) && o.push("path=" + r),
                  F.isString(s) && o.push("domain=" + s),
                  !0 === i && o.push("secure"),
                  (document.cookie = o.join("; "));
              },
              read: function (e) {
                const t = document.cookie.match(
                  new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"),
                );
                return t ? decodeURIComponent(t[3]) : null;
              },
              remove: function (e) {
                this.write(e, "", Date.now() - 864e5);
              },
            }
          : {
              write: function () {},
              read: function () {
                return null;
              },
              remove: function () {},
            };
        function te(e, t) {
          return e && !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)
            ? (function (e, t) {
                return t
                  ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "")
                  : e;
              })(e, t)
            : t;
        }
        const ne = Y.isStandardBrowserEnv
          ? (function () {
              const e = /(msie|trident)/i.test(navigator.userAgent),
                t = document.createElement("a");
              let n;
              function r(n) {
                let r = n;
                return (
                  e && (t.setAttribute("href", r), (r = t.href)),
                  t.setAttribute("href", r),
                  {
                    href: t.href,
                    protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
                    host: t.host,
                    search: t.search ? t.search.replace(/^\?/, "") : "",
                    hash: t.hash ? t.hash.replace(/^#/, "") : "",
                    hostname: t.hostname,
                    port: t.port,
                    pathname:
                      "/" === t.pathname.charAt(0)
                        ? t.pathname
                        : "/" + t.pathname,
                  }
                );
              }
              return (
                (n = r(window.location.href)),
                function (e) {
                  const t = F.isString(e) ? r(e) : e;
                  return t.protocol === n.protocol && t.host === n.host;
                }
              );
            })()
          : function () {
              return !0;
            };
        function re(e, t, n) {
          T.call(this, null == e ? "canceled" : e, T.ERR_CANCELED, t, n),
            (this.name = "CanceledError");
        }
        F.inherits(re, T, { __CANCEL__: !0 });
        const se = re;
        const ie = F.toObjectSet([
            "age",
            "authorization",
            "content-length",
            "content-type",
            "etag",
            "expires",
            "from",
            "host",
            "if-modified-since",
            "if-unmodified-since",
            "last-modified",
            "location",
            "max-forwards",
            "proxy-authorization",
            "referer",
            "retry-after",
            "user-agent",
          ]),
          oe = Symbol("internals"),
          ae = Symbol("defaults");
        function ce(e) {
          return e && String(e).trim().toLowerCase();
        }
        function ue(e) {
          return !1 === e || null == e ? e : String(e);
        }
        function le(e, t, n, r) {
          return F.isFunction(r)
            ? r.call(this, t, n)
            : F.isString(t)
            ? F.isString(r)
              ? -1 !== t.indexOf(r)
              : F.isRegExp(r)
              ? r.test(t)
              : void 0
            : void 0;
        }
        function he(e, t) {
          t = t.toLowerCase();
          const n = Object.keys(e);
          let r,
            s = n.length;
          for (; s-- > 0; ) if (((r = n[s]), t === r.toLowerCase())) return r;
          return null;
        }
        function de(e, t) {
          e && this.set(e), (this[ae] = t || null);
        }
        Object.assign(de.prototype, {
          set: function (e, t, n) {
            const r = this;
            function s(e, t, n) {
              const s = ce(t);
              if (!s) throw new Error("header name must be a non-empty string");
              const i = he(r, s);
              (!i || !0 === n || (!1 !== r[i] && !1 !== n)) &&
                ((e = F.isArray(e) ? e.map(ue) : ue(e)), (r[i || t] = e));
            }
            return (
              F.isPlainObject(e)
                ? F.forEach(e, (e, n) => {
                    s(e, n, t);
                  })
                : s(t, e, n),
              this
            );
          },
          get: function (e, t) {
            if (!(e = ce(e))) return;
            const n = he(this, e);
            if (n) {
              const e = this[n];
              if (!t) return e;
              if (!0 === t)
                return (function (e) {
                  const t = Object.create(null),
                    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                  let r;
                  for (; (r = n.exec(e)); ) t[r[1]] = r[2];
                  return t;
                })(e);
              if (F.isFunction(t)) return t.call(this, e, n);
              if (F.isRegExp(t)) return t.exec(e);
              throw new TypeError("parser must be boolean|regexp|function");
            }
          },
          has: function (e, t) {
            if ((e = ce(e))) {
              const n = he(this, e);
              return !(!n || (t && !le(0, this[n], n, t)));
            }
            return !1;
          },
          delete: function (e, t) {
            const n = this;
            let r = !1;
            function s(e) {
              if ((e = ce(e))) {
                const s = he(n, e);
                !s || (t && !le(0, n[s], s, t)) || (delete n[s], (r = !0));
              }
            }
            return F.isArray(e) ? e.forEach(s) : s(e), r;
          },
          clear: function () {
            return Object.keys(this).forEach(this.delete.bind(this));
          },
          normalize: function (e) {
            const t = this,
              n = {};
            return (
              F.forEach(this, (r, s) => {
                const i = he(n, s);
                if (i) return (t[i] = ue(r)), void delete t[s];
                const o = e
                  ? (function (e) {
                      return e
                        .trim()
                        .toLowerCase()
                        .replace(
                          /([a-z\d])(\w*)/g,
                          (e, t, n) => t.toUpperCase() + n,
                        );
                    })(s)
                  : String(s).trim();
                o !== s && delete t[s], (t[o] = ue(r)), (n[o] = !0);
              }),
              this
            );
          },
          toJSON: function () {
            const e = Object.create(null);
            return (
              F.forEach(Object.assign({}, this[ae] || null, this), (t, n) => {
                null != t &&
                  !1 !== t &&
                  (e[n] = F.isArray(t) ? t.join(", ") : t);
              }),
              e
            );
          },
        }),
          Object.assign(de, {
            from: function (e) {
              return F.isString(e)
                ? new this(
                    ((e) => {
                      const t = {};
                      let n, r, s;
                      return (
                        e &&
                          e.split("\n").forEach(function (e) {
                            (s = e.indexOf(":")),
                              (n = e.substring(0, s).trim().toLowerCase()),
                              (r = e.substring(s + 1).trim()),
                              !n ||
                                (t[n] && ie[n]) ||
                                ("set-cookie" === n
                                  ? t[n]
                                    ? t[n].push(r)
                                    : (t[n] = [r])
                                  : (t[n] = t[n] ? t[n] + ", " + r : r));
                          }),
                        t
                      );
                    })(e),
                  )
                : e instanceof this
                ? e
                : new this(e);
            },
            accessor: function (e) {
              const t = (this[oe] = this[oe] = { accessors: {} }).accessors,
                n = this.prototype;
              function r(e) {
                const r = ce(e);
                t[r] ||
                  (!(function (e, t) {
                    const n = F.toCamelCase(" " + t);
                    ["get", "set", "has"].forEach((r) => {
                      Object.defineProperty(e, r + n, {
                        value: function (e, n, s) {
                          return this[r].call(this, t, e, n, s);
                        },
                        configurable: !0,
                      });
                    });
                  })(n, e),
                  (t[r] = !0));
              }
              return F.isArray(e) ? e.forEach(r) : r(e), this;
            },
          }),
          de.accessor([
            "Content-Type",
            "Content-Length",
            "Accept",
            "Accept-Encoding",
            "User-Agent",
          ]),
          F.freezeMethods(de.prototype),
          F.freezeMethods(de);
        const fe = de;
        const pe = function (e, t) {
          e = e || 10;
          const n = new Array(e),
            r = new Array(e);
          let s,
            i = 0,
            o = 0;
          return (
            (t = void 0 !== t ? t : 1e3),
            function (a) {
              const c = Date.now(),
                u = r[o];
              s || (s = c), (n[i] = a), (r[i] = c);
              let l = o,
                h = 0;
              for (; l !== i; ) (h += n[l++]), (l %= e);
              if (((i = (i + 1) % e), i === o && (o = (o + 1) % e), c - s < t))
                return;
              const d = u && c - u;
              return d ? Math.round((1e3 * h) / d) : void 0;
            }
          );
        };
        function ye(e, t) {
          let n = 0;
          const r = pe(50, 250);
          return (s) => {
            const i = s.loaded,
              o = s.lengthComputable ? s.total : void 0,
              a = i - n,
              c = r(a);
            n = i;
            const u = {
              loaded: i,
              total: o,
              progress: o ? i / o : void 0,
              bytes: a,
              rate: c || void 0,
              estimated: c && o && i <= o ? (o - i) / c : void 0,
            };
            (u[t ? "download" : "upload"] = !0), e(u);
          };
        }
        function me(e) {
          return new Promise(function (t, n) {
            let r = e.data;
            const s = fe.from(e.headers).normalize(),
              i = e.responseType;
            let o;
            function a() {
              e.cancelToken && e.cancelToken.unsubscribe(o),
                e.signal && e.signal.removeEventListener("abort", o);
            }
            F.isFormData(r) && Y.isStandardBrowserEnv && s.setContentType(!1);
            let c = new XMLHttpRequest();
            if (e.auth) {
              const t = e.auth.username || "",
                n = e.auth.password
                  ? unescape(encodeURIComponent(e.auth.password))
                  : "";
              s.set("Authorization", "Basic " + btoa(t + ":" + n));
            }
            const u = te(e.baseURL, e.url);
            function l() {
              if (!c) return;
              const r = fe.from(
                "getAllResponseHeaders" in c && c.getAllResponseHeaders(),
              );
              !(function (e, t, n) {
                const r = n.config.validateStatus;
                n.status && r && !r(n.status)
                  ? t(
                      new T(
                        "Request failed with status code " + n.status,
                        [T.ERR_BAD_REQUEST, T.ERR_BAD_RESPONSE][
                          Math.floor(n.status / 100) - 4
                        ],
                        n.config,
                        n.request,
                        n,
                      ),
                    )
                  : e(n);
              })(
                function (e) {
                  t(e), a();
                },
                function (e) {
                  n(e), a();
                },
                {
                  data:
                    i && "text" !== i && "json" !== i
                      ? c.response
                      : c.responseText,
                  status: c.status,
                  statusText: c.statusText,
                  headers: r,
                  config: e,
                  request: c,
                },
              ),
                (c = null);
            }
            if (
              (c.open(
                e.method.toUpperCase(),
                J(u, e.params, e.paramsSerializer),
                !0,
              ),
              (c.timeout = e.timeout),
              "onloadend" in c
                ? (c.onloadend = l)
                : (c.onreadystatechange = function () {
                    c &&
                      4 === c.readyState &&
                      (0 !== c.status ||
                        (c.responseURL &&
                          0 === c.responseURL.indexOf("file:"))) &&
                      setTimeout(l);
                  }),
              (c.onabort = function () {
                c &&
                  (n(new T("Request aborted", T.ECONNABORTED, e, c)),
                  (c = null));
              }),
              (c.onerror = function () {
                n(new T("Network Error", T.ERR_NETWORK, e, c)), (c = null);
              }),
              (c.ontimeout = function () {
                let t = e.timeout
                  ? "timeout of " + e.timeout + "ms exceeded"
                  : "timeout exceeded";
                const r = e.transitional || V;
                e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
                  n(
                    new T(
                      t,
                      r.clarifyTimeoutError ? T.ETIMEDOUT : T.ECONNABORTED,
                      e,
                      c,
                    ),
                  ),
                  (c = null);
              }),
              Y.isStandardBrowserEnv)
            ) {
              const t =
                (e.withCredentials || ne(u)) &&
                e.xsrfCookieName &&
                ee.read(e.xsrfCookieName);
              t && s.set(e.xsrfHeaderName, t);
            }
            void 0 === r && s.setContentType(null),
              "setRequestHeader" in c &&
                F.forEach(s.toJSON(), function (e, t) {
                  c.setRequestHeader(t, e);
                }),
              F.isUndefined(e.withCredentials) ||
                (c.withCredentials = !!e.withCredentials),
              i && "json" !== i && (c.responseType = e.responseType),
              "function" == typeof e.onDownloadProgress &&
                c.addEventListener("progress", ye(e.onDownloadProgress, !0)),
              "function" == typeof e.onUploadProgress &&
                c.upload &&
                c.upload.addEventListener("progress", ye(e.onUploadProgress)),
              (e.cancelToken || e.signal) &&
                ((o = (t) => {
                  c &&
                    (n(!t || t.type ? new se(null, e, c) : t),
                    c.abort(),
                    (c = null));
                }),
                e.cancelToken && e.cancelToken.subscribe(o),
                e.signal &&
                  (e.signal.aborted
                    ? o()
                    : e.signal.addEventListener("abort", o)));
            const h = (function (e) {
              const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
              return (t && t[1]) || "";
            })(u);
            h && -1 === Y.protocols.indexOf(h)
              ? n(
                  new T(
                    "Unsupported protocol " + h + ":",
                    T.ERR_BAD_REQUEST,
                    e,
                  ),
                )
              : c.send(r || null);
          });
        }
        const ge = { http: me, xhr: me },
          ve = (e) => {
            if (F.isString(e)) {
              const t = ge[e];
              if (!e)
                throw Error(
                  F.hasOwnProp(e)
                    ? `Adapter '${e}' is not available in the build`
                    : `Can not resolve adapter '${e}'`,
                );
              return t;
            }
            if (!F.isFunction(e))
              throw new TypeError("adapter is not a function");
            return e;
          },
          we = { "Content-Type": "application/x-www-form-urlencoded" };
        const _e = {
          transitional: V,
          adapter: (function () {
            let e;
            return (
              "undefined" != typeof XMLHttpRequest
                ? (e = ve("xhr"))
                : "undefined" != typeof process &&
                  "process" === F.kindOf(process) &&
                  (e = ve("http")),
              e
            );
          })(),
          transformRequest: [
            function (e, t) {
              const n = t.getContentType() || "",
                r = n.indexOf("application/json") > -1,
                s = F.isObject(e);
              s && F.isHTMLForm(e) && (e = new FormData(e));
              if (F.isFormData(e)) return r && r ? JSON.stringify(Z(e)) : e;
              if (
                F.isArrayBuffer(e) ||
                F.isBuffer(e) ||
                F.isStream(e) ||
                F.isFile(e) ||
                F.isBlob(e)
              )
                return e;
              if (F.isArrayBufferView(e)) return e.buffer;
              if (F.isURLSearchParams(e))
                return (
                  t.setContentType(
                    "application/x-www-form-urlencoded;charset=utf-8",
                    !1,
                  ),
                  e.toString()
                );
              let i;
              if (s) {
                if (n.indexOf("application/x-www-form-urlencoded") > -1)
                  return (function (e, t) {
                    return H(
                      e,
                      new Y.classes.URLSearchParams(),
                      Object.assign(
                        {
                          visitor: function (e, t, n, r) {
                            return Y.isNode && F.isBuffer(e)
                              ? (this.append(t, e.toString("base64")), !1)
                              : r.defaultVisitor.apply(this, arguments);
                          },
                        },
                        t,
                      ),
                    );
                  })(e, this.formSerializer).toString();
                if (
                  (i = F.isFileList(e)) ||
                  n.indexOf("multipart/form-data") > -1
                ) {
                  const t = this.env && this.env.FormData;
                  return H(
                    i ? { "files[]": e } : e,
                    t && new t(),
                    this.formSerializer,
                  );
                }
              }
              return s || r
                ? (t.setContentType("application/json", !1),
                  (function (e, t, n) {
                    if (F.isString(e))
                      try {
                        return (t || JSON.parse)(e), F.trim(e);
                      } catch (e) {
                        if ("SyntaxError" !== e.name) throw e;
                      }
                    return (n || JSON.stringify)(e);
                  })(e))
                : e;
            },
          ],
          transformResponse: [
            function (e) {
              const t = this.transitional || _e.transitional,
                n = t && t.forcedJSONParsing,
                r = "json" === this.responseType;
              if (e && F.isString(e) && ((n && !this.responseType) || r)) {
                const n = !(t && t.silentJSONParsing) && r;
                try {
                  return JSON.parse(e);
                } catch (e) {
                  if (n) {
                    if ("SyntaxError" === e.name)
                      throw T.from(
                        e,
                        T.ERR_BAD_RESPONSE,
                        this,
                        null,
                        this.response,
                      );
                    throw e;
                  }
                }
              }
              return e;
            },
          ],
          timeout: 0,
          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN",
          maxContentLength: -1,
          maxBodyLength: -1,
          env: { FormData: Y.classes.FormData, Blob: Y.classes.Blob },
          validateStatus: function (e) {
            return e >= 200 && e < 300;
          },
          headers: {
            common: { Accept: "application/json, text/plain, */*" },
          },
        };
        F.forEach(["delete", "get", "head"], function (e) {
          _e.headers[e] = {};
        }),
          F.forEach(["post", "put", "patch"], function (e) {
            _e.headers[e] = F.merge(we);
          });
        const Ie = _e;
        function be(e, t) {
          const n = this || Ie,
            r = t || n,
            s = fe.from(r.headers);
          let i = r.data;
          return (
            F.forEach(e, function (e) {
              i = e.call(n, i, s.normalize(), t ? t.status : void 0);
            }),
            s.normalize(),
            i
          );
        }
        function Ee(e) {
          return !(!e || !e.__CANCEL__);
        }
        function Pe(e) {
          if (
            (e.cancelToken && e.cancelToken.throwIfRequested(),
            e.signal && e.signal.aborted)
          )
            throw new se();
        }
        function Ae(e) {
          Pe(e),
            (e.headers = fe.from(e.headers)),
            (e.data = be.call(e, e.transformRequest));
          return (e.adapter || Ie.adapter)(e).then(
            function (t) {
              return (
                Pe(e),
                (t.data = be.call(e, e.transformResponse, t)),
                (t.headers = fe.from(t.headers)),
                t
              );
            },
            function (t) {
              return (
                Ee(t) ||
                  (Pe(e),
                  t &&
                    t.response &&
                    ((t.response.data = be.call(
                      e,
                      e.transformResponse,
                      t.response,
                    )),
                    (t.response.headers = fe.from(t.response.headers)))),
                Promise.reject(t)
              );
            },
          );
        }
        function Oe(e, t) {
          t = t || {};
          const n = {};
          function r(e, t) {
            return F.isPlainObject(e) && F.isPlainObject(t)
              ? F.merge(e, t)
              : F.isPlainObject(t)
              ? F.merge({}, t)
              : F.isArray(t)
              ? t.slice()
              : t;
          }
          function s(n) {
            return F.isUndefined(t[n])
              ? F.isUndefined(e[n])
                ? void 0
                : r(void 0, e[n])
              : r(e[n], t[n]);
          }
          function i(e) {
            if (!F.isUndefined(t[e])) return r(void 0, t[e]);
          }
          function o(n) {
            return F.isUndefined(t[n])
              ? F.isUndefined(e[n])
                ? void 0
                : r(void 0, e[n])
              : r(void 0, t[n]);
          }
          function a(n) {
            return n in t ? r(e[n], t[n]) : n in e ? r(void 0, e[n]) : void 0;
          }
          const c = {
            url: i,
            method: i,
            data: i,
            baseURL: o,
            transformRequest: o,
            transformResponse: o,
            paramsSerializer: o,
            timeout: o,
            timeoutMessage: o,
            withCredentials: o,
            adapter: o,
            responseType: o,
            xsrfCookieName: o,
            xsrfHeaderName: o,
            onUploadProgress: o,
            onDownloadProgress: o,
            decompress: o,
            maxContentLength: o,
            maxBodyLength: o,
            beforeRedirect: o,
            transport: o,
            httpAgent: o,
            httpsAgent: o,
            cancelToken: o,
            socketPath: o,
            responseEncoding: o,
            validateStatus: a,
          };
          return (
            F.forEach(Object.keys(e).concat(Object.keys(t)), function (e) {
              const t = c[e] || s,
                r = t(e);
              (F.isUndefined(r) && t !== a) || (n[e] = r);
            }),
            n
          );
        }
        const xe = "1.1.2",
          Ce = {};
        ["object", "boolean", "number", "function", "string", "symbol"].forEach(
          (e, t) => {
            Ce[e] = function (n) {
              return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
            };
          },
        );
        const Se = {};
        Ce.transitional = function (e, t, n) {
          function r(e, t) {
            return (
              "[Axios v1.1.2] Transitional option '" +
              e +
              "'" +
              t +
              (n ? ". " + n : "")
            );
          }
          return (n, s, i) => {
            if (!1 === e)
              throw new T(
                r(s, " has been removed" + (t ? " in " + t : "")),
                T.ERR_DEPRECATED,
              );
            return (
              t &&
                !Se[s] &&
                ((Se[s] = !0),
                console.warn(
                  r(
                    s,
                    " has been deprecated since v" +
                      t +
                      " and will be removed in the near future",
                  ),
                )),
              !e || e(n, s, i)
            );
          };
        };
        const Fe = {
            assertOptions: function (e, t, n) {
              if ("object" != typeof e)
                throw new T(
                  "options must be an object",
                  T.ERR_BAD_OPTION_VALUE,
                );
              const r = Object.keys(e);
              let s = r.length;
              for (; s-- > 0; ) {
                const i = r[s],
                  o = t[i];
                if (o) {
                  const t = e[i],
                    n = void 0 === t || o(t, i, e);
                  if (!0 !== n)
                    throw new T(
                      "option " + i + " must be " + n,
                      T.ERR_BAD_OPTION_VALUE,
                    );
                } else if (!0 !== n)
                  throw new T("Unknown option " + i, T.ERR_BAD_OPTION);
              }
            },
            validators: Ce,
          },
          Re = Fe.validators;
        class Le {
          constructor(e) {
            (this.defaults = e),
              (this.interceptors = { request: new K(), response: new K() });
          }
          request(e, t) {
            "string" == typeof e ? ((t = t || {}).url = e) : (t = e || {});
            const n = (t = Oe(this.defaults, t)).transitional;
            void 0 !== n &&
              Fe.assertOptions(
                n,
                {
                  silentJSONParsing: Re.transitional(Re.boolean),
                  forcedJSONParsing: Re.transitional(Re.boolean),
                  clarifyTimeoutError: Re.transitional(Re.boolean),
                },
                !1,
              ),
              (t.method = (
                t.method ||
                this.defaults.method ||
                "get"
              ).toLowerCase());
            const r =
              t.headers && F.merge(t.headers.common, t.headers[t.method]);
            r &&
              F.forEach(
                ["delete", "get", "head", "post", "put", "patch", "common"],
                function (e) {
                  delete t.headers[e];
                },
              ),
              (t.headers = new fe(t.headers, r));
            const s = [];
            let i = !0;
            this.interceptors.request.forEach(function (e) {
              ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
                ((i = i && e.synchronous), s.unshift(e.fulfilled, e.rejected));
            });
            const o = [];
            let a;
            this.interceptors.response.forEach(function (e) {
              o.push(e.fulfilled, e.rejected);
            });
            let c,
              u = 0;
            if (!i) {
              const e = [Ae.bind(this), void 0];
              for (
                e.unshift.apply(e, s),
                  e.push.apply(e, o),
                  c = e.length,
                  a = Promise.resolve(t);
                u < c;

              )
                a = a.then(e[u++], e[u++]);
              return a;
            }
            c = s.length;
            let l = t;
            for (u = 0; u < c; ) {
              const e = s[u++],
                t = s[u++];
              try {
                l = e(l);
              } catch (e) {
                t.call(this, e);
                break;
              }
            }
            try {
              a = Ae.call(this, l);
            } catch (e) {
              return Promise.reject(e);
            }
            for (u = 0, c = o.length; u < c; ) a = a.then(o[u++], o[u++]);
            return a;
          }
          getUri(e) {
            return J(
              te((e = Oe(this.defaults, e)).baseURL, e.url),
              e.params,
              e.paramsSerializer,
            );
          }
        }
        F.forEach(["delete", "get", "head", "options"], function (e) {
          Le.prototype[e] = function (t, n) {
            return this.request(
              Oe(n || {}, { method: e, url: t, data: (n || {}).data }),
            );
          };
        }),
          F.forEach(["post", "put", "patch"], function (e) {
            function t(t) {
              return function (n, r, s) {
                return this.request(
                  Oe(s || {}, {
                    method: e,
                    headers: t ? { "Content-Type": "multipart/form-data" } : {},
                    url: n,
                    data: r,
                  }),
                );
              };
            }
            (Le.prototype[e] = t()), (Le.prototype[e + "Form"] = t(!0));
          });
        const Ne = Le;
        class Te {
          constructor(e) {
            if ("function" != typeof e)
              throw new TypeError("executor must be a function.");
            let t;
            this.promise = new Promise(function (e) {
              t = e;
            });
            const n = this;
            this.promise.then((e) => {
              if (!n._listeners) return;
              let t = n._listeners.length;
              for (; t-- > 0; ) n._listeners[t](e);
              n._listeners = null;
            }),
              (this.promise.then = (e) => {
                let t;
                const r = new Promise((e) => {
                  n.subscribe(e), (t = e);
                }).then(e);
                return (
                  (r.cancel = function () {
                    n.unsubscribe(t);
                  }),
                  r
                );
              }),
              e(function (e, r, s) {
                n.reason || ((n.reason = new se(e, r, s)), t(n.reason));
              });
          }
          throwIfRequested() {
            if (this.reason) throw this.reason;
          }
          subscribe(e) {
            this.reason
              ? e(this.reason)
              : this._listeners
              ? this._listeners.push(e)
              : (this._listeners = [e]);
          }
          unsubscribe(e) {
            if (!this._listeners) return;
            const t = this._listeners.indexOf(e);
            -1 !== t && this._listeners.splice(t, 1);
          }
          static source() {
            let e;
            return {
              token: new Te(function (t) {
                e = t;
              }),
              cancel: e,
            };
          }
        }
        const De = Te;
        const Me = (function e(t) {
          const n = new Ne(t),
            s = r(Ne.prototype.request, n);
          return (
            F.extend(s, Ne.prototype, n, { allOwnKeys: !0 }),
            F.extend(s, n, null, { allOwnKeys: !0 }),
            (s.create = function (n) {
              return e(Oe(t, n));
            }),
            s
          );
        })(Ie);
        (Me.Axios = Ne),
          (Me.CanceledError = se),
          (Me.CancelToken = De),
          (Me.isCancel = Ee),
          (Me.VERSION = xe),
          (Me.toFormData = H),
          (Me.AxiosError = T),
          (Me.Cancel = Me.CanceledError),
          (Me.all = function (e) {
            return Promise.all(e);
          }),
          (Me.spread = function (e) {
            return function (t) {
              return e.apply(null, t);
            };
          }),
          (Me.isAxiosError = function (e) {
            return F.isObject(e) && !0 === e.isAxiosError;
          }),
          (Me.formToJSON = (e) => Z(F.isHTMLForm(e) ? new FormData(e) : e));
        const je = Me;
      },
    },
    t = {};
  function n(r) {
    var s = t[r];
    if (void 0 !== s) return s.exports;
    var i = (t[r] = { exports: {} });
    return e[r].call(i.exports, i, i.exports, n), i.exports;
  }
  (n.d = (e, t) => {
    for (var r in t)
      n.o(t, r) &&
        !n.o(e, r) &&
        Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
  }),
    (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    });
  var r = {};
  return (
    (() => {
      "use strict";
      var e = r;
      Object.defineProperty(e, "__esModule", { value: !0 });
      var t = n(277);
      e.default = t.GryFyn;
    })(),
    r
  );
})();

export default Lib.default;
