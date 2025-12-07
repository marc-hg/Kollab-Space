package com.marc_hg.kollabspace.features.drawing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingStrokeDTO {
    private String id;
    private String canvasId;
    private List<Point> points;
    private String color;
    private double width;
    private String userId;
    private long timestamp;
}