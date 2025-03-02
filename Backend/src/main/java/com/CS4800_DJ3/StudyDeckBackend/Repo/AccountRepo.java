package com.CS4800_DJ3.StudyDeckBackend.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.CS4800_DJ3.StudyDeckBackend.Models.Account;

import jakarta.transaction.Transactional;

public interface AccountRepo extends JpaRepository<Account, Long> {
    
    /**
     * SQL Query to find an account by username
     * @param username: user account username
     * @return Account: account with the given username
     */
    @Query(value = "SELECT * FROM account WHERE username = ?1", nativeQuery = true)
    Account findByUsername(String username);


    /**
     * SQL Query to find an account by userID
     * @param userID: user account ID
     */
    @Query(value = "SELECT * FROM account WHERE userID = ?1", nativeQuery = true)
    Account findByUserID(Long userID);


    /**
     * SQL Query to find an account by email
     * @param email: user account email
     * @return Account: account with the given email
     */
    @Query(value = "SELECT * FROM account WHERE email = ?1", nativeQuery = true)
    Account findByEmail(String email);

    
    /**
     * SQL Query to add a new account
     * @param username: user account username
     * @param password: user account password
     */
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO account (username, password, email) VALUES (?1, ?2, ?3)", nativeQuery = true)
    void addAccount(String username, String password, String email);
}
