# LearnFlow Security Specification

## Data Invariants
1. A roadmap must belong to a valid user.
2. Only the owner of a roadmap can view or modify it.
3. Users can only create roadmaps for themselves.
4. User profiles are private to the owner.

## The Dirty Dozen (Attack Vectors)
1. **Identity Theft**: Creating a roadmap with another user's `userId`.
2. **Access Escalation**: Updating the `userId` field of an existing roadmap to steal it.
3. **Data Poisoning**: Injecting massive strings (1MB+) into the `title` or `goal` fields.
4. **ID Poisoning**: Using a 2KB string as a roadmap ID.
5. **PII Leak**: A signed-in user trying to read another user's profile at `/users/{otherId}`.
6. **Schema Break**: Modifying `createdAt` to a future date or null.
7. **Phantom Update**: Adding a `isAdmin: true` field to a user profile.
8. **List Scraping**: Unfiltered queries that try to get all roadmaps in the system.
9. **State Shortcut**: Setting `progress` to 100 without completing tasks.
10. **Resource Exhaustion**: Creating 10,000 roadmaps in a minute (Rate limiting - usually handled by Firebase, but rules can help).
11. **Type Mismatch**: Sending a string into the `progress` (number) field.
12. **Milestone Forgery**: Adding fake milestones to a phase that doesn't exist.

## Verification
Tests in `firestore.rules.test.ts` (conceptual) will verify that all 12 payloads are blocked.
