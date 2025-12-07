package com.marc_hg.kollabspace.features.document;

import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Primary
public interface JpaDocumentRepository extends JpaRepository<Document, String>, DocumentRepository {

    // findById and save are inherited from JpaRepository
    // They already match our DocumentRepository interface
}