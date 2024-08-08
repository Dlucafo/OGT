import password_page from './marko/home/components/password.marko';

let CONTENT = {};

CONTENT.Execute = function() {
  switch(Store.state.action) {
    case Action.UPDATE_HOME_CONTENT:
      let output = Store.state.output;
      switch(Store.state.target) {
        case 'password-button':
          CONTENT.render = password_page.renderSync().replaceChildrenOf(output);
          break;
      }
      break;
  }
}

Store.Bind(CONTENT.Execute);