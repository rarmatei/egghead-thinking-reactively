let broadcastShow;
let broadcastHide;

export function initLoadingBar(total, loaded) {
  const loadingController = {
    show: show.bind(null, total, loaded),
    hide
  };
  return Promise.resolve(loadingController);
}

function show(total, loaded) {
  return new Promise(() => {
    broadcastShow && broadcastShow(total, loaded);
  });
}

function hide() {
  return new Promise(() => {
    broadcastHide && broadcastHide();
  });
}

export function connect(showCb, hideCb) {
  broadcastShow = showCb;
  broadcastHide = hideCb;
}
