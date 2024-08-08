import home from "./marko/home/home.marko"
let output = document.getElementById("main-container");

let INIT = {};

INIT.Execute = function() {
  switch(Store.state.action) {
    case Action.START:
      INIT.render = home.renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_HOME:
      INIT.render = home.renderSync().replaceChildrenOf(output);
    default:
      console.log("error?")
  }
}

Store.Bind(INIT.Execute);