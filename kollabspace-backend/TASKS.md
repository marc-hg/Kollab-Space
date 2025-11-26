# Collaborative Platform - Tasks

**Reorganized from Easiest → Hardest**

Build momentum with quick wins, then tackle harder features!

---

## ✅ COMPLETED

### Phase 1: Project Setup
- [x] Create Spring Boot project structure
- [x] Verify project runs
- [x] Create simple REST endpoint (GET /health)

### Phase 2: Basic WebSocket (Echo Server)
- [x] Create WebSocket configuration class
- [x] Create a simple WebSocket handler
- [x] Test connection and echo messages
- [x] Replace System.out.println with proper logging (@Slf4j)
- [x] Environment-aware CORS config (dev vs prod profiles)
- [x] Make handler a Spring bean (dependency injection)
- [x] Add basic error handling (handleTransportError)

### Phase 3: STOMP Integration
- [x] Add STOMP protocol support to WebSocket config
- [x] Create message broker endpoints
- [x] Test pub/sub pattern (one client sends, all receive)
- [x] Create a topic for document updates: `/topic/document/{docId}`

### Phase 4: Collaborative Document Editing
- [x] Define Document entity (id, content as String)
- [x] Store document in memory (ConcurrentHashMap)
- [x] Broadcast text changes to all connected clients
- [x] Test with 2 browser tabs editing same document
- [x] Add debounced auto-save (500ms delay)

---

## 🚀 NEXT UP (Ordered by Difficulty)

### Phase 5: Real-Time Chat (EASIEST - Do Next!)
**Difficulty:** ⭐ Easy | **Why:** You already have pub/sub working, just add append-only messages

#### Backend
- [ ] Create ChatMessage model (id, username, text, timestamp)
- [ ] Create ChatService (store messages in memory with max size limit)
- [ ] Create ChatController with @MessageMapping
- [ ] Broadcast to `/topic/chat/{roomId}`
- [ ] Add GET endpoint to fetch chat history

#### Frontend
- [ ] Create chat UI (message list + input box)
- [ ] Subscribe to chat topic
- [ ] Display messages with username and timestamp
- [ ] Auto-scroll to latest message
- [ ] Show "user is typing..." indicator (optional)

#### Enhancements (Optional)
- [ ] Add message reactions (emoji)
- [ ] Add @mentions
- [ ] Add timestamps ("5 minutes ago")
- [ ] Add unread message count

**Interview talking point:** "Chat demonstrates append-only pub/sub. No OT/CRDT needed since messages are immutable."

---

### Phase 6: Collaborative Drawing (MEDIUM)
**Difficulty:** ⭐⭐ Medium | **Why:** Requires canvas rendering, but simpler conflict resolution than OT

#### Backend - Drawing Model
- [ ] Create DrawingStroke model (id, type, points[], color, width, userId)
- [ ] Create DrawingService (store strokes per canvas)
- [ ] Create DrawingController
- [ ] Broadcast to `/topic/canvas/{canvasId}`
- [ ] Support operations: add stroke, delete stroke, clear canvas

#### Frontend - Canvas Setup
- [ ] Create HTML5 Canvas element
- [ ] Implement mouse/touch drawing (capture stroke paths)
- [ ] Subscribe to `/topic/canvas/{canvasId}`
- [ ] Render all strokes on canvas
- [ ] Add color picker and brush size controls

#### Real-Time Sync
- [ ] Send stroke as it's being drawn (streaming points)
- [ ] Receive and render other users' strokes in real-time
- [ ] Show different colors per user
- [ ] Add drawing tools: pen, eraser, line, rectangle, circle

#### Conflict Resolution Strategy
- [ ] Each stroke has unique ID (UUID)
- [ ] Strokes are immutable (add-only, or delete by ID)
- [ ] Last-write-wins for properties
- [ ] No position conflicts (objects are independent)

#### Advanced Features (Optional)
- [ ] Undo/redo functionality
- [ ] Export canvas to PNG
- [ ] Show live cursors of other users
- [ ] Zoom and pan

**Interview talking point:** "Drawing uses object-based sync like Figma. Strokes are independent, so we use last-write-wins instead of OT."

**Resources:**
- HTML5 Canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- Excalidraw: https://blog.excalidraw.com/building-excalidraw/

---

### Phase 7: PostgreSQL Persistence (MEDIUM)
**Difficulty:** ⭐⭐ Medium | **Why:** Standard Spring Data JPA, well-documented

