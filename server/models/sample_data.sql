-- Insert sample applicants directly with SQL
INSERT OR IGNORE INTO Applicant (
  email, name, address, city, state, zip, phone, 
  us_citizen, felony_conviction, felony_explanation, 
  dual_relationships, dual_relationships_explanation, 
  interests, why_joshua_center, ethical_framework_thoughts, 
  populations, education, previous_employer, 
  previous_employer_address, previous_employer_city, 
  previous_employer_state, previous_employer_zip, 
  previous_employer_phone, previous_employer_title, 
  previous_employer_length, previous_employer_reason_leaving, 
  other_employment, languages, gender, race_ethnicity, 
  resume_path, application_status
) VALUES 
-- Applicant 1
('john.smith@example.com', 'John Smith', '123 Main St', 'Fayetteville', 'AR', '72701', '(555) 123-4567',
 1, 0, NULL,
 'no', NULL,
 'Cognitive Behavioral Therapy, Trauma-focused therapy', 
 'I am drawn to the Joshua Center''s community-focused approach. I believe my background in trauma-informed care would be valuable to your team and clientele.',
 'I believe ethical practice requires strong boundaries and ongoing supervision. When facing dilemmas, I consult with colleagues while following ACA guidelines.',
 '["Adults", "Trauma Survivors", "Addiction Recovery"]',
 'Master''s in Counseling from University of Arkansas (2018)',
 'Community Mental Health Center',
 '456 Pine St', 'Rogers', 'AR', '72756',
 '(555) 987-6543', 'Licensed Professional Counselor',
 '3 years', 'Career advancement opportunity',
 NULL, 'English', 'Male', 'White/Caucasian',
 '1713904567-123456789.pdf', 'not viewed'),

-- Applicant 2
('sarah.johnson@example.com', 'Sarah Johnson', '789 Oak Ave', 'Bentonville', 'AR', '72712', '(555) 234-5678',
 1, 0, NULL,
 'no', NULL,
 'Family systems, Play therapy, Solution-focused brief therapy',
 'The center''s emphasis on client-centered care aligns with my professional values. I hope to contribute to your mission of serving the community.',
 'Ethical practice requires cultural competence and a commitment to client autonomy. I''m particularly mindful of confidentiality issues.',
 '["Children", "Adolescents", "Families"]',
 'Master''s in Marriage and Family Therapy from John Brown University (2019)',
 'Family Therapy Clinic',
 '101 Cedar Ln', 'Fayetteville', 'AR', '72701',
 '(555) 876-5432', 'Marriage and Family Therapist',
 '2 years', 'Seeking new challenges',
 NULL, 'English, Spanish', 'Female', 'Hispanic/Latino',
 '1713904568-234567890.pdf', 'in review'),

-- Applicant 3
('michael.williams@example.com', 'Michael Williams', '555 Elm St', 'Springdale', 'AR', '72762', '(555) 345-6789',
 1, 0, NULL,
 'yes', 'I know a staff member through community events.',
 'Mindfulness-based interventions, Grief and loss counseling, Crisis intervention',
 'I value the Joshua Center''s holistic treatment model and would like to contribute my expertise in mindfulness-based approaches.',
 'I prioritize non-maleficence and beneficence in my practice. Ethical decision-making requires continual self-reflection.',
 '["Adults", "Elderly", "Grief/Loss"]',
 'PhD in Psychology from University of Arkansas (2015)',
 'Hospital Psychiatric Department',
 '222 Maple Dr', 'Little Rock', 'AR', '72201',
 '(555) 765-4321', 'Clinical Psychologist',
 '5 years', 'Relocation',
 'Previously worked at Veterans Affairs Medical Center for 3 years.', 'English', 'Male', 'Black/African American',
 '1713904569-345678901.pdf', 'accepted'),

-- Applicant 4
('emily.davis@example.com', 'Emily Davis', '333 Birch Rd', 'Rogers', 'AR', '72756', '(555) 456-7890',
 1, 0, NULL,
 'no', NULL,
 'EMDR, Trauma-focused therapy, Dialectical Behavior Therapy',
 'The Joshua Center''s commitment to underserved populations resonates with my professional goals.',
 'Ethical practice means considering social justice implications and advocating for clients'' best interests.',
 '["LGBTQ+", "Trauma Survivors", "Anxiety/Depression"]',
 'Master''s in Social Work from University of Arkansas (2017)',
 'Crisis Intervention Center',
 '444 Walnut Ave', 'Fayetteville', 'AR', '72701',
 '(555) 654-3210', 'Clinical Social Worker',
 '4 years', 'Seeking more aligned clinical approach',
 NULL, 'English', 'Female', 'White/Caucasian',
 '1713904570-456789012.pdf', 'rejected'),

