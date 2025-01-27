window.global = window;
window.process = {
  env: { DEBUG: undefined },
  version: [],
  nextTick: function (cb) {
    setTimeout(cb, 0);
  },
};
