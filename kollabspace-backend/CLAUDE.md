# KollabSpace - Real-Time Collaborative Platform

## Project Overview

KollabSpace is a real-time collaborative editing platform built to demonstrate distributed systems concepts, WebSocket communication, and conflict resolution strategies. This is a portfolio project targeting the Singapore tech market, focusing on learning and showcasing:

- Real-time state synchronization
- Conflict resolution algorithms (OT/CRDTs)
- WebSocket scaling patterns
- Multiple collaboration paradigms

**Current Status:** Phases 1-4 complete (foundational infrastructure + collaborative document editing)
**Next Up:** Phase 5 - Real-time chat (easiest next feature)

---

## Technology Stack

### Backend
- **Java 21** - Modern Java with latest features
- **Spring Boot 4.0.0** - Application framework
- **Spring WebSocket** - WebSocket support
- **STOMP Protocol** - Messaging protocol over WebSocket
- **SockJS** - WebSocket fallback support
- **Lombok** - Code generation (@Data, @Slf4j, etc.)
- **Maven** - Dependency management

### Frontend (Test Clients)
- **Vanilla JavaScript** - No framework needed for testing
- **SockJS Client** - WebSocket client library
- **STOMP.js** - STOMP protocol client

### Future Additions
- **PostgreSQL** - Persistent storage (Phase 7)
- **Redis** - Distributed message broker for horizontal scaling (Phase 8)
- **Spring Data JPA** - Database ORM (Phase 7)

---

## Architecture Overview

