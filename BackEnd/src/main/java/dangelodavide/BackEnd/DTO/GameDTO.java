package dangelodavide.BackEnd.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GameDTO(
        Long id,
        String name,
        String description,
        String released,
        @JsonProperty("background_image") String backgroundImage,
        Double rating
) {}
