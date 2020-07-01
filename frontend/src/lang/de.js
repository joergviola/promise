

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
      'percent': 'Aufschlag',
      'purchased': 'Eingekauft',
      'price': 'Einkaufspreis',
      'supplier': 'Lieferant',
      'position': 'Angebotsposition',
      'planned': 'Geplant',
      'due_at': 'Fällig am',
    },
    'estimation': {
      'planned': 'Schätzung',
      'comment': 'Kommentar',
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
    'accounting': {
      'name': 'Name',
      'price': 'Preis',
      'state': 'Zustand',
      'approved_at': 'Angenommen/Abgelehnt',
      'pricePerUnit': 'Preiseinheit',
      'percentBuffer': 'Aufschlag',
      'rounding': 'Gerundet',
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
      'create': 'Neue zeile',
      'edit': 'Diese Zeile ändern',
      'delete': 'Diese Zeile löschen',
    },
    'detail': {
      'cancel': 'Abbrechen',
      'save': 'Speichern',
      'details': 'Mehr',
    },
    'button': {
      'Send': 'Senden',
      'Copy': 'Kopieren',
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
      },
      'tasks': {
        'percent': 'Prozentualer Aufschlag, wird zu ALLEN Angebotspositionen addiert.',
        'purchased': 'Dies ist ein Einkaufsartikel.',
      },
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
    'Tasks': 'Aufgaben',
    'Offers': 'Angebote',
    'Offer': 'Angebot',
    'Positions': 'Positionen',
  }
}