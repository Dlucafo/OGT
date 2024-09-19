import home from "./marko/home/home.marko";
import prenotazioni from "./marko/prenotazioni/prenotazioni.marko";
let output = document.getElementById("main-container");
import utility from '../utility/utility.js';

let INIT = {};

INIT.Execute = async function() {
  switch(Store.state.action) {
    case Action.START:
      INIT.render = home.renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_HOME:
      INIT.render = home.renderSync().replaceChildrenOf(output);
      break;
    case Action.SHOW_PRENOTAZIONI:
      INIT.render = prenotazioni.renderSync().replaceChildrenOf(output);
      break;
    default:
      break;
  }
}

Store.Bind(INIT.Execute);