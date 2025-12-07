package com.marc_hg.kollabspace.features.drawing;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository("inMemoryDrawingRepository")
@Slf4j
public class InMemoryDrawingRepository implements DrawingRepository {
    private static final int MAX_STROKES_PER_CANVAS = 1000;

    private final ConcurrentHashMap<String, List<DrawingStroke>> canvasStrokes = new ConcurrentHashMap<>();

    @Override
    public DrawingStroke save(DrawingStroke stroke) {
        log.info("Saving stroke {} to canvas {}", stroke.getId(), stroke.getCanvasId());
        List<DrawingStroke> strokes = findByCanvasId(stroke.getCanvasId());
        strokes.add(stroke);

        // Remove oldest strokes if over limit
        if (strokes.size() > MAX_STROKES_PER_CANVAS) {
            strokes.removeFirst();
            log.info("Removed oldest stroke from canvas {} (limit: {})",
                    stroke.getCanvasId(), MAX_STROKES_PER_CANVAS);
        }
        return stroke;
    }

    @Override
    public List<DrawingStroke> findByCanvasId(String canvasId) {
        return canvasStrokes.computeIfAbsent(canvasId, key -> {
            log.info("Creating new canvas {}", key);
            return new CopyOnWriteArrayList<>();
        });
    }

    @Override
    public Optional<DrawingStroke> findById(String id) {
        return canvasStrokes.values().stream()
                .flatMap(List::stream)
                .filter(stroke -> stroke.getId().equals(id))
                .findFirst();
    }

    @Override
    public void deleteById(String id, String canvasId) {
        List<DrawingStroke> strokes = findByCanvasId(canvasId);
        strokes.removeIf(stroke -> stroke.getId().equals(id));
        log.info("Deleted stroke {} from canvas {}", id, canvasId);
    }

    @Override
    public void clearCanvas(String canvasId) {
        canvasStrokes.remove(canvasId);
        log.info("Cleared canvas {}", canvasId);
    }
}