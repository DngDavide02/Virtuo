package dangelodavide.BackEnd.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Game {

    @Id
    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String released;

    @Column(name = "background_image")
    private String backgroundImage;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    private Double rating;
}
