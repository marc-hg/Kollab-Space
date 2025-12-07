package com.marc_hg.kollabspace.features.document;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Document getDocument(String id) {
        return documentRepository.findById(id).orElseGet(() -> {
            log.info("Creating new document with id {}", id);
            Document newDocument = new Document(id, "");
            return documentRepository.save(newDocument);
        });
    }

    public Document updateDocument(String id, String content) {
        Document document = getDocument(id);
        document.setContent(content);
        log.info("Updated document with id {}", id);
        return documentRepository.save(document);
    }
}
