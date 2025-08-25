package dangelodavide.BackEnd.entities;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "La descrizione può avere massimo 1000 caratteri")
    private String description;

    private String released;
    private String backgroundImage;

    @DecimalMin(value = "0.0", message = "Il rating minimo è 0")
    @DecimalMax(value = "5.0", message = "Il rating massimo è 5")
    private Double rating;
}
