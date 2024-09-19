var Reducer = {};

Reducer.reduce = function(state, action) {
  switch(action.type) {
    case Action.UPDATE_CONTENT:
      return Object.assign({}, state, {
        action: action.type,
        target: action.target,
        output: action.output
      })
      break;
    case Action.START:
      return Object.assign({}, state, {
        action: action.type,
        user: action.user,
        idruolo: action.idruolo
      })
      break;
    default:
      //return state
      console.log(`Reduce: ${action.type}`)
      return Object.assign({}, state, {
        action: action.type
      })
      break;
  }
}

