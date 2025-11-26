package com.marc_hg.kollabspace.features.chat;

import java.util.List;

public interface ChatRepository {
    void save(ChatMessage message);
    List<ChatMessage> findByRoomId(String roomId);
}
