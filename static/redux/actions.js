var Action = {
  //NOMEAZIONE: "NOMEAZIONE"
  START: "START",
  LOG_OUT: "LOG_OUT",

  SHOW_HOME: "SHOW_HOME",
  UPDATE_CONTENT: "UPDATE_CONTENT",

  SHOW_PRENOTAZIONI: "SHOW_PRENOTAZIONI"
}

// const nomeazione = () => ({type: Action.NOMEAZIONE})
const start = (user, idruolo) => ({ type: Action.START, user: user, idruolo: idruolo })
const logout = () => ({ type: Action.LOG_OUT})

const showHome = () => ({ type: Action.SHOW_HOME })
const updateContent = (target, output) => ({ type: Action.UPDATE_CONTENT, target: target, output: output })

const showPrenotazioni = () => ({ type: Action.SHOW_PRENOTAZIONI })

console.log("Action Charged")