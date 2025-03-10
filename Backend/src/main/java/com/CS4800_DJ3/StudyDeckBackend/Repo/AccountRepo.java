package com.CS4800_DJ3.StudyDeckBackend.Repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.CS4800_DJ3.StudyDeckBackend.Models.Account;


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
    Account findByUserID(UUID userID);


    /**
     * SQL Query to find an account by email
     * @param email: user account email
     * @return Account: account with the given email
     */
    @Query(value = "SELECT * FROM account WHERE email = ?1", nativeQuery = true)
    Account findByEmail(String email);
}