-- Applicant 5
('david.brown@example.com', 'David Brown', '777 Spruce St', 'Siloam Springs', 'AR', '72761', '(555) 567-8901',
 1, 1, 'This was a non-violent offense from 15 years ago. I completed all requirements and have maintained a clean record since.',
 'no', NULL,
 'Substance abuse recovery, Acceptance and Commitment Therapy, Cognitive Behavioral Therapy',
 'I am drawn to the Joshua Center''s evidence-based practices and would like to contribute to your addiction recovery programs.',
 'I believe in transparency and honesty in the therapeutic relationship while maintaining appropriate boundaries.',
 '["Adults", "Addiction Recovery", "Groups"]',
 'Master''s in Counseling Psychology from University of Oklahoma (2010)',
 'Addiction Treatment Center',
 '888 Pine St', 'Tulsa', 'OK', '74103',
 '(555) 543-2109', 'Substance Abuse Counselor',
 '10 years', 'Desire to work with different populations',
 NULL, 'English', 'Male', 'Multiracial',
 '1713904571-567890123.pdf', 'not viewed'),

-- Applicant 6
('jennifer.miller@example.com', 'Jennifer Miller', '999 Aspen Dr', 'Conway', 'AR', '72032', '(555) 678-9012',
 1, 0, NULL,
 'no', NULL,
 'Child and adolescent development, Play therapy, Art therapy',
 'I value the Joshua Center''s focus on holistic care and would love to bring my expertise in child therapy.',
 'I am committed to child welfare and ensuring appropriate informed consent with minors and their guardians.',
 '["Children", "Adolescents", "Developmental Disabilities"]',
 'Master''s in Counseling from University of Central Arkansas (2016)',
 'School Counseling Office',
 '111 School St', 'Conway', 'AR', '72032',
 '(555) 432-1098', 'School Counselor',
 '5 years', 'Expanding professional skills',
 NULL, 'English', 'Female', 'White/Caucasian',
 '1713904572-678901234.pdf', 'in review'),

-- Applicant 7
('robert.taylor@example.com', 'Robert Taylor', '222 Cedar Ln', 'Jonesboro', 'AR', '72401', '(555) 789-0123',
 1, 0, NULL,
 'unsure', 'I believe I may know someone associated with the organization through mutual acquaintances.',
 'Trauma-focused therapy, EMDR, Crisis intervention',
 'The Joshua Center''s reputation for clinical excellence and trauma-informed care aligns with my professional focus.',
 'I prioritize trauma-informed care principles and creating a safe environment for clients to heal.',
 '["Veterans", "Trauma Survivors", "Adults"]',
 'Master''s in Clinical Mental Health from Arkansas State University (2014)',
 'Veterans Affairs Medical Center',
 '333 Veterans Way', 'Jonesboro', 'AR', '72401',
 '(555) 321-0987', 'Mental Health Therapist',
 '7 years', 'Seeking new challenges',
 NULL, 'English', 'Male', 'White/Caucasian',
 '1713904573-789012345.pdf', 'not viewed'),

-- Applicant 8
('lisa.anderson@example.com', 'Lisa Anderson', '444 Maple Ave', 'Fayetteville', 'AR', '72701', '(555) 890-1234',
 1, 0, NULL,
 'no', NULL,
 'Cognitive Behavioral Therapy, Mindfulness-based interventions, Acceptance and Commitment Therapy',
 'I believe in the Joshua Center''s integrative approaches and want to contribute to your evidence-based programs.',
 'I am committed to ongoing professional development and supervision to ensure ethical practice.',
 '["Adults", "Anxiety/Depression", "LGBTQ+"]',
 'PhD in Clinical Psychology from University of Memphis (2018)',
 'Private Practice Group',
 '555 College Ave', 'Fayetteville', 'AR', '72701',
 '(555) 210-9876', 'Clinical Psychologist',
 '3 years', 'Desire to work with different populations',
 'Previously worked at University Counseling Services for 2 years.', 'English', 'Female', 'Asian',
 '1713904574-890123456.pdf', 'accepted'),

-- Applicant 9
('thomas.wilson@example.com', 'Thomas Wilson', '666 Oak St', 'Little Rock', 'AR', '72201', '(555) 901-2345',
 1, 0, NULL,
 'no', NULL,
 'Family systems, Solution-focused brief therapy, Integrative and holistic approaches',
 'The Joshua Center''s commitment to family-centered care matches my therapeutic approach.',
 'I believe in collaborative decision-making and ensuring client autonomy in the therapeutic process.',
 '["Families", "Couples", "Adults"]',
 'Master''s in Marriage and Family Therapy from Harding University (2015)',
 'Family Therapy Clinic',
 '777 Family Way', 'Little Rock', 'AR', '72201',
 '(555) 109-8765', 'Marriage and Family Therapist',
 '6 years', 'Relocation',
 NULL, 'English', 'Male', 'White/Caucasian',
 '1713904575-901234567.pdf', 'not viewed'),

