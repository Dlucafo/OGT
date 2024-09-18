var Reducer = {};

Reducer.reduce = function(state, action) {
  switch(action.type) {
    case Action.UPDATE_HOME_CONTENT:
      return Object.assign({}, state, {
        action: action.type,
        target: action.target,
        output: action.output
      })
    case Action.START:
      return Object.assign({}, state, {
        action: action.type,
        user: action.user,
        idruolo: action.idruolo
      })
    default:
      //return state
      console.log(`Reduce: ${action.type}`)
      return Object.assign({}, state, {
        action: action.type
      })
  }
}

