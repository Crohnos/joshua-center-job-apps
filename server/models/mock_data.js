const db = require('./db');
const fs = require('fs');
const path = require('path');

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random boolean
const getRandomBoolean = () => Math.random() > 0.5;

// Helper function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate mock data
const generateMockData = async () => {
  // Arrays for generating random data
  const firstNames = [
    'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica',
    'William', 'Jennifer', 'Richard', 'Elizabeth', 'Joseph', 'Linda', 'Thomas',
    'Barbara', 'Charles', 'Susan', 'Christopher', 'Margaret', 'Daniel', 'Dorothy',
    'Matthew', 'Lisa', 'Anthony', 'Nancy', 'Mark', 'Karen', 'Donald', 'Betty',
    'Steven', 'Helen', 'Paul', 'Sandra', 'Andrew', 'Ashley', 'Joshua', 'Kimberly',
    'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian', 'Michelle', 'George', 'Amanda',
    'Edward', 'Melissa', 'Ronald', 'Deborah', 'Timothy', 'Stephanie'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
    'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright',
    'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson',
    'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
    'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris'
  ];
  
  const domains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'mail.com', 'protonmail.com', 'aol.com', 'zoho.com', 'yandex.com'
  ];
  
  const streets = [
    'Main St', 'Oak St', 'Maple Ave', 'Cedar Ln', 'Pine St', 'Elm St',
    'Washington Ave', 'Jefferson St', 'Park Ave', 'Lake Dr', 'River Rd',
    'Highland Ave', 'Forest Dr', 'Meadow Ln', 'Valley Rd', 'Hill St',
    'Spring St', 'Summer St', 'Autumn Dr', 'Winter Ln'
  ];
  
  const cities = [
    'Fayetteville', 'Rogers', 'Bentonville', 'Springdale', 'Fort Smith',
    'Little Rock', 'Conway', 'Jonesboro', 'Hot Springs', 'Pine Bluff',
    'Siloam Springs', 'Russellville', 'Bella Vista', 'Maumelle', 'Cabot',
    'Benton', 'Bryant', 'Paragould', 'Van Buren', 'Searcy'
  ];
  
  const states = [
    'AR', 'MO', 'OK', 'TX', 'LA', 'MS', 'TN', 'KY', 'IL', 'KS'
  ];
  
  const employers = [
    'Community Mental Health Center', 'University Counseling Services',
    'Private Practice Group', 'Hospital Psychiatric Department',
    'Wellness Center', 'Rehabilitation Facility', 'School Counseling Office',
    'Family Therapy Clinic', 'Veterans Affairs Medical Center',
    'Crisis Intervention Center', 'Behavioral Health Services',
    'Psychological Assessment Center', 'Addiction Treatment Center',
    'Employee Assistance Program', 'Youth Services Agency'
  ];
  
  const jobTitles = [
    'Licensed Professional Counselor', 'Mental Health Therapist',
    'Clinical Social Worker', 'Psychologist', 'Case Manager',
    'Substance Abuse Counselor', 'Marriage and Family Therapist',
    'School Counselor', 'Behavioral Therapist', 'Psychiatric Nurse',
    'Art Therapist', 'Play Therapist', 'Clinical Director',
    'Mental Health Technician', 'Rehabilitation Counselor'
  ];
  
  const reasonsForLeaving = [
    'Career advancement opportunity', 'Relocation', 'Seeking new challenges',
    'Desire to work with different populations', 'Completed contract term',
    'Program funding ended', 'Pursuing private practice',
    'Better work-life balance', 'Expanding professional skills',
    'Agency restructuring', 'Seeking more aligned clinical approach'
  ];
  
  const interestAreas = [
    'Trauma-focused therapy', 'Cognitive Behavioral Therapy', 'Family systems',
    'Child and adolescent development', 'Substance abuse recovery',
    'Mindfulness-based interventions', 'EMDR', 'Play therapy',
    'Dialectical Behavior Therapy', 'Psychodynamic approaches',
    'Acceptance and Commitment Therapy', 'Solution-focused brief therapy',
    'Grief and loss counseling', 'Crisis intervention',
    'Integrative and holistic approaches to mental health'
  ];
  
  const populationOptions = [
    'Children', 'Adolescents', 'Adults', 'Elderly', 'Couples',
    'Families', 'Groups', 'LGBTQ+', 'Veterans', 'Trauma Survivors',
    'Addiction Recovery', 'Anxiety/Depression', 'Grief/Loss', 
    'Developmental Disabilities', 'Crisis Intervention'
  ];
  
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Vietnamese',
    'Korean', 'Arabic', 'Russian', 'American Sign Language'
  ];
  
  const genders = [
    'Male', 'Female', 'Non-binary', 'Transgender', 'Prefer not to say'
  ];
  
  const ethnicities = [
    'White/Caucasian', 'Black/African American', 'Hispanic/Latino', 
    'Asian', 'Native American', 'Pacific Islander', 'Middle Eastern',
    'Multiracial', 'Other', 'Prefer not to say'
  ];
  
  const referenceTypes = ['professional', 'character', 'academic'];
  
  const locations = [1, 2, 3, 4, 5]; // IDs from the predefined locations
  
  const statuses = ['not viewed', 'in review', 'accepted', 'rejected'];
  
  // Get users for assignment
  const userIds = await new Promise((resolve, reject) => {
    db.all('SELECT id FROM User', (err, rows) => {
      if (err) reject(err);
      resolve(rows.map(row => row.id));
    });
  });
  
  // Generate 50 applicants
  for (let i = 0; i < 50; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const domain = getRandomItem(domains);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(10, 999)}@${domain}`;
    
    const streetNum = getRandomInt(100, 9999);
    const street = getRandomItem(streets);
    const city = getRandomItem(cities);
    const state = getRandomItem(states);
    const zip = getRandomInt(10000, 99999).toString();
    
    const hasFelony = getRandomBoolean() && getRandomBoolean() ? true : false; // Make felony less common
    const felonyExplanation = hasFelony ? 
      `This was a non-violent offense from ${getRandomInt(5, 20)} years ago. I completed all requirements and have maintained a clean record since.` : null;
    
    const dualRelationships = getRandomItem(['yes', 'no', 'unsure']);
    const dualExplanation = dualRelationships !== 'no' ? 
      `I believe I may know ${getRandomItem(['a staff member', 'a current client', 'someone associated with the organization'])} through ${getRandomItem(['community events', 'previous employment', 'mutual acquaintances', 'family connections'])}.` : null;
    
    const chosenInterests = [
      getRandomItem(interestAreas),
      getRandomItem(interestAreas),
      getRandomItem(interestAreas)
    ].filter((v, i, a) => a.indexOf(v) === i).join(', ');
    
    const whyJoshuaCenter = `I am drawn to the Joshua Center's ${getRandomItem(['community-focused approach', 'clinical excellence', 'holistic treatment model', 'commitment to underserved populations'])}. The center's emphasis on ${getRandomItem(['evidence-based practices', 'client-centered care', 'professional development', 'ethical practice', 'integrative approaches'])} aligns perfectly with my professional values. I believe my background in ${getRandomItem(['trauma-informed care', 'family systems', 'cognitive behavioral approaches', 'mindfulness interventions'])} would be valuable to your team and clientele.`;
    
    const ethicalThoughts = `I believe ethical practice in mental health requires ${getRandomItem(['strong boundaries', 'cultural competence', 'ongoing supervision', 'continual self-reflection'])} and a commitment to ${getRandomItem(['client autonomy', 'beneficence', 'non-maleficence', 'social justice'])}. When facing ethical dilemmas, I prioritize consulting with colleagues and supervisors while following the ACA and APA ethical guidelines. I'm particularly mindful of ${getRandomItem(['confidentiality issues', 'dual relationships', 'cultural considerations', 'informed consent processes'])}.`;
    
    const selectedPopulations = [];
    for (const pop of populationOptions) {
      if (Math.random() > 0.7) { // 30% chance for each population to be selected
        selectedPopulations.push(pop);
      }
    }
    // Ensure at least one population is selected
    if (selectedPopulations.length === 0) {
      selectedPopulations.push(getRandomItem(populationOptions));
    }
    
    const phone = `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
    
    const education = `Master's in ${getRandomItem(['Counseling', 'Psychology', 'Social Work', 'Marriage and Family Therapy', 'Clinical Mental Health'])} from ${getRandomItem(['University of Arkansas', 'University of Central Arkansas', 'Arkansas State University', 'John Brown University', 'Missouri State University', 'University of Oklahoma', 'University of Memphis', 'Harding University'])} (${getRandomInt(2000, 2023)})