-- Applicant 10
('amanda.harris@example.com', 'Amanda Harris', '888 Pine Blvd', 'Rogers', 'AR', '72756', '(555) 012-3456',
 1, 0, NULL,
 'no', NULL,
 'Child and adolescent development, Play therapy, Trauma-focused therapy',
 'I am passionate about the Joshua Center''s work with underserved children and families.',
 'I prioritize child welfare and creating a trauma-informed environment for young clients.',
 '["Children", "Adolescents", "Trauma Survivors"]',
 'Master''s in Counseling from John Brown University (2019)',
 'Youth Services Agency',
 '999 Youth Dr', 'Rogers', 'AR', '72756',
 '(555) 098-7654', 'Child Therapist',
 '2 years', 'Expanding professional skills',
 NULL, 'English, Spanish', 'Female', 'Hispanic/Latino',
 '1713904576-012345678.pdf', 'in review');

-- Insert references for the sample applicants
INSERT OR IGNORE INTO Reference (applicant_id, name, relationship, phone, email, type)
VALUES
-- For Applicant 1 (John Smith)
(1, 'Dr. James Wilson', 'Supervisor', '(555) 111-2222', 'james.wilson@example.com', 'professional'),
(1, 'Sarah Thompson', 'Colleague', '(555) 222-3333', 'sarah.thompson@example.com', 'professional'),
(1, 'Robert Davis', 'Professor', '(555) 333-4444', 'robert.davis@example.edu', 'academic'),

-- For Applicant 2 (Sarah Johnson)
(2, 'Dr. Emily Clark', 'Supervisor', '(555) 444-5555', 'emily.clark@example.com', 'professional'),
(2, 'Michael Roberts', 'Colleague', '(555) 555-6666', 'michael.roberts@example.com', 'professional'),
(2, 'Jennifer White', 'Professor', '(555) 666-7777', 'jennifer.white@example.edu', 'academic'),

-- For Applicant 3 (Michael Williams)
(3, 'Dr. Thomas Brown', 'Department Chair', '(555) 777-8888', 'thomas.brown@example.com', 'professional'),
(3, 'Lisa Anderson', 'Clinical Mentor', '(555) 888-9999', 'lisa.anderson@example.com', 'professional'),
(3, 'Robert Johnson', 'Colleague', '(555) 999-0000', 'robert.johnson@example.com', 'professional'),

-- For other applicants (abbreviated for brevity)
(4, 'Dr. David Lee', 'Supervisor', '(555) 123-4321', 'david.lee@example.com', 'professional'),
(4, 'Karen Miller', 'Colleague', '(555) 234-5432', 'karen.miller@example.com', 'professional'),
(5, 'Dr. Susan Taylor', 'Clinical Director', '(555) 345-6543', 'susan.taylor@example.com', 'professional'),
(5, 'Mark Johnson', 'Colleague', '(555) 456-7654', 'mark.johnson@example.com', 'professional'),
(6, 'Dr. Richard Adams', 'Principal', '(555) 567-8765', 'richard.adams@example.com', 'professional'),
(6, 'Laura Thomas', 'School Director', '(555) 678-9876', 'laura.thomas@example.com', 'professional'),
(7, 'Dr. Elizabeth Hall', 'VA Director', '(555) 789-0987', 'elizabeth.hall@example.com', 'professional'),
(7, 'George Walker', 'Colleague', '(555) 890-1098', 'george.walker@example.com', 'professional'),
(8, 'Dr. Patricia Evans', 'Clinical Supervisor', '(555) 901-2109', 'patricia.evans@example.com', 'professional'),
(8, 'William Martin', 'Department Chair', '(555) 012-3210', 'william.martin@example.com', 'professional'),
(9, 'Dr. Thomas Scott', 'Clinical Director', '(555) 987-6543', 'thomas.scott@example.com', 'professional'),
(9, 'Linda Miller', 'Mentor', '(555) 876-5432', 'linda.miller@example.com', 'professional'),
(10, 'Dr. Barbara White', 'Agency Director', '(555) 765-4321', 'barbara.white@example.com', 'professional'),
(10, 'Steven Davis', 'Supervisor', '(555) 654-3210', 'steven.davis@example.com', 'professional');

-- Insert applied locations for the sample applicants
INSERT OR IGNORE INTO AppliedLoc (applicant_id, location_id)
VALUES
-- For Applicant 1 (John Smith)
(1, 1), -- Fayetteville
(1, 2), -- Rogers

-- For Applicant 2 (Sarah Johnson)
(2, 1), -- Fayetteville
(2, 3), -- Siloam Springs

-- For Applicant 3 (Michael Williams)
(3, 4), -- Conway
(3, 5), -- Jonesboro

-- For other applicants
(4, 2), -- Rogers
(5, 3), -- Siloam Springs
(6, 4), -- Conway
(7, 5), -- Jonesboro
(8, 1), -- Fayetteville
(9, 2), -- Rogers 
(10, 1), -- Fayetteville
(10, 2); -- Rogers