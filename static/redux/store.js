var Store = {};

Store.state = {

}

Store.Bind = function(render) {
  document.addEventListener('newState', render)
}

Store.NewState = function(actionCreator) {
  document.dispatchEvent(
    new CustomEvent('action', {detail: actionCreator})
  );
}

document.addEventListener(
  'action', function(e) {
    Store.state = Reducer.reduce(Store.state, e.detail);
    document.dispatchEvent(new CustomEvent('newState'));
  },
  false
);