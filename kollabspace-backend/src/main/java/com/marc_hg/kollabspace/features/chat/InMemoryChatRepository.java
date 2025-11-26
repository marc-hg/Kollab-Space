package com.marc_hg.kollabspace.features.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
@Slf4j
@Primary
public class InMemoryChatRepository implements ChatRepository {
    private static final int MAX_MESSAGES_PER_ROOM = 100;

    private final ConcurrentHashMap<String, List<ChatMessage>> messages = new ConcurrentHashMap<>();

    @Override
    public void save(ChatMessage message) {
        log.info("Saving message {}", message);
        List<ChatMessage> roomMessages = findByRoomId(message.getRoomId());
        roomMessages.add(message);

        // Remove oldest if over limit
        if (roomMessages.size() > MAX_MESSAGES_PER_ROOM) {
            roomMessages.removeFirst();
            log.info("Removed oldest message from room {} (limit: {})",
                    message.getRoomId(), MAX_MESSAGES_PER_ROOM);
        }
    }

    @Override
    public List<ChatMessage> findByRoomId(String roomId) {
        return messages.computeIfAbsent(roomId, Key -> {
            log.info("Creating new room {}", Key);
            return new CopyOnWriteArrayList<>();
        });
    }
}
