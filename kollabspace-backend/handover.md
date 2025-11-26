# Project Handoff: Real-Time Collaborative Editor

## Context

Marcos is a Senior Software Engineer with 6 years of experience at Freematica (Spain), primarily in .NET/C#, Blazor Server, SignalR, Redis, RabbitMQ, and Docker. He led a major ERP migration from legacy to modern distributed architecture.

He's preparing to relocate to Singapore's tech market and needs portfolio projects demonstrating distributed systems skills.

## Goal

Build a **real-time collaborative text editor** (like Google Docs lite) to learn and demonstrate:
- Conflict resolution (Operational Transformation or CRDTs)
- Real-time state synchronization
- WebSocket scaling
- Distributed systems patterns

This is a **learning project** for job interviews, not a product to ship.

## Decisions Made

### Tech Stack (Final)

| Layer | Technology |
|-------|------------|
| Backend | Java 21 + Spring Boot 3 |
| Real-time | Spring WebSocket + STOMP |
| State sync | Redis |
| Database | PostgreSQL |
| Frontend | Vanilla JS or React (keep simple) |
| Containerization | Docker + Docker Compose |

### Why Java (not TypeScript or .NET)

- Singapore enterprise/fintech market favors Java + Spring Boot
- Shows Marcos can work beyond .NET ecosystem
- Banks and larger companies (target employers) prefer Java
- Spring WebSocket + STOMP is the Java standard for real-time

### What Transfers from Marcos's Experience

- Redis patterns - identical
- WebSocket concepts - same as SignalR (hubs → message brokers, groups → topics)
- Distributed systems thinking - directly applicable
- Docker - same

### What's New to Learn

- Spring Boot ecosystem (dependency injection, annotations)
- STOMP protocol (messaging over WebSockets)
- Java concurrency patterns (different from C# async/await)
- Maven or Gradle

## Timeline

- **Week 1**: Spring Boot basics, get WebSocket chat working
- **Week 2**: Add Redis, implement basic conflict resolution
- **Week 3**: Polish, document, handle edge cases
- **Week 4**: (Optional) Second project - Distributed Rate Limiter

## Second Project (After Editor)

**Distributed Rate Limiter** - API service enforcing rate limits across multiple server instances. Teaches distributed counting, sliding windows, coordination patterns.

## Task Tracking

Use a `TASKS.md` file in the repo root. Example structure:

```markdown
# Collaborative Editor - Tasks

## Current Sprint
- [ ] Set up Spring Boot project with WebSocket dependency
- [ ] Basic WebSocket connection working
- [ ] Simple chat message broadcast (proof of concept)

## Backlog
- [ ] Redis integration for session state
- [ ] Document model (how to represent text + cursors)
- [ ] Operational transformation logic
- [ ] Conflict resolution when two users edit same line
- [ ] Cursor position sync across clients
- [ ] Reconnection handling
- [ ] Basic frontend
- [ ] Docker Compose setup
- [ ] README with architecture diagram

## Done
- [x] Choose tech stack
- [x] Define project scope
```

Alternative: [Task Master](https://github.com/eyaltoledano/claude-task-master) for more structured AI-driven task management (install with `claude mcp add taskmaster-ai -- npx -y task-master-ai`). Probably overkill for this project.

## Key Concepts to Implement

### 1. Conflict Resolution

When two users edit the same text simultaneously, you need a strategy:

- **Operational Transformation (OT)**: Transform operations based on concurrent changes. Used by Google Docs.
- **CRDTs (Conflict-free Replicated Data Types)**: Data structures that automatically merge. Libraries: Yjs, Automerge.

For learning, implement a simplified OT or use last-write-wins initially, then improve.

### 2. Document Model

Decide how to represent the document:
- Simple: Array of lines, each line is a string
- Better: Tree of characters with unique IDs (needed for proper OT/CRDT)

### 3. WebSocket Architecture with STOMP

```
Client A ──┐                          ┌── Client A
           │    ┌──────────────┐      │
Client B ──┼───►│ Spring Boot  │◄─────┼── Client B
           │    │ + STOMP      │      │
Client C ──┘    │ + Redis      │      └── Client C
                └──────────────┘
                      │
                      ▼
                 PostgreSQL
```

- STOMP topics for document changes: `/topic/document/{docId}`
- Redis for scaling across multiple server instances
- PostgreSQL for persistence

## Interview Talking Points

When discussing this project, emphasize:

1. **Why you built it**: "I chose this to learn conflict resolution algorithms - a hard distributed systems problem"
2. **Trade-offs**: "I used [approach] for conflict resolution. At Google's scale they'd use [X], but for learning the coordination problems, this was sufficient"
3. **What would break at scale**: Show you understand limitations
4. **Architecture decisions**: Why STOMP, why Redis, why this document model

## Resources

- Spring WebSocket docs: https://docs.spring.io/spring-framework/reference/web/websocket.html
- STOMP protocol: https://stomp.github.io/
- Operational Transformation explained: https://operational-transformation.github.io/
- Yjs (CRDT library, for reference): https://github.com/yjs/yjs

## Next Steps for Claude Code

1. Create project directory structure
2. Initialize Spring Boot project with dependencies (spring-boot-starter-websocket, spring-boot-starter-data-redis, spring-boot-starter-data-jpa)
3. Create TASKS.md
4. Implement basic WebSocket echo server as first milestone
5. Iterate from there

---

*Handoff from Claude.ai conversation - November 2025*