Licensed ${getRandomItem(['LPC', 'LCSW', 'LMFT', 'Psychologist'])} in ${getRandomItem(['Arkansas', 'Missouri', 'Oklahoma', 'Texas', 'multiple states'])}
Additional Training: ${getRandomItem(['EMDR', 'Play Therapy', 'CBT', 'DBT', 'Trauma-Focused Therapy', 'Mindfulness-Based Interventions'])}`;
    
    const prevEmployer = getRandomItem(employers);
    const prevTitle = getRandomItem(jobTitles);
    const prevLength = `${getRandomInt(1, 10)} ${getRandomInt(1, 10) > 5 ? 'years' : 'months'}`;
    const prevReason = getRandomItem(reasonsForLeaving);
    
    const otherEmployment = getRandomBoolean() ? 
      `Worked at ${getRandomItem(employers)} as a ${getRandomItem(jobTitles)} for ${getRandomInt(1, 5)} years.` : null;
    
    const spokenLanguages = ['English'];
    if (Math.random() > 0.8) { // 20% chance for additional language
      spokenLanguages.push(getRandomItem(languages.filter(l => l !== 'English')));
    }
    
    const gender = getRandomItem(genders);
    const ethnicity = getRandomItem(ethnicities);
    
    // Create a mock resume path - we're not actually creating files
    // Make the path relative since the uploads folder is at the server level
    const resumePath = `${Date.now()}-${getRandomInt(100000000, 999999999)}.pdf`;
    
    // Get random status, weighted toward 'not viewed'
    let status;
    const statusRoll = Math.random();
    if (statusRoll < 0.6) status = 'not viewed';
    else if (statusRoll < 0.8) status = 'in review';
    else if (statusRoll < 0.9) status = 'accepted';
    else status = 'rejected';
    
    // Assign employee if status is 'in review'
    const assignedEmployeeId = (status === 'in review' || status === 'accepted') ? 
      getRandomItem(userIds) : null;
    
    // Insert applicant
    const applicant = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Applicant (
          email, name, address, city, state, zip, phone, us_citizen,
          felony_conviction, felony_explanation, dual_relationships,
          dual_relationships_explanation, interests, why_joshua_center,
          ethical_framework_thoughts, populations, education,
          previous_employer, previous_employer_address, previous_employer_city,
          previous_employer_state, previous_employer_zip, previous_employer_phone,
          previous_employer_title, previous_employer_length,
          previous_employer_reason_leaving, other_employment,
          languages, gender, race_ethnicity, resume_path,
          application_status, assigned_employee_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        email,
        `${firstName} ${lastName}`,
        `${streetNum} ${street}`,
        city,
        state,
        zip,
        phone,
        getRandomBoolean() ? 1 : 0,
        hasFelony ? 1 : 0,
        felonyExplanation,
        dualRelationships,
        dualExplanation,
        chosenInterests,
        whyJoshuaCenter,
        ethicalThoughts,
        JSON.stringify(selectedPopulations),
        education,
        prevEmployer,
        `${getRandomInt(100, 9999)} ${getRandomItem(streets)}`,
        getRandomItem(cities),
        getRandomItem(states),
        getRandomInt(10000, 99999).toString(),
        `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
        prevTitle,
        prevLength,
        prevReason,
        otherEmployment,
        spokenLanguages.join(', '),
        gender,
        ethnicity,
        resumePath,
        status,
        assignedEmployeeId
      ], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
    
    // Add locations (1-3 random locations)
    const numLocations = getRandomInt(1, 3);
    const selectedLocations = [];
    for (let j = 0; j < numLocations; j++) {
      let locationId;
      do {
        locationId = getRandomItem(locations);
      } while (selectedLocations.includes(locationId));
      
      selectedLocations.push(locationId);
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO AppliedLoc (applicant_id, location_id) VALUES (?, ?)',
          [applicant, locationId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    }
    
    // Add references (2-3 per applicant)
    const numReferences = getRandomInt(2, 3);
    for (let j = 0; j < numReferences; j++) {
      const refFirstName = getRandomItem(firstNames);
      const refLastName = getRandomItem(lastNames);
      const refEmail = `${refFirstName.toLowerCase()}.${refLastName.toLowerCase()}${getRandomInt(10, 999)}@${getRandomItem(domains)}`;
      const refPhone = `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
      const refType = getRandomItem(referenceTypes);
      
      const relationships = {
        professional: ['Supervisor', 'Colleague', 'Manager', 'Director', 'Clinical Mentor'],
        character: ['Friend', 'Community Member', 'Volunteer Coordinator', 'Religious Leader', 'Former Client'],
        academic: ['Professor', 'Advisor', 'Department Chair', 'Clinical Instructor', 'Research Mentor']
      };
      
      const refRelationship = getRandomItem(relationships[refType]);
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO Reference (applicant_id, name, relationship, phone, email, type) VALUES (?, ?, ?, ?, ?, ?)',
          [applicant, `${refFirstName} ${refLastName}`, refRelationship, refPhone, refEmail, refType],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    }
    
    console.log(`Created applicant ${i+1}/50: ${firstName} ${lastName}`);
  }
  
  console.log('Mock data generation complete!');
  console.log('Successfully created 50 applicants with references and location preferences.');
};

// Run the mock data generator
generateMockData()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error generating mock data:', err);
    process.exit(1);
  });