### Current Architecture (Phases 1-4)

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Clients                         │
│                                                              │
│  Tab 1: test_collaborative_editor.html                       │
│  Tab 2: test_collaborative_editor.html                       │
│         (Connected to same document ID)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ WebSocket (STOMP over SockJS)
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Spring Boot Application                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │          WebSocketConfig                           │     │
│  │  - STOMP endpoint: /ws                             │     │
│  │  - Message broker: /topic/*                        │     │
│  │  - App destination: /app/*                         │     │
│  │  - CORS: Environment-aware (dev: *, prod: domain)  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │          DocumentController                        │     │
│  │  @MessageMapping("/document/{docId}/update")       │     │
│  │  @SendTo("/topic/document/{docId}")                │     │
│  │                                                     │     │
│  │  - Receives updates from clients                   │     │
│  │  - Broadcasts to all subscribers                   │     │
│  └──────────────┬─────────────────────────────────────┘     │
│                 │                                            │
│                 │ Calls                                      │
│                 ▼                                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │          DocumentService                           │     │
│  │  - ConcurrentHashMap<String, Document>             │     │
│  │  - Thread-safe in-memory storage                   │     │
│  │  - computeIfAbsent for atomic creation             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Package Structure (Feature-Based)

```
src/main/java/com/marc_hg/kollabspace/
├── config/
│   └── WebSocketConfig.java          # STOMP + WebSocket configuration
├── controller/
│   ├── DocumentController.java       # Document editing endpoints
│   └── HealthController.java         # REST health check
├── model/
│   └── Document.java                 # Document entity
├── service/
│   └── DocumentService.java          # Document business logic
└── handler/
    └── EchoWebSocketHandler.java     # Phase 2 echo (can be deleted)

src/main/resources/
├── application.properties             # Default config
├── application-dev.properties         # Dev overrides
└── application-prod.properties        # Prod overrides
```

**Design Decision:** Using feature-based organization. For this project size, controllers stay with features. If the project grows significantly, consider moving to Hexagonal/Ports & Adapters architecture.

---

## How Real-Time Collaboration Works

### 1. Connection Flow

```
Client                          Server
  │                               │
  │  Connect to /ws (SockJS)      │
  ├──────────────────────────────>│
  │                               │
  │  Subscribe to /topic/doc123   │
  ├──────────────────────────────>│
  │                               │
  │  Send to /app/doc123/get      │
  ├──────────────────────────────>│
  │                               │
  │  Receive current doc state    │
  │<───────────────────────────────┤
  │                               │
```

### 2. Update Flow (Debounced Auto-Save)

```
Tab 1                  Server                Tab 2
  │                      │                      │
  │ User types...        │                      │
  │ (500ms debounce)     │                      │
  │                      │                      │
  │ Send update          │                      │
  ├─────────────────────>│                      │
  │                      │                      │
  │                      │ Update storage       │
  │                      │ (ConcurrentHashMap)  │
  │                      │                      │
  │                      │ Broadcast to topic   │
  │                      ├─────────────────────>│
  │<─────────────────────┤                      │
  │ Receive own update   │ Receive update       │
  │ (updates editor)     │ (updates editor)     │
  │                      │                      │
```

### 3. STOMP Message Routing

**Client sends to:** `/app/document/{docId}/update`
**Server processes:** `@MessageMapping("/document/{docId}/update")`
**Server broadcasts to:** `/topic/document/{docId}` via `@SendTo`
**All subscribers receive:** Message on `/topic/document/{docId}`

**Key insight:** Document-specific topics (`/topic/document/{docId}`) allow multiple documents to be edited simultaneously without interference.

---

## Key Design Decisions & Trade-offs

### 1. ConcurrentHashMap vs HashMap
**Decision:** Use `ConcurrentHashMap<String, Document>`
**Why:** Thread-safe without external synchronization. Multiple WebSocket threads can access simultaneously.
**Trade-off:** Slightly slower than HashMap, but necessary for correctness.

### 2. STOMP over Raw WebSocket
**Decision:** Use STOMP protocol instead of raw WebSocket messages
**Why:**
- Built-in pub/sub pattern
- Topic-based routing
- Message acknowledgment support
- Less boilerplate code

**Trade-off:** Slightly more overhead, but massive developer productivity gain.

### 3. In-Memory Storage (Current) vs Database (Future)
**Decision:** Start with `ConcurrentHashMap`, add PostgreSQL in Phase 7
**Why:**
- Faster iteration during development
- No database setup required initially
- Easy to understand and debug

**Trade-off:** Data lost on server restart. Acceptable for learning project, not for production.

### 4. Full-Document Sync (Current) vs Operation-Based (Future)
**Decision:** Send entire document content on each change
**Why:** Simple to implement, works well for small documents
**Future:** Implement Operational Transformation (OT) in Phase 10 for character-level operations

**Trade-off:**
- ✅ Simple, easy to understand
- ❌ Inefficient for large documents
- ❌ No optimistic updates
- ❌ Bandwidth waste

### 5. Debounced Auto-Save (500ms)
**Decision:** Wait 500ms after user stops typing before broadcasting
**Why:**
- Reduces network traffic
- Feels like Google Docs
- Balances responsiveness vs efficiency

**Trade-off:** 500ms delay before other users see changes. Could be adjusted based on use case.

### 6. Environment-Aware CORS
**Decision:** Wildcard (`*`) in dev, specific domain in prod
**Why:** Developer experience (easy testing) + production security
**Implementation:** Spring profiles with `@Value("${websocket.allowed-origins}")`

### 7. Feature-Based Package Structure
**Decision:** Keep controllers with their features, not in separate layer
**Why:**
- Easier to find related code
- Better for vertical slicing
- Natural fit for microservices evolution

**Alternative considered:** Hexagonal architecture (Ports & Adapters). May refactor later if complexity grows.

---

## Collaboration Patterns (Current + Planned)

This project demonstrates **three different collaboration patterns**, each optimized for its data model:

### 1. Document Editing (CURRENT - Phase 4)
**Pattern:** Full-document sync → will evolve to Operational Transformation (OT)
**Use case:** Character-level text editing (like Google Docs)
**Conflict resolution:** Currently last-write-wins, will implement OT in Phase 10
**Complexity:** ⭐⭐⭐⭐ (OT is hard)

**How it works now:**
- Client sends entire document content
- Server broadcasts to all subscribers
- Each client replaces their editor content

**Future (OT):**
- Client sends operations (insert/delete at position)
- Server transforms operations based on concurrent edits
- Optimistic updates on client side

### 2. Chat (PLANNED - Phase 5)
**Pattern:** Append-only pub/sub
**Use case:** Messages are immutable, just append to history
**Conflict resolution:** None needed (messages don't conflict)
**Complexity:** ⭐ (easiest)

**How it will work:**
- Client sends ChatMessage (username, text, timestamp)
- Server appends to chat history
- Broadcasts to all subscribers
- No transformation needed

**Why it's easy:** Messages are independent and immutable. No position conflicts.

### 3. Drawing (PLANNED - Phase 6)
**Pattern:** Object-based sync with last-write-wins
**Use case:** Collaborative canvas (like Figma, Excalidraw)
**Conflict resolution:** Last-write-wins for stroke properties
**Complexity:** ⭐⭐ (medium)

**How it will work:**
- Each stroke has unique ID (UUID)
- Strokes are immutable (add or delete by ID)
- No position conflicts (objects are independent)
- Server maintains list of all strokes

**Why it's different from document editing:** Objects don't overlap in the data model. Two users can't edit the same stroke simultaneously.

---

## Running the Project

### Prerequisites
- Java 21 installed
- Maven installed (or use Maven wrapper)
- Port 8080 available

### Start the Server

**From terminal:**
```bash
./mvnw spring-boot:run
```

**From IntelliJ:**
1. Open `KollabSpaceApplication.java`
2. Click the green play button next to `public static void main`

**Verify it's running:**
```bash
curl http://localhost:8080/health
# Should return: {"status":"UP"}
```

### Test Collaborative Editing

1. Open `test_collaborative_editor.html` in two browser tabs (side-by-side recommended)
2. Keep the same Document ID in both (default: "doc123")
3. Click "Connect" in both tabs
4. Start typing in Tab 1
5. After 500ms of no typing, it auto-saves
6. Tab 2 updates automatically!

**Pro tip:** Press Ctrl+S to save immediately without waiting.

### Test Basic STOMP

1. Open `test_stomp.html` in two browser tabs
2. Click "Connect" in both
3. Send message from Tab 1
4. Tab 2 receives it (pub/sub pattern)

---

## Important Concepts for Development

### 1. Thread Safety
**Every** Spring WebSocket handler runs in a separate thread. Any shared state (like `DocumentService.documents`) **must** be thread-safe.

**Safe:**
```java
private final ConcurrentHashMap<String, Document> documents = new ConcurrentHashMap<>();
```

**Unsafe:**
```java
private final HashMap<String, Document> documents = new HashMap<>(); // ❌ Race conditions!
```

### 2. STOMP Routing
- `/app/*` → Application destination prefix (where clients send)
- `/topic/*` → Broker destination (where clients subscribe)
- `@MessageMapping("/document/{docId}/update")` → Handles `/app/document/{docId}/update`
- `@SendTo("/topic/document/{docId}")` → Broadcasts to subscribers

### 3. Dependency Injection
All beans are injected via constructor (recommended over field injection):

```java
@Controller
public class DocumentController {
    private final DocumentService documentService;

    // Spring automatically injects DocumentService
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }
}
```

### 4. Lombok Code Generation
- `@Data` → Generates getters, setters, toString, equals, hashCode
- `@Slf4j` → Generates `log` variable for logging
- `@NoArgsConstructor` / `@AllArgsConstructor` → Constructor generation

Enable annotation processing in IntelliJ: Settings → Build, Execution, Deployment → Compiler → Annotation Processors → Enable annotation processing

### 5. Spring Profiles
- Default: `application.properties`
- Dev: `application-dev.properties` (activated with `-Dspring.profiles.active=dev`)
- Prod: `application-prod.properties` (activated with `-Dspring.profiles.active=prod`)

Run with profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### 6. JavaScript Variable Scoping (Common Bug!)
**Never do this:**
```javascript
const document = JSON.parse(message.body); // ❌ Shadows global document!
```

**Do this instead:**
```javascript
const doc = JSON.parse(message.body); // ✅
```

---

## What's Been Built (Phases 1-4)

### Phase 1: Project Setup ✅
- Spring Boot project structure
- REST endpoint: `GET /health`
- Successfully runs on port 8080

### Phase 2: Basic WebSocket ✅
- WebSocket configuration with CORS
- Echo server handler (can be deleted now)
- Environment-aware configuration (dev vs prod)
- Proper logging with @Slf4j
- Error handling (handleTransportError)

### Phase 3: STOMP Integration ✅
- STOMP protocol over WebSocket
- Message broker with `/topic/*` prefix
- Pub/sub pattern working
- Test client: `test_stomp.html`

### Phase 4: Collaborative Document Editing ✅
- Document entity with id and content
- DocumentService with thread-safe storage
- DocumentController with @MessageMapping and @SendTo
- Document-specific topics: `/topic/document/{docId}`
- Debounced auto-save (500ms)
- Test client: `test_collaborative_editor.html`

**You can now edit documents in real-time across multiple browser tabs!**

---

## What's Next (Phase 5+)

See `TASKS.md` for complete roadmap, organized from easiest to hardest:

1. **Phase 5: Chat** (⭐ Easy, 1-2 hours) - Append-only pub/sub pattern
2. **Phase 6: Drawing** (⭐⭐ Medium, 3-4 hours) - Object-based sync
3. **Phase 7: PostgreSQL** (⭐⭐ Medium, 2-3 hours) - Persistent storage
4. **Phase 8: Redis** (⭐⭐⭐ Medium-Hard, 3-4 hours) - Distributed message broker for scaling
5. **Phase 9: Better UI** (⭐⭐ Medium, 4-6 hours) - Cursor positions, presence indicators
6. **Phase 10: Operational Transformation** (⭐⭐⭐⭐ Hard, 8-12 hours) - Character-level operations

---

## Interview Talking Points

**"I built a real-time collaboration platform to demonstrate different distributed systems patterns:"**

1. **Document Editing** → Full-document sync now, planning to implement OT for character-level operations (like Google Docs)

2. **Chat (upcoming)** → Append-only pub/sub (simplest, no conflict resolution needed)

3. **Drawing (upcoming)** → Object-based sync with last-write-wins (like Figma/Excalidraw)

**"Each pattern is optimized for its data model. This shows I understand when to use OT vs CRDT vs simple pub/sub based on the use case."**

**"I used Spring WebSocket with STOMP for the messaging layer, which provides built-in pub/sub support. The architecture is designed to scale horizontally by adding Redis as a distributed message broker (Phase 8)."**

**"I focused on thread safety from the start - using ConcurrentHashMap for shared state and understanding that each WebSocket connection runs in a separate thread."**

---

## Common Issues & Solutions

### Issue: DataSource Configuration Error
**Error:** `Failed to configure a DataSource`
**Cause:** JPA/PostgreSQL dependencies included but not configured
**Fix:** Dependencies commented out in `pom.xml` (lines 33-69). Will uncomment in Phase 7.

### Issue: CORS Blocking WebSocket
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
**Cause:** Opening HTML as `file://` sends `Origin: null`
**Fix:** Use `setAllowedOriginPatterns("*")` instead of `setAllowedOrigins("*")`

### Issue: Messages Not Received
**Cause:** Path mismatch between `@MessageMapping` and client send
**Fix:** Ensure paths match exactly (watch for plural vs singular!)

### Issue: `document.getElementById is not a function`
**Cause:** Variable shadowing - `const document = ...` shadows global object
**Fix:** Use different variable name like `const doc = ...`

### Issue: Lombok `log` not recognized
**Cause:** Annotation processing not enabled in IntelliJ
**Fix:** Settings → Compiler → Annotation Processors → Enable

---

## Resources & References

- **STOMP Protocol:** https://stomp.github.io/
- **Spring WebSocket Docs:** https://docs.spring.io/spring-framework/reference/web/websocket.html
- **Operational Transformation:** https://operational-transformation.github.io/
- **Yjs (CRDT):** https://github.com/yjs/yjs
- **Excalidraw Architecture:** https://blog.excalidraw.com/building-excalidraw/

---

## Project Goals Recap

This is a **learning and portfolio project**, not a production application. Goals:

1. ✅ Demonstrate real-time WebSocket communication
2. ✅ Show understanding of pub/sub patterns
3. ✅ Practice thread-safe concurrent programming
4. 🔄 Implement multiple collaboration patterns (chat, drawing, document editing)
5. 🔄 Understand conflict resolution (OT/CRDTs)
6. 🔄 Demonstrate horizontal scaling with Redis

**Target audience:** Technical interviewers in Singapore tech market
**Complexity level:** Intermediate to advanced backend engineering

---

**Last updated:** End of Phase 4 (Collaborative Document Editing)
**Status:** ✅ Real-time editing works! Debounced auto-save implemented!
**Next milestone:** Phase 5 - Add real-time chat feature
