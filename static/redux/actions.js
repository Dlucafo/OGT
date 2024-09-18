var Action = {
  //NOMEAZIONE: "NOMEAZIONE"
  START: "START",
  LOG_OUT: "LOG_OUT",

  SHOW_HOME: "SHOW_HOME",
  UPDATE_HOME_CONTENT: "UPDATE_HOME_CONTENT"
}

// const nomeazione = () => ({type: Action.NOMEAZIONE})
const start = (user, idruolo) => ({ type: Action.START, user: user, idruolo: idruolo })
const logout = () => ({ type: Action.LOG_OUT})

const showHome = () => ({ type: Action.SHOW_HOME })
const updateHomeContent = (target, output) => ({ type: Action.UPDATE_HOME_CONTENT, target: target, output: output })

console.log("Action Charged")