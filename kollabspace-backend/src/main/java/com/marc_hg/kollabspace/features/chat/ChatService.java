package com.marc_hg.kollabspace.features.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Singleton
@Slf4j
public class ChatService {
    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public List<ChatMessage> getMessages(String roomId) {
        log.info("Getting messages for room {}", roomId);
        return chatRepository.findByRoomId(roomId);
    }

    public ChatMessage addMessage(String roomId, ChatMessageRequestDTO messageRequestDTO) {
        log.info("Adding message {} to room {}", messageRequestDTO, roomId);
        ChatMessage message = ChatMessage.create(roomId, messageRequestDTO);
        chatRepository.save(message);
        return message;
    }
}
