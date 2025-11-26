package com.marc_hg.kollabspace.features.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class MessageController {
    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public String handleMessages(String message) {
        log.info("Received message: {}", message);
        return "Echo: " + message;
    }
}
