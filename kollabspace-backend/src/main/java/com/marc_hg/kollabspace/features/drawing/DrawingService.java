package com.marc_hg.kollabspace.features.drawing;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DrawingService {
    private final DrawingRepository drawingRepository;

    public DrawingService(DrawingRepository drawingRepository) {
        this.drawingRepository = drawingRepository;
    }

    public List<DrawingStrokeDTO> getStrokes(String canvasId) {
        log.info("Getting strokes for canvas {}", canvasId);
        return drawingRepository.findByCanvasId(canvasId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DrawingStrokeDTO addStroke(DrawingStrokeRequestDTO request) {
        log.info("Adding stroke to canvas {}", request.getCanvasId());
        DrawingStroke entity = new DrawingStroke();
        entity.setId(UUID.randomUUID().toString());
        entity.setCanvasId(request.getCanvasId());
        entity.setPoints(request.getPoints());
        entity.setColor(request.getColor());
        entity.setWidth(request.getWidth());
        entity.setUserId(request.getUserId());
        entity.setTimestamp(System.currentTimeMillis());

        drawingRepository.save(entity);
        return toDTO(entity);
    }

    public void deleteStroke(String strokeId, String canvasId) {
        log.info("Deleting stroke {} from canvas {}", strokeId, canvasId);
        drawingRepository.deleteById(strokeId, canvasId);
    }

    public void clearCanvas(String canvasId) {
        log.info("Clearing canvas {}", canvasId);
        drawingRepository.clearCanvas(canvasId);
    }

    private DrawingStrokeDTO toDTO(DrawingStroke entity) {
        return new DrawingStrokeDTO(
                entity.getId(),
                entity.getCanvasId(),
                entity.getPoints(),
                entity.getColor(),
                entity.getWidth(),
                entity.getUserId(),
                entity.getTimestamp()
        );
    }


}