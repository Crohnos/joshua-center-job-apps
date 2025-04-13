const fs = require('fs');
const path = require('path');

/**
 * Simple PDF generation script for creating sample resume files
 * 
 * This script creates minimal valid PDF files suitable for testing
 * Note: These are not real PDFs with content, just valid empty PDF structures
 * that can be served and will render as empty PDFs in a browser
 */

// Create a more substantial PDF with actual resume content
const createResumePDF = (id) => {
    // Get applicant info based on ID
    const applicants = {
        1: { name: 'John Smith', title: 'Licensed Professional Counselor', skills: 'Cognitive Behavioral Therapy, Trauma-focused therapy' },
        2: { name: 'Sarah Johnson', title: 'Marriage and Family Therapist', skills: 'Family systems, Play therapy, Solution-focused brief therapy' },
        3: { name: 'Michael Williams', title: 'Clinical Psychologist', skills: 'Mindfulness-based interventions, Grief and loss counseling, Crisis intervention' },
        4: { name: 'Emily Davis', title: 'Clinical Social Worker', skills: 'EMDR, Trauma-focused therapy, Dialectical Behavior Therapy' },
        5: { name: 'David Brown', title: 'Substance Abuse Counselor', skills: 'Substance abuse recovery, Acceptance and Commitment Therapy, CBT' },
        6: { name: 'Jennifer Miller', title: 'School Counselor', skills: 'Child and adolescent development, Play therapy, Art therapy' },
        7: { name: 'Robert Taylor', title: 'Mental Health Therapist', skills: 'Trauma-focused therapy, EMDR, Crisis intervention' },
        8: { name: 'Lisa Anderson', title: 'Clinical Psychologist', skills: 'CBT, Mindfulness-based interventions, Acceptance and Commitment Therapy' },
        9: { name: 'Thomas Wilson', title: 'Marriage and Family Therapist', skills: 'Family systems, Solution-focused brief therapy, Integrative approaches' },
        10: { name: 'Amanda Harris', title: 'Child Therapist', skills: 'Child and adolescent development, Play therapy, Trauma-focused therapy' },
        11: { name: 'William Jackson', title: 'Addiction Counselor', skills: 'Substance abuse treatment, Motivational interviewing, CBT' },
        12: { name: 'Rebecca Martinez', title: 'Art Therapist', skills: 'Art therapy, Expressive arts, Trauma-focused interventions' },
        13: { name: 'Daniel Thompson', title: 'Clinical Psychologist', skills: 'Cognitive processing therapy, Trauma-focused CBT, EMDR' },
        14: { name: 'Stephanie Lee', title: 'Marriage and Family Therapist', skills: 'Family systems therapy, Emotionally focused therapy, Solution-focused therapy' },
        15: { name: 'Christopher White', title: 'Counseling Psychologist', skills: 'Psychodynamic therapy, Attachment-based approaches, Interpersonal therapy' },
        16: { name: 'Nicole Garcia', title: 'DBT Therapist', skills: 'Dialectical Behavior Therapy, Mindfulness-based interventions, Skills training' },
        17: { name: 'James Rodriguez', title: 'Psychoanalytic Psychologist', skills: 'Psychoanalytic therapy, Depth psychology, Dream analysis' },
        18: { name: 'Michelle Nguyen', title: 'Clinical Psychologist', skills: 'Cognitive Behavioral Therapy, Anxiety treatment, Exposure therapy' },
        19: { name: 'Anthony Scott', title: 'Group Therapy Coordinator', skills: 'Group therapy, Interpersonal process, Community mental health' },
        20: { name: 'Katherine Robinson', title: 'Somatic Therapist', skills: 'Gestalt therapy, Experiential approaches, Somatic experiencing' },
        21: { name: 'Ryan Phillips', title: 'Staff Counselor', skills: 'Rational Emotive Behavior Therapy, Cognitive approaches, Stress management' },
        22: { name: 'Olivia Sanchez', title: 'Multicultural Counselor', skills: 'Narrative therapy, Multicultural counseling, Social justice advocacy' },
        23: { name: 'Brian Walker', title: 'Registered Play Therapist', skills: 'Play therapy, Child-centered approaches, Parent coaching' },
        24: { name: 'Samantha Brooks', title: 'Health Psychologist', skills: 'Acceptance and Commitment Therapy, Mindfulness-based approaches, Values work' },
        25: { name: 'Kevin Chen', title: 'International Student Counselor', skills: 'Integrative psychotherapy, Multicultural approaches, Cross-cultural counseling' },
        26: { name: 'Rachel Patel', title: 'Crisis Intervention Specialist', skills: 'Solution-focused brief therapy, Crisis intervention, Strength-based approaches' },
        27: { name: 'Eric Gonzalez', title: 'Substance Abuse Counselor', skills: 'Motivational interviewing, Strength-based approaches, Substance abuse treatment' },
        28: { name: 'Brittany Coleman', title: 'Advocacy Coordinator and Counselor', skills: 'Social justice counseling, Advocacy, Multicultural approaches' },
        29: { name: 'Marcus Washington', title: 'Veterans Mental Health Specialist', skills: 'CBT, Trauma-focused interventions, Veterans mental health' },
        30: { name: 'Lindsay Morgan', title: 'Mindfulness Coach and Therapist', skills: 'Mindfulness-based stress reduction, Wellness coaching, Integrative mental health' },
        31: { name: 'Jeremy Foster', title: 'Bereavement Counselor', skills: 'Existential therapy, Meaning-centered approaches, End-of-life counseling' },
        32: { name: 'Alicia Ramirez', title: 'Bilingual Therapist', skills: 'Culturally responsive therapy, Immigration issues, Trauma-focused care' },
        33: { name: 'Jason Kim', title: 'Staff Psychologist', skills: 'Cognitive Behavioral Therapy, Acceptance and Commitment Therapy, Cross-cultural counseling' }
    };
    
    const applicant = applicants[id] || { 
        name: `Sample Applicant ${id}`, 
        title: 'Mental Health Professional', 
        skills: 'Therapy, Counseling, Mental Health' 
    };

    // Generate a more complex PDF with content
    // This is still a simple PDF but with text content showing a basic resume
    const content = `%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R/F2 5 0 R/F3 6 0 R>>>>/Contents 7 0 R/Parent 2 0 R>>
endobj
4 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>
endobj
5 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>
endobj
6 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Italic>>
endobj
7 0 obj
<</Length 676>>
stream
BT
/F1 24 Tf
50 700 Td
(${applicant.name}) Tj
/F2 12 Tf
0 -20 Td
(${applicant.title}) Tj
/F3 10 Tf
0 -15 Td
(sample-resume-${id}.pdf - Demo Resume for Joshua Center) Tj
/F1 14 Tf
-30 -50 Td
(PROFESSIONAL SUMMARY) Tj
/F2 11 Tf
0 -20 Td
(Experienced mental health professional with expertise in ${applicant.skills}.) Tj
0 -15 Td
(Seeking a position with The Joshua Center to contribute to community well-being.) Tj
/F1 14 Tf
0 -40 Td
(SKILLS & EXPERTISE) Tj
/F2 11 Tf
0 -20 Td
(• ${applicant.skills.split(',')[0]}) Tj
0 -15 Td
(• ${applicant.skills.includes(',') ? applicant.skills.split(',')[1] || '' : ''}) Tj
0 -15 Td
(• Crisis intervention and assessment) Tj
0 -15 Td
(• Treatment planning and implementation) Tj
/F1 14 Tf
0 -40 Td
(EDUCATION) Tj
/F2 11 Tf
0 -20 Td
(Master's in Counseling Psychology - Sample University, 2018) Tj
0 -15 Td
(Bachelor's in Psychology - Example College, 2015) Tj
ET
endstream
endobj
xref
0 8
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
0000000229 00000 n
0000000291 00000 n
0000000347 00000 n
0000000416 00000 n
trailer
<</Size 8/Root 1 0 R>>
startxref
1142
%%EOF
`.replace(/\$\{applicant\.name\}/g, applicant.name)
 .replace(/\$\{applicant\.title\}/g, applicant.title)
 .replace(/\$\{applicant\.skills\}/g, applicant.skills)
 .replace(/\$\{id\}/g, id)
 .replace(/\$\{applicant\.skills\.split\(','\)\[0\]\}/g, applicant.skills.split(',')[0])
 .replace(/\$\{applicant\.skills\.includes\(','\) \? applicant\.skills\.split\(','\)\[1\] \|\| '' : ''\}/g, 
          applicant.skills.includes(',') ? applicant.skills.split(',')[1] || '' : '');

    return content;
};

// Function to generate sample PDFs
function generateSamplePDFs() {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created uploads directory at ${uploadsDir}`);
    }

    // Create sample resume PDFs
    for (let i = 1; i <= 33; i++) {
        const filename = `sample-resume-${i}.pdf`;
        const filePath = path.join(uploadsDir, filename);
        
        try {
            // Generate PDF content regardless if file exists or not
            const pdfContent = createResumePDF(i);
            
            // Write file with content
            fs.writeFileSync(filePath, pdfContent);
            console.log(`Created/updated sample PDF: ${filename} (${pdfContent.length} bytes)`);
        } catch (err) {
            console.error(`Error creating ${filename}:`, err);
        }
    }

    console.log('Sample PDF generation complete. Created in:', uploadsDir);
    return true;
}

// Run the generator if this is the main module
if (require.main === module) {
    generateSamplePDFs();
}

// Export the function for use in other modules
module.exports = generateSamplePDFs;