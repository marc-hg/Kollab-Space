package com.marc_hg.kollabspace.features.document;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository("inMemoryDocumentRepository")
@Slf4j
public class InMemoryDocumentRepository implements DocumentRepository {
    private final ConcurrentHashMap<String, Document> documents = new ConcurrentHashMap<>();

    @Override
    public Optional<Document> findById(String id) {
        log.info("Finding document with id {}", id);
        return Optional.ofNullable(documents.get(id));
    }

    @Override
    public Document save(Document document) {
        log.info("Saving document with id {}", document.getId());
        documents.put(document.getId(), document);
        return document;
    }
}