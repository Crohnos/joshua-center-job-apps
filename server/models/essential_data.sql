-- Essential data - minimal set of sample applicants for production use
-- Note: also check additional_data.sql for more sample applicants (30+ more records)

-- Basic applicant entries - no references or other relations
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
 '/uploads/sample-resume-1.pdf', 'not viewed'),

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
 '/uploads/sample-resume-2.pdf', 'in review'),

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
 '/uploads/sample-resume-3.pdf', 'accepted');