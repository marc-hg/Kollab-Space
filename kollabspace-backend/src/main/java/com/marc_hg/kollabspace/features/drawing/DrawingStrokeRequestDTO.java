package com.marc_hg.kollabspace.features.drawing;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingStrokeRequestDTO {
    @NotBlank(message = "Canvas ID cannot be empty")
    private String canvasId;

    @NotEmpty(message = "Points array cannot be empty")
    private List<Point> points;

    @NotBlank(message = "Color cannot be empty")
    private String color;

    @NotNull(message = "Width cannot be null")
    private Double width;

    @NotBlank(message = "User ID cannot be empty")
    private String userId;
}