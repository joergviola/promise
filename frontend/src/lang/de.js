

export default {
  'test': "Dies ist ein Test",
  'type': {
    'organisation': {
      'name': 'Name',
      'email': 'E-Mail',
      'website': 'Web-Seite',
      'phone': 'Telefon',
    },
    'users': {
      'name': 'Name',
      'email': 'E-Mail',
      'phone': 'Telefon',
      'mobile': 'Mobil',
      'comment': 'Notizen',
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
      'lang': 'Sprache',
      'lang-options': {
        'de': 'Deutsch',
        'en': 'Englisch',
      }
    },
    'project': {
      'name': 'Name',
      'description': 'Beschreibung',
      'links': 'Links',
      'source': 'Quelle',
      'source': 'Quelle',
      'effort_unit': 'Aufwandseinheit',
      'starts_at': 'Beginnt',
      'ends_at': 'Endet',
      'planned': 'Budget',
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
    'allocation': {
      'user_id': 'Benutzer',
      'role': 'Rolle',
      'role-options': {
        'Sales': 'Vertrieb',
        'Mgmt': 'Projektmgmt',
        'Dev': 'Entwicklung',
        'QA': 'Test',
        'Customer': 'Kunde',
      },
      'parttime': 'Zuordnung',
      'salary': 'Gehalt',
      'type': 'Typ',
      'type-options': {
        'ILL': 'Krankheit',
        'HOLIDAY': 'Urlaub',
        'CONTRACT': 'Arbeitsvertrag',
      },
      'from': 'Von',
      'to': 'Bis',
      'comment': 'Kommentar',
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
      'user_id': 'Verantwortlich',
      'state': 'Zustand',
      'state-options': {
        'NEW': 'Nicht freigegeben',
        'APPROVED': 'Backlog',
        'PLANNED': 'Sprint',
        'STARTED': 'Heute',
        'IMPLEMENTED': 'Umgesetzt',
        'TESTED': 'Getestet',
        'DEPLOYED': 'Installiert',
      },
      'used': 'Fortschritt',
    },
    'estimation': {
      'planned': 'Schätzung',
      'comment': 'Kommentar',
    },
    'action': {
      'project': {
        'name': 'Projekt',
      },
      'task': {
        'name': 'Aufgabe',
      },
      'user': {
        'name': 'Benutzer',
      },
      'from': 'Begonnen',
      'used': 'Gebucht',
      'comment': 'Kommentar',
    },
    'accounting': {
      'name': 'Name',
      'price': 'Preis',
      'state': 'Zustand',
      'state-options': {
        'NEW': 'Erstellt',
        'SENT': 'Gesendet',
        'ACCEPTED': 'Angenommen',
        'REJECTED': 'Abgelehnt',
        'PAYED': 'Vollständig bezahlt',
      },
      'approved_at': 'Angenommen/Abgelehnt',
      'pricePerUnit': 'Preiseinheit',
      'percentBuffer': 'Aufschlag',
      'rounding': 'Gerundet',
      'invoicing': 'Rechnungstellung',
      'invoicing-options': {
        'NONE': 'Nach Aufwand',
        'ONE': 'Eine Rechnung',
        '30-40-30': '30/40/30% Rechnungen',
      },
      'reference': {
        'name' : 'Angebot'
      }
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
      'Closed': 'Installiert',
      'Reset': 'Zurücksetzen',
      'Approve': 'Freigeben',
      'Plan': 'Bald erledigen',
      'Start': 'Heute erledigen',
      'Ready': 'Fertig',
      'Accept': 'Angenommen',
      'Reject': 'Abgelehnt',
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
        'readonly': 'Nicht mehr änderbar.',
        'alreadysent': 'Angebot wurde dem Kunden bereits zugestellt.',
      },
    },
    'project': {
      'tasks': {
        'none': 'Gruppieren nach:',
        'category': 'Kategorie',
        'user': 'Verantwortlich',
        'position': 'Angebot',
        'state': 'Zustand',
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
      'deployed': 'Installiert',
      'detail': 'Details',
      'hours': 'Stunde | Stunden'
    },
    'planning': {
      'edit-title': 'Zuordnung für {user} ändern',
      'create-title': 'Zuordnung für {user} anlegen',
      'quarter': 'Stunde',
      'day': 'Tag',
      'week': 'Woche',
      'month': 'Monat',
      'type': 'Art oder Projekt',
      'standard': 'Art',
      'projects': 'Projekt|Projekte',
      'holiday': 'Urlaub',
      'ill': 'Krankheit',
      'parttime': 'Zugeordnet in %',
      'date': 'Von-bis',
      'cancel': 'Abbrechen',
      'save': 'Speichern',
      'delete': 'Löschen',
      'create': 'Anlegen',
      'exit': {
        'title': 'Es sind nicht gespeicherte Änderungen vorhanden.',
        'warning': 'Warnung!',
        'confirm': 'Ist okay, Änderungen verwerfen.',
        'cancel': 'Oh! Zurück zur Planung.',
      },
    },
    'gantt': {
      'date': 'Datum'
    },
    'kanban': {
      'NEW': 'Nicht freigegeben',
      'APPROVED': 'Backlog',
      'PLANNED': 'Sprint',
      'STARTED': 'Heute',
      'IMPLEMENTED': 'Umgesetzt',
      'TESTED': 'Getestet',
      'DEPLOYED': 'Installiert',
    },
    'user': {
      'Details': 'Details',
      'Timeline': 'Stundenzettel',
      'Contracts': 'Vertrag',
      'TimesOff': 'Krankheit/Urlaub',
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
    'Invoices': 'Rechnungen',
    'Invoice': 'Rechnung',
    'Positions': 'Positionen',
    'Organisations': 'Kunden',
    'Organisation': 'Kunde',
    'Project-Detail': 'Detail',
    'Project-Tasks': 'Aufgaben',
    'Team': 'Team',
    'Board': 'Board',
    'State': 'Burndown',
    'Project-Timeline': 'Arbeitszeit',
    'Task': 'Aufgabe',
    'Work': 'Protokoll',
  }
}