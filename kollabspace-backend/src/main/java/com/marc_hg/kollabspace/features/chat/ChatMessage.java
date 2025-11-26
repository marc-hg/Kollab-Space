package com.marc_hg.kollabspace.features.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String id;
    private String roomId;
    private String userName;
    private String text;
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
