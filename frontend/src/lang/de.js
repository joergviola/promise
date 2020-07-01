

export default {
  'test': "Dies ist ein Test",
  'type': {
    'users': {
      'name': 'Name',
      'email': 'E-Mail',
      'phone': 'Telefon',
      'password': 'Kennword',
      'role_id': 'Rolle',
      'organisation_id': 'Organisation',
      'avatar': 'Ihr Bild',
      'organisation': {
        'name': 'Organisation',
      },
      'role': {
        'name': 'Role',
      },
    },
    'project': {
      'name': 'Name',
      'description': 'Beschreibung',
      'links': 'Links',
      'source': 'Quelle',
      'source': 'Quelle',
      'effort_unit': 'Aufwandseinheit',
      'used': 'Fortschritt',
      'price': 'Preis',
      'state': 'Zustand',
      'accepted': 'Beauftragt',
      'customer_id': 'Kunde',
      'contact': 'Ansprechpartner',
      'customer': {
        'name': 'Name',
      },
      'last_offer': {
        'price': 'Aktuelles Angebot',
      },
    },
    'position': {
      'no': 'Nr',
      'name': 'Name',
      'comment': 'Kommentar',
      'planned': 'Geplant',
      'price': 'Preis',
      'optional': 'Optional',
      'accepted': 'Beauftragt',
    },
    'task': {
      'name': 'Neue Aufgabe',
      'description': 'Was ist zu tun?',
      'due_at': 'Fällig am',
    },
    'action': {
      'project': {
        'name': 'Name',
      },
      'task': {
        'name': 'Name',
      },
      'from': 'Begonnen',
      'used': 'Fortschritt',
      'comment': 'Kommentar',
    },
  },
  'ui': {
    'auth': {
      'profile': 'Mein Profil',
      'logout': 'Abmelden',
    },
    'home': {
      'welcome': 'Hallo {user}!',
      'tasks': 'Aufgaben',
      'today': 'Heute',
      'upcoming': 'Demnächst',
      'time': 'Zeit erfassen',
      'notask': 'Wähle eine Aufgabe von heute',
      'projects': 'Deine Projekte',
    },
    'list': {
      'actions': 'Aktionen',
      'add': 'Neu',
      'addGroup': 'Neuer Abschnitt',
    },
    'detail': {
      'cancel': 'Abbrechen',
      'save': 'Speichern',
      'details': 'Mehr',
    },
    'leads': {
      'open': 'In Arbeit',
      'accepted': 'Angenommen',
      'rejected': 'Abgelehnt',
      'template': 'Vorlagen',
      'reset': 'Zurücksetzen',
      'istemplate': 'Als Vorlage verwenden',
      'notemplate': 'Keine Vorlage mehr',
      'planned': 'Aktuell geplant',
      'timeline': {
        'add': 'Neue Vertriebsaufgabe',
        'save': 'Speichern',
        'close': 'Erledigt',
      }
    },
    'timeline': {
      'younow': 'Du, jetzt',
      'comment': 'Was hast Du erledigt?',
      'save': 'Speichern',
      'start': 'Beginnen',
      'close': 'Erledigt',
      'reopen': 'Fehlerhaft',
      'tested': 'Getestet',
      'deployed': 'Deployed',
      'detail': 'Details',
      'hours': 'Stunde | Stunden'
    },
  },
  'route': {
    'All': 'Alle',
    'Home': 'Home',
    'Detail': 'Detail',
    'Users': 'Benutzer',
    'User': 'Person',
    'Sales': 'Vertrieb',
    'Leads': 'Anfragen',
    'Planning': 'Planung',
    'Projects': 'Projekte',
    'Roles': 'Rollen',
    'Lead-Detail': 'Detail',
    'Timeline': 'Verlauf',
    'Lead-Timeline': 'Verlauf',
    'Lead-Tasks': 'Aufgaben',
    'Offers': 'Angebote',
    'Offer': 'Angebot',
    'Positions': 'Positionen',
  }
}