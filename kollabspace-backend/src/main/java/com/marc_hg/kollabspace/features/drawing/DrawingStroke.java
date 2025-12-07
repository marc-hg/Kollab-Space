package com.marc_hg.kollabspace.features.drawing;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "drawing_strokes", indexes = {
    @Index(name = "idx_canvas_id", columnList = "canvas_id"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingStroke {
    @Id
    @Column(name = "id", nullable = false, length = 255)
    private String id;

    @Column(name = "canvas_id", nullable = false, length = 255)
    private String canvasId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Point> points;

    @Column(name = "color", nullable = false, length = 20)
    private String color;

    @Column(name = "width", nullable = false)
    private double width;

    @Column(name = "user_id", nullable = false, length = 255)
    private String userId;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;
}
