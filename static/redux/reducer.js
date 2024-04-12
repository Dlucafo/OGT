var Reducer = {};

Reducer.reduce = function(state, action) {
  switch(action.type) {
    case Action.CUSTOMACTION:
      console.log("Start Custom Action")
    default:
      //return state
      return Object.assign({}, state, {
        action: action.type
      })
  }
}

