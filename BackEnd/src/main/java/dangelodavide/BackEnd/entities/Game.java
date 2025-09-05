package dangelodavide.BackEnd.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor
public class Game {
    @Id
    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "La descrizione può avere massimo 1000 caratteri")
    private String description;

    private String released;

    @JsonProperty("background_image")
    private String backgroundImage;

    @DecimalMin(value = "0.0", message = "Il rating minimo è 0")
    @DecimalMax(value = "5.0", message = "Il rating massimo è 5")
    private Double rating;
}
