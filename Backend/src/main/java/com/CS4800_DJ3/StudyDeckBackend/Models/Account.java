package com.CS4800_DJ3.StudyDeckBackend.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "account")
public class Account {
    
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userID;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;




    // Getters and Setters
    
    public long getUserID() {
        return userID;
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

}
