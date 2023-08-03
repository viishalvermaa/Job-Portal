package com.example.springapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDTO {
    @Id
    @Column
    private Long id;
    @Column
    private String name;
   @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;
    @Column
    private String location;
}