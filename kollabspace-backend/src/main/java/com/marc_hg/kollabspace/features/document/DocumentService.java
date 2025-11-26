package com.marc_hg.kollabspace.features.document;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class DocumentService {
    private final ConcurrentHashMap<String, Document> documents = new ConcurrentHashMap<>();

    public Document getDocument(String id) {
        return documents.computeIfAbsent(id, Key -> {
            log.info("Creating new document with id {}", Key);
            return new Document(Key, "");
        });
    }

    public Document updateDocument(String id, String content) {
        Document document = getDocument(id);
        document.setContent(content);
        log.info("Updated document with id {}", id);
        return document;
    }
}
