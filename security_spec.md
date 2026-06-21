# Security Specifications for AAT Portal Firestore Collections

This specification describes the mathematical and logical structures enforced within our Firebase database layers to protect identity, prevent unauthorized privilege escalation, and block data poisoning.

## 1. Data Invariants
- **Admin Isolation**: No client SDK can set their own role to "admin" or modify another profile's clearance level.
- **Inquiry Integrity**: Leads must have valid email addresses, correct formats, and are immutable once created except by authorized Riyadh administrators.
- **Bot Interaction logging**: Anyone can log conversations, but only registered Riyadh administrators can browse or delete customer transcripts.

## 2. The "Dirty Dozen" Spoofing & Poisoning Payloads
Below are 12 malicious payloads designed to exceed boundaries. Our security policies must reject all 12:

1. **Self-Promotion Payload**: Unprivileged user attempting to register themselves with `role: "admin"`.
2. **Lead Poisoning Payload**: Spamming an inquiry template with a 500KB fake name.
3. **Ghost State Shortcutting**: Initiating a lead status directly as `closed`.
4. **ID Hijacking**: Creating a user profile document for a UID belonging to another user.
5. **PII Blanket Leak**: Searching and listing other users' contact leads without admin privileges.
6. **Negative Budget Values**: Submitting negative numbers as financial budgets.
7. **Identity Spoofing**: Setting `userEmail` to `mohamedsamysalmony@gmail.com` on a chatbot log when signed in as someone else.
8. **Malicious ID Injection**: Injecting script tags (`<script>`) or URL parameters inside document IDs.
9. **Timestamp Override**: Providing a client-side timestamp on creation instead of `request.time`.
10. **Ghost Fields**: Writing fields like `shadowField: true` that violate schemas.
11. **State Mutation Gap**: Normal users trying to update another user's email.
12. **Double Action Abuse**: Rapidly modifying stats in a single second.

## 3. Policy Match Framework
We enforce strict checks in `firestore.rules`:
- Catch-All Deny Net is placed at the global root of firestore rules.
- `isAdmin()` resolves securely utilizing verified emails (`mohamedsamysalmony@gmail.com`) and database roles mappings.
