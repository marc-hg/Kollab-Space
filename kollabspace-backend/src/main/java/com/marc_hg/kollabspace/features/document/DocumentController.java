package com.marc_hg.kollabspace.features.document;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class DocumentController {
    private final DocumentService documentService;
    
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }
    
    @MessageMapping("/document/{docId}/update")
    @SendTo("/topic/document/{docId}")
    public Document updateDocument(@DestinationVariable String docId, String content) {
        log.info("Updating document with id {}", docId);
        return documentService.updateDocument(docId, content);
    }
    
    @MessageMapping("/document/{docId}/get")
    @SendTo("/topic/document/{docId}")
    public Document getDocument(@DestinationVariable String docId) {
        log.info("Getting document with id {}", docId);
        return documentService.getDocument(docId);
    }
}
