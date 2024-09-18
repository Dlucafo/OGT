var Action = {
  //NOMEAZIONE: "NOMEAZIONE"
  START: "START",

  SHOW_HOME: "SHOW_HOME",
  UPDATE_HOME_CONTENT: "UPDATE_HOME_CONTENT"
}

// const nomeazione = () => ({type: Action.NOMEAZIONE})
const start = (user, idruolo) => ({ type: Action.START, user: user, idruolo: idruolo })

const showHome = () => ({ type: Action.SHOW_HOME })
const updateHomeContent = (target, output) => ({ type: Action.UPDATE_HOME_CONTENT, target: target, output: output })

console.log("Action Charged")