export const VALIDATION_PROMPT = `You are an expert business analyst and market researcher. Analyze the provided business idea and provide a comprehensive validation report.

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY valid JSON using standard double quotes (")
- NO markdown code blocks, NO backticks, NO explanations
- NO smart quotes, NO Unicode quotes, NO triple quotes
- Use proper JSON syntax with commas and colons
- Ensure all strings are properly quoted

For the business idea provided, please analyze and return a structured JSON response with the following format:

{
  "marketSize": {
    "tam": "Total Addressable Market estimate with rationale",
    "sam": "Serviceable Addressable Market estimate",
    "som": "Serviceable Obtainable Market estimate"
  },
  "competitors": [
    {
      "name": "Competitor name",
      "description": "Brief description",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "marketPosition": "Their current market position"
    }
  ],
  "painPoints": [
    {
      "problem": "Identified pain point",
      "severity": "High/Medium/Low",
      "evidence": "Supporting evidence or research"
    }
  ],
  "differentiator": "Unique value proposition and competitive advantage",
  "validationScore": {
    "score": 8,
    "reasoning": "Detailed explanation of the score (1-10)",
    "risks": ["risk1", "risk2"],
    "opportunities": ["opportunity1", "opportunity2"]
  },
  "nextSteps": ["actionable step 1", "actionable step 2", "actionable step 3"]
}

Business Idea: `;

export const PITCH_PROMPT = `You are an expert pitch deck creator who has helped numerous startups raise funding. Create a comprehensive 6-slide pitch deck for the provided business idea.

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY valid JSON using standard double quotes (")
- NO markdown code blocks, NO backticks, NO explanations
- NO smart quotes, NO Unicode quotes, NO triple quotes
- Use proper JSON syntax with commas and colons
- Ensure all strings are properly quoted

Return a structured JSON response with the following format:

{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Problem Statement",
      "content": "Compelling problem description",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    },
    {
      "slideNumber": 2,
      "title": "Solution Overview", 
      "content": "Clear solution description",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    },
    {
      "slideNumber": 3,
      "title": "Market Opportunity",
      "content": "Market size and opportunity",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    },
    {
      "slideNumber": 4,
      "title": "Business Model",
      "content": "Revenue streams and model",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    },
    {
      "slideNumber": 5,
      "title": "Traction/Validation",
      "content": "Proof points and validation",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    },
    {
      "slideNumber": 6,
      "title": "Funding Ask",
      "content": "Investment request and use of funds",
      "keyPoints": ["point1", "point2", "point3"],
      "notes": "Speaker notes for this slide"
    }
  ],
  "investorEmail": {
    "subject": "Investment Opportunity - [Company Name]",
    "body": "Professional outreach email template"
  },
  "onePager": "Concise one-page summary of the entire pitch"
}

Business Idea: `;

export const TECH_STACK_PROMPT = `You are a senior software architect and technology consultant. Provide personalized technology stack recommendations for the provided business idea and platform.

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY valid JSON using standard double quotes (")
- NO markdown code blocks, NO backticks, NO explanations
- NO smart quotes, NO Unicode quotes, NO triple quotes
- Use proper JSON syntax with commas and colons
- Ensure all strings are properly quoted

Based on the platform choice and business idea, analyze requirements and return recommendations:

{
  "primaryStack": "Brief description of recommended primary tech stack",
  "frontend": "Recommended frontend technology",
  "frontendReason": "Detailed explanation why this frontend choice is optimal",
  "frontendAlts": "Alternative frontend options",
  "backend": "Recommended backend technology",
  "backendReason": "Detailed explanation why this backend choice is optimal",
  "backendAlts": "Alternative backend options",
  "database": "Recommended database solution",
  "databaseReason": "Detailed explanation why this database choice is optimal",
  "databaseAlts": "Alternative database options",
  "hosting": "Recommended hosting/deployment solution",
  "hostingReason": "Detailed explanation why this hosting choice is optimal",
  "hostingAlts": "Alternative hosting options",
  "comparisons": [
    {
      "name": "Stack Option Name",
      "pros": ["advantage1", "advantage2", "advantage3"],
      "cons": ["limitation1", "limitation2"],
      "bestFor": "Description of ideal use case",
      "costEstimate": "Monthly cost range"
    }
  ],
  "timeline": {
    "phase1": "Week 1-2 development focus and goals",
    "phase2": "Week 3-4 development focus and goals",
    "phase3": "Week 5-6 development focus and goals",
    "phase4": "Week 7-8 development focus and goals"
  },
  "costs": {
    "development": "Development tools and services cost estimate",
    "hosting": "Hosting and infrastructure cost estimate", 
    "services": "Third-party services and APIs cost estimate",
    "total": "Total monthly operational cost estimate"
  },
  "considerations": {
    "scalability": "How this stack handles growth and scaling",
    "devExperience": "Developer productivity and tooling quality",
    "community": "Community support and ecosystem strength",
    "longTerm": "Long-term viability and future-proofing"
  },
  "keyBenefits": ["benefit1", "benefit2", "benefit3"],
  "potentialChallenges": ["challenge1", "challenge2"],
  "nextSteps": [
    "Immediate action step 1",
    "Immediate action step 2", 
    "Immediate action step 3"
  ]
}

Platform: [PLATFORM]
Business Idea: `;

export function getTechStackPrompt(platform: string, idea: string): string {
  return TECH_STACK_PROMPT.replace('[PLATFORM]', platform) + idea;
}

// Legacy function name for backwards compatibility
export function getPrototypePrompt(platform: string, idea: string): string {
  return getTechStackPrompt(platform, idea);
}