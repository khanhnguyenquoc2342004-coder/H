package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String description;
    private double price;
    private String imageUrl;
    private String hotelLink;

    // --- Constructor rỗng (Bắt buộc phả   i có cho JPA) ---
    public Hotel() {
    }

    // --- Constructor đầy đủ ---
    public Hotel(String name, String address, String description, double price, String imageUrl, String hotelLink) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.hotelLink = hotelLink;
    }

    // --- Getter và Setter (Đây là phần thay thế cho Lombok) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getHotelLink() { return hotelLink; }
    public void setHotelLink(String hotelLink) { this.hotelLink = hotelLink; }
}