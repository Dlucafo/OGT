import test from "./marko/test_file.marko"
const output = document.getElementById("output");

let T = {};

T.Execute = function() {
  switch(Store.state.action) {
    case Action.CUSTOMACTION:
      T.render = test.renderSync().replaceChildrenOf(output);
      break;
  }
}

Store.Bind(T.Execute);