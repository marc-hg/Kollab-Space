package com.marc_hg.kollabspace.features.chat;

import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Primary
public interface JpaChatRepository extends JpaRepository<ChatMessage, String>, ChatRepository {

    // Spring Data JPA will automatically implement this based on method name
    List<ChatMessage> findByRoomIdOrderByTimestampAsc(String roomId);

    // Implement interface methods
    @Override
    default List<ChatMessage> findByRoomId(String roomId) {
        return findByRoomIdOrderByTimestampAsc(roomId);
    }

    // save is inherited from JpaRepository
}