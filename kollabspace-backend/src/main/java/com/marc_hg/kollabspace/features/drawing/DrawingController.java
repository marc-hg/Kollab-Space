package com.marc_hg.kollabspace.features.drawing;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class DrawingController {
    private final DrawingService drawingService;

    public DrawingController(DrawingService drawingService) {
        this.drawingService = drawingService;
    }

    @MessageMapping("/canvas/{canvasId}/stroke")
    @SendTo("/topic/canvas/{canvasId}")
    public DrawingStrokeDTO addStroke(@DestinationVariable String canvasId, @Valid DrawingStrokeRequestDTO strokeRequest) {
        log.info("Received stroke request for canvas {}", canvasId);
        return drawingService.addStroke(strokeRequest);
    }

    @MessageMapping("/canvas/{canvasId}/delete")
    @SendTo("/topic/canvas/{canvasId}")
    public DeleteStrokeMessage deleteStroke(@DestinationVariable String canvasId, DeleteStrokeRequest request) {
        log.info("Deleting stroke {} from canvas {}", request.strokeId(), canvasId);
        drawingService.deleteStroke(request.strokeId(), canvasId);
        return new DeleteStrokeMessage(request.strokeId());
    }

    @MessageMapping("/canvas/{canvasId}/clear")
    @SendTo("/topic/canvas/{canvasId}")
    public ClearCanvasMessage clearCanvas(@DestinationVariable String canvasId) {
        log.info("Clearing canvas {}", canvasId);
        drawingService.clearCanvas(canvasId);
        return new ClearCanvasMessage(canvasId);
    }

    @GetMapping("/api/canvas/{canvasId}/strokes")
    public List<DrawingStrokeDTO> getStrokes(@PathVariable String canvasId) {
        log.info("Getting strokes for canvas {}", canvasId);
        return drawingService.getStrokes(canvasId);
    }

    // Helper records for delete and clear operations
    public record DeleteStrokeRequest(String strokeId) {}
    public record DeleteStrokeMessage(String strokeId) {}
    public record ClearCanvasMessage(String canvasId) {}
}