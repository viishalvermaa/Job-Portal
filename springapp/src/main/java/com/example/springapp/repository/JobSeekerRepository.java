package com.example.springapp.repository;


import java.util.List;
import java.util.Optional;

import org.hibernate.annotations.Filter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.springapp.model.JobSeeker;
import com.example.springapp.model.Users;


public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {

    Optional<JobSeeker> findById(JobSeeker jobSeeker);

    @Query("SELECT j FROM JobSeeker j")
    @Filter(name = "deletedFilter", condition = "deleted = :deleted")
    List<JobSeeker> findAll(@Param("deleted") boolean deleted);

    List<JobSeeker> findByReported(boolean b);
 

    JobSeeker getJobSeekerByUser(Users authenticatedUser);

    JobSeeker findByUser(Users authenticatedUser);

  


}