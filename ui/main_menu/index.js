$(function () {
  $('#toolbar').w2toolbar({
      name : 'myToolbar',
      items: [
          { type: 'radio',  id: 'home', group: '1', text: 'Home', img: 'icon-add', checked: true },
          { type: 'break' },
          { type: 'radio',   id: 'prenotazioni', group: '1', text: 'Prenotazioni', img: 'icon-folder'},
          { type: 'break' },
          { type: 'radio',  id: 'strutture',  group: '1', text: 'Strutture', img: 'icon-page' },
          { type: 'break' },
          { type: 'radio',  id: 'pazienti',  group: '1', text: 'Pazienti', img: 'icon-page', hidden: true },
          { type: 'spacer' },
          { type: 'button',  id: 'logOut',  text: 'Log Out', class: 'log-out-icon', img: 'icon-logout' }
      ],

      onClick: function(event) {
        switch(event.target) {
          case 'home':
            Store.NewState(showHome());
            break;
          case 'logOut':
            if (confirm('Sei sicuro di voler uscire?')) {
              Store.NewState(logout());
            }
          default:
            console.log('no main menu action find');
            break;
        }
      }
  });

  switch(Store.state.action) {
    case Action.START:
      if(Store.state.idruolo==1) {
        w2ui.myToolbar.show('pazienti');
      }
      break;
  }
  //console.log(w2ui.myToolbar.get('pazienti'))
  
});