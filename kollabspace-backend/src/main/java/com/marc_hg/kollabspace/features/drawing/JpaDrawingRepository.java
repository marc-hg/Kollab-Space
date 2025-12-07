package com.marc_hg.kollabspace.features.drawing;

import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public interface JpaDrawingRepository extends JpaRepository<DrawingStroke, String>, DrawingRepository {

    // Spring Data JPA will automatically implement this based on method name
    List<DrawingStroke> findByCanvasIdOrderByTimestampAsc(String canvasId);

    // Implement interface methods
    @Override
    default List<DrawingStroke> findByCanvasId(String canvasId) {
        return findByCanvasIdOrderByTimestampAsc(canvasId);
    }

    @Override
    @Transactional
    @Modifying
    @Query("DELETE FROM DrawingStroke d WHERE d.id = :id AND d.canvasId = :canvasId")
    void deleteById(String id, String canvasId);

    @Override
    @Transactional
    @Modifying
    @Query("DELETE FROM DrawingStroke d WHERE d.canvasId = :canvasId")
    void clearCanvas(String canvasId);

    // findById and save are inherited from JpaRepository
}