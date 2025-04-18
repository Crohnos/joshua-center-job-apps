CREATE TABLE IF NOT EXISTS Applicant (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL, -- Google email as identifier
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  phone TEXT NOT NULL,
  us_citizen BOOLEAN NOT NULL,
  felony_conviction BOOLEAN NOT NULL,
  felony_explanation TEXT,
  dual_relationships TEXT NOT NULL, -- 'yes', 'no', 'other'
  dual_relationships_explanation TEXT,
  interests TEXT NOT NULL,
  why_joshua_center TEXT NOT NULL,
  ethical_framework_thoughts TEXT NOT NULL,
  populations TEXT NOT NULL, -- JSON array, e.g., '["Adults", "Children"]'
  education TEXT NOT NULL,
  previous_employer TEXT NOT NULL,
  previous_employer_address TEXT NOT NULL,
  previous_employer_city TEXT NOT NULL,
  previous_employer_state TEXT NOT NULL,
  previous_employer_zip TEXT NOT NULL,
  previous_employer_phone TEXT NOT NULL,
  previous_employer_title TEXT NOT NULL,
  previous_employer_length TEXT NOT NULL,
  previous_employer_reason_leaving TEXT NOT NULL,
  other_employment TEXT,
  languages TEXT NOT NULL,
  gender TEXT NOT NULL,
  race_ethnicity TEXT NOT NULL,
  resume_path TEXT NOT NULL,
  application_status TEXT NOT NULL DEFAULT 'not viewed', -- 'not viewed', 'in review', 'rejected', 'accepted'
  assigned_employee_id INTEGER,
  FOREIGN KEY (assigned_employee_id) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Location (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE -- e.g., 'Main Office', 'Branch A'
);

CREATE TABLE IF NOT EXISTS AppliedLoc (
  applicant_id INTEGER,
  location_id INTEGER,
  PRIMARY KEY (applicant_id, location_id),
  FOREIGN KEY (applicant_id) REFERENCES Applicant(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES Location(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL, -- Google email for admins
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Reference (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL, -- 'professional', 'character', 'other'
  FOREIGN KEY (applicant_id) REFERENCES Applicant(id) ON DELETE CASCADE
);

-- Insert actual locations if they don't exist
INSERT OR IGNORE INTO Location (name) VALUES ('Fayetteville');
INSERT OR IGNORE INTO Location (name) VALUES ('Rogers');
INSERT OR IGNORE INTO Location (name) VALUES ('Siloam Springs');
INSERT OR IGNORE INTO Location (name) VALUES ('Conway');
INSERT OR IGNORE INTO Location (name) VALUES ('Jonesboro');

-- Insert default admin users if they don't exist
INSERT OR IGNORE INTO User (email, first_name, last_name, active) 
VALUES ('dev@example.com', 'Development', 'User', 1);

-- Insert additional required users
INSERT OR IGNORE INTO User (email, first_name, last_name, active) 
VALUES ('john.graham@example.com', 'John', 'Graham', 1);

INSERT OR IGNORE INTO User (email, first_name, last_name, active) 
VALUES ('olivia.jones@example.com', 'Olivia', 'Jones', 1);