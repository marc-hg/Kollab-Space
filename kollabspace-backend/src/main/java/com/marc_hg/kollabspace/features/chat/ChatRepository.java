package com.marc_hg.kollabspace.features.chat;

import java.util.List;

public interface ChatRepository {
    ChatMessage save(ChatMessage message);
    List<ChatMessage> findByRoomId(String roomId);
}