- [ ] Uncomment JPA dependencies in pom.xml
- [ ] Add PostgreSQL driver dependency
- [ ] Configure database connection in application.properties
- [ ] Add JPA annotations to Document model (@Entity, @Id, @GeneratedValue)
- [ ] Create DocumentRepository interface (extends JpaRepository)
- [ ] Update DocumentService to use repository (save on updates, load on get)
- [ ] Set up PostgreSQL with Docker Compose
- [ ] Test: Restart server, verify documents persist
- [ ] Add created_at and updated_at timestamps
- [ ] Handle database errors gracefully

**Interview talking point:** "Added PostgreSQL for persistence. Documents now survive server restarts. Used Spring Data JPA for simplicity."

---

### Phase 8: Redis for Scaling (MEDIUM-HARD)
**Difficulty:** ⭐⭐⭐ Medium-Hard | **Why:** Distributed state coordination across multiple servers

- [ ] Uncomment Redis dependency in pom.xml
- [ ] Configure Redis connection in application.properties
- [ ] Set up Redis with Docker Compose
- [ ] Configure STOMP to use Redis message broker (instead of in-memory)
- [ ] Test with 2 Spring Boot instances (ports 8080, 8081)
- [ ] Verify: User on :8080 sees changes from user on :8081
- [ ] Add Redis for session storage (optional)
- [ ] Add Redis for caching frequently accessed documents (optional)

**Interview talking point:** "Added Redis to coordinate state across multiple server instances. This demonstrates horizontal scaling - the same pattern Google Docs uses."

---

### Phase 9: Better Frontend & UX (MEDIUM)
**Difficulty:** ⭐⭐ Medium | **Why:** UI/UX work, no complex algorithms

- [ ] Create unified dashboard (document list + chat + drawing)
- [ ] Show cursor positions of other users in document editor
- [ ] Add user names and colors for each connected user
- [ ] Handle reconnection gracefully (detect disconnects, auto-reconnect)
- [ ] Add "saved" / "saving..." indicator
- [ ] Show who's currently editing (presence indicators)
- [ ] Add loading states for initial document load
- [ ] Improve mobile responsiveness

---

### Phase 10: Operational Transformation (HARDEST)
**Difficulty:** ⭐⭐⭐⭐ Hard | **Why:** Complex algorithm, character-level operations

**Goal:** Move from full-document syncing to operation-based updates (like Google Docs)

#### Step 1: Operation Model
- [ ] Create Operation model (type: insert/delete, position, text, timestamp)
- [ ] Change from sending full content to sending operations
- [ ] Update DocumentController to handle operations instead of full text

#### Step 2: Version Tracking
- [ ] Add version number to Document model
- [ ] Track base version in operations
- [ ] Increment version on each change
- [ ] Handle version conflicts

#### Step 3: Basic OT Algorithm
- [ ] Research: Read about Operational Transformation
- [ ] Implement transform function for insert-insert conflicts
- [ ] Implement transform function for insert-delete conflicts
- [ ] Implement transform function for delete-delete conflicts
- [ ] Handle position transformation based on concurrent operations

#### Step 4: Client-Side Improvements
- [ ] Add optimistic updates (show changes immediately)
- [ ] Track pending operations on client
- [ ] Handle operation acknowledgment from server
- [ ] Rollback if server rejects operation

#### Step 5: Alternative Approach (Optional)
- [ ] Research CRDTs (Conflict-free Replicated Data Types)
- [ ] Consider using Yjs or Automerge library
- [ ] Compare OT vs CRDT trade-offs

**Resources:**
- OT explanation: https://operational-transformation.github.io/
- Yjs (CRDT): https://github.com/yjs/yjs
- Google Wave OT: https://svn.apache.org/repos/asf/incubator/wave/whitepapers/operational-transform/operational-transform.html

---

## 🔒 Production Features (Add When Polishing)

### Phase 11: OAuth Google Authentication (MEDIUM)
**Difficulty:** ⭐⭐ Medium | **Why:** Spring Security OAuth2 is well-documented, but requires Google Cloud setup

#### Google OAuth Setup
- [ ] Create project in Google Cloud Console
- [ ] Configure OAuth2 consent screen
- [ ] Create OAuth2 credentials (client ID + secret)
- [ ] Add authorized redirect URIs

#### Backend - Spring Security OAuth2
- [ ] Add Spring Security OAuth2 Client dependency
- [ ] Configure OAuth2 properties (client-id, client-secret, redirect-uri)
- [ ] Create SecurityConfig with OAuth2 login
- [ ] Protect WebSocket endpoints (only authenticated users)
- [ ] Store user session (username, email, profile picture)

#### Frontend - Login Flow
- [ ] Add "Sign in with Google" button
- [ ] Redirect to Google OAuth consent screen
- [ ] Handle OAuth callback
- [ ] Display user info (profile picture, name)
- [ ] Add logout button

