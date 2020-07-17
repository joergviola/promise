

const project = [
  {state: 'LEAD', lead: true, de: 'Neu', en: 'New'},
  {state: 'ONHOLD', lead: true, de: 'Zurückgestellt', en: 'On hold'},
  {state: 'INCEPTION', lead: true, de: 'Klärung', en: 'Inception'},
  {state: 'ESTIMATION', lead: true, de: 'Schätzung', en: 'Estimation'},
  {state: 'WAITING', lead: true, de: 'Nachhaken', en: 'Waiting'},
  {state: 'NEGOTIATION', lead: true, de: 'Verhandeln', en: 'Negostiation'},
  {state: 'ACCEPTED', lead: false, de: 'Beauftragt', en: 'Accepted'},
  {state: 'REJECTED', lead: false, de: 'Abgelehnt', en: 'Rejected'},
  {state: 'MAINTENANCE', lead: false, de: 'Wartung', en: 'Maintenance'},
  {state: 'CLOSED', lead: false, de: 'Beendet', en: 'Closed'},
]

const task = [
  {state: 'NEW', bookable: false, upcoming: false, today: false, de: 'Neu', en: 'New'},
  {state: 'APPROVED', bookable: true, upcoming: false, today: false, de: 'Freigegeben', en: 'Approved'},
  {state: 'PLANNED', bookable: true, upcoming: true, today: false, de: 'Sprint', en: 'Planned'},
  {state: 'STARTED', bookable: true, upcoming: false, today: true, de: 'Heute', en: 'Started'},
  {state: 'IMPLEMENTED', bookable: true, upcoming: false, today: false, de: 'Fertig', en: 'Implemented'},
  {state: 'TESTED', bookable: true, upcoming: false, today: false, de: 'Getestet', en: 'Tested'},
  {state: 'DEPLOYED', bookable: false, upcoming: false, today: false, de: 'Installiert', en: 'Deployed'},
]

export default { project, task }