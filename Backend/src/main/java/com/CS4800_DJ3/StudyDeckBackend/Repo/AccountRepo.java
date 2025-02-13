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
     * SQL Query to add a new account
     * @param username: user account username
     * @param password: user account password
     */
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO account (username, password) VALUES (?1, ?2)", nativeQuery = true)
    void addAccount(String username, String password);
}
