import password_page from './marko/home/components/password.marko';
import l_prenotazioni_page from './marko/prenotazioni/components/l_prenotazioni.marko';
import s_prenotazioni_page from './marko/prenotazioni/components/s_prenotazioni.marko';

let CONTENT = {};

CONTENT.Execute = function() {
  switch(Store.state.action) {
    case Action.UPDATE_CONTENT:
      let output = Store.state.output;
      switch(Store.state.target) {
        case 'password-button':
          CONTENT.render = password_page.renderSync().replaceChildrenOf(output);
          break;
        case 'l_prenotazioni-button':
          CONTENT.render = l_prenotazioni_page.renderSync().replaceChildrenOf(output);
          break;
        case 's_prenotazioni-button':
          CONTENT.render = s_prenotazioni_page.renderSync().replaceChildrenOf(output);
          break;
      }
      break;
  }
}

Store.Bind(CONTENT.Execute);