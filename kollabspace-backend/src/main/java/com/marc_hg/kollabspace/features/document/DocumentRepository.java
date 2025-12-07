package com.marc_hg.kollabspace.features.document;

import java.util.Optional;

public interface DocumentRepository {
    Optional<Document> findById(String id);
    Document save(Document document);
}