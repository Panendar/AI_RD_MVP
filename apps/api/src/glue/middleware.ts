// Scaffold-owned glue file (STORY-105). Modules register at the markers below; do not edit the marked lines by hand.
// knm:imports
import { auditMiddleware } from '../audit/auditMiddleware'; // knm:module audit-trail

export const middleware = [
  // knm:entries
  { id: 'audit-trail', handler: auditMiddleware }, // knm:module audit-trail
  // knm:entries-end
];
