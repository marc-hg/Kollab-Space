-- V1__Initial_schema.sql
-- KollabSpace Initial Database Schema
-- Created: 2025-12-06

-- ============================================
-- Documents Table
-- ============================================
CREATE TABLE documents (
    id VARCHAR(255) PRIMARY KEY,
    content TEXT
);

CREATE INDEX idx_documents_id ON documents(id);

COMMENT ON TABLE documents IS 'Stores collaborative document content';
COMMENT ON COLUMN documents.id IS 'Unique document identifier';
COMMENT ON COLUMN documents.content IS 'Document text content';

-- ============================================
-- Chat Messages Table
-- ============================================
CREATE TABLE chat_messages (
    id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    timestamp BIGINT NOT NULL
);

CREATE INDEX idx_chat_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_room_timestamp ON chat_messages(room_id, timestamp);

COMMENT ON TABLE chat_messages IS 'Stores chat messages for collaborative rooms';
COMMENT ON COLUMN chat_messages.id IS 'Unique message identifier (UUID)';
COMMENT ON COLUMN chat_messages.room_id IS 'Chat room identifier';
COMMENT ON COLUMN chat_messages.user_name IS 'Display name of message sender';
COMMENT ON COLUMN chat_messages.text IS 'Message content';
COMMENT ON COLUMN chat_messages.timestamp IS 'Unix timestamp in milliseconds';

-- ============================================
-- Drawing Strokes Table
-- ============================================
CREATE TABLE drawing_strokes (
    id VARCHAR(255) PRIMARY KEY,
    canvas_id VARCHAR(255) NOT NULL,
    color VARCHAR(20) NOT NULL,
    width DOUBLE PRECISION NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL
);

CREATE INDEX idx_drawing_canvas_id ON drawing_strokes(canvas_id);
CREATE INDEX idx_drawing_timestamp ON drawing_strokes(timestamp);
CREATE INDEX idx_drawing_canvas_timestamp ON drawing_strokes(canvas_id, timestamp);

COMMENT ON TABLE drawing_strokes IS 'Stores drawing strokes for collaborative canvases';
COMMENT ON COLUMN drawing_strokes.id IS 'Unique stroke identifier (UUID)';
COMMENT ON COLUMN drawing_strokes.canvas_id IS 'Canvas identifier';
COMMENT ON COLUMN drawing_strokes.color IS 'Stroke color in hex format (e.g., #FF5733)';
COMMENT ON COLUMN drawing_strokes.width IS 'Stroke width in pixels';
COMMENT ON COLUMN drawing_strokes.user_id IS 'User who created the stroke';
COMMENT ON COLUMN drawing_strokes.timestamp IS 'Unix timestamp in milliseconds';

-- ============================================
-- Stroke Points Table (ElementCollection for DrawingStroke.points)
-- ============================================
CREATE TABLE stroke_points (
    stroke_id VARCHAR(255) NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    CONSTRAINT fk_stroke_points_stroke FOREIGN KEY (stroke_id)
        REFERENCES drawing_strokes(id) ON DELETE CASCADE
);

CREATE INDEX idx_stroke_points_stroke_id ON stroke_points(stroke_id);

COMMENT ON TABLE stroke_points IS 'Stores individual points for each drawing stroke';
COMMENT ON COLUMN stroke_points.stroke_id IS 'Reference to parent stroke';
COMMENT ON COLUMN stroke_points.x IS 'X coordinate (integer)';
COMMENT ON COLUMN stroke_points.y IS 'Y coordinate (integer)';

-- ============================================
-- Initial Data (Optional)
-- ============================================
-- Insert a welcome document
INSERT INTO documents (id, content) VALUES
    ('welcome', 'Welcome to KollabSpace! Start editing this document in real-time with others.');

-- Insert a welcome message
INSERT INTO chat_messages (id, room_id, user_name, text, timestamp) VALUES
    (gen_random_uuid()::text, 'lobby', 'System', 'Welcome to KollabSpace Chat!', extract(epoch from now()) * 1000);