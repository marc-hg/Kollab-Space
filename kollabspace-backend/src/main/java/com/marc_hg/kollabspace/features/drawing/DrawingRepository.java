package com.marc_hg.kollabspace.features.drawing;

import java.util.List;
import java.util.Optional;

public interface DrawingRepository {
    DrawingStroke save(DrawingStroke stroke);
    List<DrawingStroke> findByCanvasId(String canvasId);
    Optional<DrawingStroke> findById(String id);
    void deleteById(String id, String canvasId);
    void clearCanvas(String canvasId);
}