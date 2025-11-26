package com.marc_hg.kollabspace.features.chat;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, @Valid ChatMessageRequestDTO chatMessageRequestDTO) {
        log.info("Received message {} in room {}", chatMessageRequestDTO, roomId);
        return chatService.addMessage(roomId, chatMessageRequestDTO);
    }

    @GetMapping("/api/chat/{roomId}/history")
    public List<ChatMessage> getChatHistory(@PathVariable String roomId) {
        log.info("Getting chat history for room {}", roomId);
        return chatService.getMessages(roomId);
    }
}
