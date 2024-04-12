let T = {};

T.Execute = function() {
  switch(Store.state.action) {
    case Action.CUSTOMACTION:
      console.log("Partita customaction");
      break;
  }
}

Store.Bind(T.Execute);