#### User Association
- [ ] Associate documents with user ID (who created it)
- [ ] Associate chat messages with authenticated user
- [ ] Associate drawing strokes with user ID
- [ ] Show real usernames instead of "User123"

#### Permissions (Optional)
- [ ] Document ownership (only owner can delete)
- [ ] Private vs public documents
- [ ] Invite-only rooms

**Interview talking point:** "Added OAuth Google login for authentication. Users can sign in with their Google account, and all actions are tied to their identity."

### Phase 12: Additional Security
- [ ] Validate user permissions per document/room
- [ ] Secure WebSocket connections (wss://)
- [ ] Add CSRF protection
- [ ] Rate limiting per user
- [ ] Input sanitization (prevent XSS)

### Phase 12: Resilience & Performance
- [ ] Add message size limits (prevent huge payloads)
- [ ] Add basic input validation (check message format/content)
- [ ] Add connection limits (max concurrent connections)
- [ ] Implement graceful shutdown (close connections cleanly)
- [ ] Add heartbeat/ping-pong (detect dead connections)
- [ ] Connection pooling and resource limits

### Phase 13: Observability
- [ ] Add metrics (Micrometer + Prometheus)
- [ ] Track: active connections, messages/sec, errors
- [ ] Add health checks for /actuator/health
- [ ] Structured logging with trace IDs
- [ ] Add distributed tracing (Zipkin/Jaeger)

### Phase 14: Testing
- [ ] Unit tests for services
- [ ] Integration tests for WebSocket connections
- [ ] Load testing (JMeter or Gatling)
- [ ] Test failure scenarios (network errors, timeouts)

---

## 📦 Deployment

### Phase 15: Containerization
- [ ] Create Dockerfile for Spring Boot app
- [ ] Create docker-compose.yml (app + Redis + PostgreSQL)
- [ ] Test entire stack with `docker-compose up`
- [ ] Add environment variable configuration
- [ ] Optimize Docker image size (multi-stage build)

### Phase 16: Documentation
- [ ] Create comprehensive README
- [ ] Add architecture diagram (show WebSocket, Redis, PostgreSQL)
- [ ] Document how to run the project locally
- [ ] Document API endpoints
- [ ] Write about design decisions & trade-offs
- [ ] Prepare interview talking points
- [ ] Add screenshots/GIFs of features

---

## 📊 Current Progress

**Completed:** Phases 1-4 ✅

**You now have:**
- ✅ Spring Boot + WebSocket + STOMP setup
- ✅ Real-time collaborative document editing
- ✅ Debounced auto-save (feels like Google Docs!)
- ✅ Document-specific pub/sub topics

**Next:** Phase 5 - Real-Time Chat (easiest next step!)

---

## 🎯 Portfolio Value by Phase

| Phase | Complexity | Interview Impact | Build Time |
|-------|------------|------------------|------------|
| **Chat** | ⭐ Easy | Medium | 1-2 hours |
| **Drawing** | ⭐⭐ Medium | High | 3-4 hours |
| **PostgreSQL** | ⭐⭐ Medium | Medium | 2-3 hours |
| **Redis** | ⭐⭐⭐ Medium-Hard | **Very High** | 3-4 hours |
| **Better UI** | ⭐⭐ Medium | Medium | 4-6 hours |
| **OT** | ⭐⭐⭐⭐ Hard | **Very High** | 8-12 hours |

**Recommended order:** Chat → Drawing → PostgreSQL → Redis → UI → OT

---

## 💡 Why This Order?

1. **Chat (easiest):** Quick win, demonstrates append-only pattern
2. **Drawing:** Shows object-based sync (different from text), impressive visually
3. **PostgreSQL:** Standard CRUD, adds persistence
4. **Redis:** Shows you understand distributed systems (big interview win!)
5. **Better UI:** Polish what you have, make it demo-ready
6. **OT:** Final boss - shows deep understanding of conflict resolution

**With Chat + Drawing + Document editing, you demonstrate ALL major collaboration patterns!**

---

## 🗣️ Interview Talking Points

**"I built a real-time collaboration platform with three different features to showcase different collaboration patterns:"**

1. **Document Editing** → Uses full-document sync now, will implement OT for character-level ops
2. **Chat** → Append-only pub/sub (simplest, no conflict resolution needed)
3. **Drawing** → Object-based sync with last-write-wins (like Figma/Excalidraw)

**"Each pattern is optimized for its data model. This shows I understand when to use OT vs CRDT vs simple pub/sub based on the use case."**

**"I used Redis to coordinate state across multiple server instances, demonstrating horizontal scaling. The architecture supports millions of users by adding more servers."**
