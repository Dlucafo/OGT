$(function () {
  $('#toolbar').w2toolbar({
      name : 'myToolbar',
      items: [
          { type: 'radio',  id: 'home', group: '1', caption: 'Home', img: 'icon-add', checked: true },
          { type: 'break' },
          { type: 'menu',   id: 'personeMenu', caption: 'Drop Down', img: 'icon-folder', 
              items: [
                  { text: 'Item 1', img: 'icon-page' }, 
                  { text: 'Item 2', img: 'icon-page' }, 
                  { text: 'Item 3', img: 'icon-page' }
              ]
          },
          { type: 'break' },
          { type: 'radio',  id: 'persone',  group: '1', caption: 'Persone', img: 'icon-page' },
          { type: 'radio',  id: 'strutture',  group: '1', caption: 'Strutture', img: 'icon-page' },
          { type: 'spacer' },
          { type: 'button',  id: 'item5',  caption: 'LogOut', class: 'log-out-icon', img: 'icon-logout' }
      ],

      onClick: function(event) {
        switch(event.target) {
          case 'home':
            Store.NewState(showHome());
            break;
          default:
            console.log('no main menu action find');
            break;
        }
      }
  });
});