package com.marc_hg.kollabspace.features.document;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @Column(name = "id", nullable = false, length = 255)
    private String id;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
}
