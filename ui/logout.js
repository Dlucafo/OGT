let Logout = {}

Logout.Execute = function() {
  switch(Store.state.action) {
    case Action.LOG_OUT:
      location.replace('/logout');
      break;
  }
}

Store.Bind(Logout.Execute);