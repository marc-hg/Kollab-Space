package com.marc_hg.kollabspace.features.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequestDTO {
    @NotBlank(message = "Username cannot be empty")
    @Size(max = 50, message = "Username too long (max 50 chars)")
    private String userName;

    @NotBlank(message = "Message text cannot be empty")
    @Size(max = 1000, message = "Message too long (max 1000 chars)")
    private String text;
}
