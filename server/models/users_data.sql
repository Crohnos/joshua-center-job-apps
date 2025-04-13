-- Sample users data for The Joshua Center application
-- These are fictional users for demonstration purposes

-- Clear existing dev user if it exists (to prevent duplicates)
DELETE FROM User WHERE email = 'dev@example.com';

-- Admin users
INSERT INTO User (email, first_name, last_name, active) 
VALUES ('admin@thejoshuacenter.com', 'Admin', 'User', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('director@thejoshuacenter.com', 'Clinical', 'Director', 1);

-- Staff/Therapist users
INSERT INTO User (email, first_name, last_name, active) 
VALUES ('jennifer.smith@thejoshuacenter.com', 'Jennifer', 'Smith', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('michael.johnson@thejoshuacenter.com', 'Michael', 'Johnson', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('sarah.williams@thejoshuacenter.com', 'Sarah', 'Williams', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('david.brown@thejoshuacenter.com', 'David', 'Brown', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('emily.jones@thejoshuacenter.com', 'Emily', 'Jones', 1);

-- HR/Management users
INSERT INTO User (email, first_name, last_name, active) 
VALUES ('hr@thejoshuacenter.com', 'HR', 'Manager', 1);

INSERT INTO User (email, first_name, last_name, active) 
VALUES ('operations@thejoshuacenter.com', 'Operations', 'Manager', 1);

-- Inactive user example
INSERT INTO User (email, first_name, last_name, active) 
VALUES ('former.employee@thejoshuacenter.com', 'Former', 'Employee', 0);