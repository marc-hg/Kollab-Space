package com.marc_hg.kollabspace.features.chat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_room_id", columnList = "room_id"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @Column(name = "id", nullable = false, length = 255)
    private String id;

    @Column(name = "room_id", nullable = false, length = 255)
    private String roomId;

    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    @Column(name = "text", nullable = false, length = 1000)
    private String text;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;

    public static ChatMessage create(String roomId, ChatMessageRequestDTO dto) {
        return new ChatMessage(
                UUID.randomUUID().toString(),
                roomId,
                dto.getUserName(),
                dto.getText(),
                System.currentTimeMillis()
        );
    }
}
