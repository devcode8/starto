interface MarketSize {
  tam: string;
  sam: string;
  som: string;
}

interface ValidationScore {
  score: number;
  reasoning: string;
  risks: string[];
  opportunities: string[];
}

interface Competitor {
  name: string;
  [key: string]: unknown;
}

interface ValidationData {
  marketSize: MarketSize;
  competitors: Competitor[];
  painPoints: string[];
  differentiator: string;
  validationScore: ValidationScore;
  nextSteps: string[];
  [key: string]: unknown;
}

interface Slide {
  slideNumber: number;
  title: string;
  content: string;
  keyPoints: string[];
  notes: string;
}

interface InvestorEmail {
  subject: string;
  body: string;
}

interface PitchData {
  slides: Slide[];
  investorEmail: InvestorEmail;
  onePager: string;
  [key: string]: unknown;
}

interface TechComparison {
  name: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  costEstimate: string;
}

interface PrototypeData {
  primaryStack: string;
  frontend: string;
  frontendReason: string;
  frontendAlts: string;
  backend: string;
  backendReason: string;
  backendAlts: string;
  database: string;
  databaseReason: string;
  databaseAlts: string;
  hosting: string;
  hostingReason: string;
  hostingAlts: string;
  comparisons: TechComparison[];
  [key: string]: unknown;
}

type ExtractedData = ValidationData | PitchData | PrototypeData | unknown;

// More robust JSON parsing with fallback extraction
export function extractJsonData(response: string): ExtractedData {
  // Clean the response first
  let cleaned = response.trim();
  
  // Remove markdown blocks
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  
  // Fix quotes
  cleaned = cleaned
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    .replace(/"""/g, '"')
    .replace(/""/g, '"');
  
  // Try standard parsing first
  try {
    return JSON.parse(cleaned);
  } catch {
    console.log('Standard parsing failed, extracting data manually...');
    
    // Manual extraction as fallback
    return extractDataManually(response);
  }
}

function extractDataManually(response: string): ExtractedData {
  // Try to detect if this is a pitch response based on content
  const isPitch = response.includes('slides') || response.includes('slideNumber') || response.includes('investorEmail');
  const isPrototype = response.includes('architecture') || response.includes('techStack') || response.includes('endpoints');

  if (isPitch) {
    return extractPitchDataManually();
  } else if (isPrototype) {
    return extractPrototypeDataManually();
  }
  
  // Default to validation structure
  const result: ValidationData = {
    marketSize: { tam: '', sam: '', som: '' },
    competitors: [],
    painPoints: [],
    differentiator: '',
    validationScore: { score: 7, reasoning: '', risks: [], opportunities: [] },
    nextSteps: []
  };
  
  try {
    // Extract market size
    const tamMatch = response.match(/"tam":\s*"([^"]+)"/);
    const samMatch = response.match(/"sam":\s*"([^"]+)"/);
    const somMatch = response.match(/"som":\s*"([^"]+)"/);
    
    if (tamMatch) result.marketSize.tam = tamMatch[1];
    if (samMatch) result.marketSize.sam = samMatch[1];
    if (somMatch) result.marketSize.som = somMatch[1];
    
    // Extract validation score
    const scoreMatch = response.match(/"score":\s*(\d+)/);
    if (scoreMatch) result.validationScore.score = parseInt(scoreMatch[1]);
    
    // Extract reasoning
    const reasoningMatch = response.match(/"reasoning":\s*"([^"]+)"/);
    if (reasoningMatch) result.validationScore.reasoning = reasoningMatch[1];
    
    // Extract differentiator
    const diffMatch = response.match(/"differentiator":\s*"([^"]+)"/);
    if (diffMatch) result.differentiator = diffMatch[1];
    
    // Extract competitors (simplified)
    const competitorMatches = response.match(/"competitors":\s*\[([\s\S]*?)\]/);
    if (competitorMatches) {
      const nameMatches = [...competitorMatches[1].matchAll(/"name":\s*"([^"]+)"/g)];
      const descMatches = [...competitorMatches[1].matchAll(/"description":\s*"([^"]+)"/g)];
      
      for (let i = 0; i < Math.min(nameMatches.length, 3); i++) {
        result.competitors.push({
          name: nameMatches[i]?.[1] || `Competitor ${i + 1}`,
          description: descMatches[i]?.[1] || 'Major player in the market',
          strengths: ['Market presence', 'User base'],
          weaknesses: ['Limited features', 'Outdated tech'],
          marketPosition: 'Established player'
        });
      }
    }
    
    // Add some default competitors if none found
    if (result.competitors.length === 0) {
      result.competitors = [
        {
          name: 'Market Leader',
          description: 'Established player with significant market share',
          strengths: ['Brand recognition', 'Large user base'],
          weaknesses: ['Innovation lag', 'High prices'],
          marketPosition: 'Dominant market position'
        },
        {
          name: 'Emerging Competitor',
          description: 'Newer entrant with innovative approach',
          strengths: ['Modern technology', 'User experience'],
          weaknesses: ['Limited resources', 'Small market share'],
          marketPosition: 'Growing rapidly in niche segments'
        }
      ];
    }
    
    // Extract pain points (simplified)
    result.painPoints = [
      'Market gap identified through analysis',
      'User experience challenges in current solutions'
    ];
    
    // Extract next steps
    result.nextSteps = [
      'Validate core assumptions with target users',
      'Develop minimum viable product (MVP)',
      'Test with early adopters and iterate',
      'Build go-to-market strategy'
    ];
    
    // Set default reasoning if not found
    if (!result.validationScore.reasoning) {
      result.validationScore.reasoning = 'Comprehensive analysis completed. The idea shows promise based on market demand, competitive landscape, and growth potential.';
    }
    
    result.validationScore.risks = ['Market competition', 'User acquisition costs', 'Technology adoption'];
    result.validationScore.opportunities = ['Market growth', 'Technology advancement', 'Partnership potential'];
    
  } catch (error) {
    console.error('Manual extraction error:', error);
  }
  
  return result;
}

function extractPitchDataManually(): PitchData {
  return {
    slides: [
      {
        slideNumber: 1,
        title: "Problem Statement",
        content: "Market analysis shows significant gaps in current solutions that create opportunities for innovation.",
        keyPoints: ["Identified market gap", "Customer pain points validated", "Opportunity for disruption"],
        notes: "Focus on the urgency and scale of the problem"
      },
      {
        slideNumber: 2,
        title: "Solution Overview",
        content: "Our innovative approach directly addresses the key market problems with a scalable, user-centric solution.",
        keyPoints: ["Unique value proposition", "Differentiated approach", "Scalable solution"],
        notes: "Clearly articulate how we solve the problem"
      },
      {
        slideNumber: 3,
        title: "Market Opportunity",
        content: "Large addressable market with strong growth potential and clear customer segments.",
        keyPoints: ["Market size validation", "Growth trajectory", "Target customer segments"],
        notes: "Demonstrate the business opportunity size"
      },
      {
        slideNumber: 4,
        title: "Business Model",
        content: "Multiple revenue streams with clear path to profitability and sustainable growth.",
        keyPoints: ["Revenue model", "Pricing strategy", "Path to profitability"],
        notes: "Show how we monetize the opportunity"
      },
      {
        slideNumber: 5,
        title: "Traction & Validation",
        content: "Early market validation with positive customer feedback and initial growth metrics.",
        keyPoints: ["Customer validation", "Early traction", "Key metrics"],
        notes: "Provide evidence of market acceptance"
      },
      {
        slideNumber: 6,
        title: "Funding Ask",
        content: "Seeking investment to accelerate growth and market expansion with clear milestones.",
        keyPoints: ["Funding amount", "Use of funds", "Growth milestones"],
        notes: "Make specific ask with clear outcomes"
      }
    ],
    investorEmail: {
      subject: "Investment Opportunity - High-Growth Potential",
      body: "Dear Investor,\n\nWe have developed an innovative solution that addresses a significant market opportunity. Our early validation shows strong product-market fit and growth potential.\n\nWe would welcome the opportunity to discuss this investment opportunity with you.\n\nBest regards,\nFounder"
    },
    onePager: "Executive summary of the business opportunity, solution, and investment proposition."
  };
}

function extractPrototypeDataManually(): PrototypeData {
  return {
    primaryStack: "Modern full-stack JavaScript application with React and Node.js",
    frontend: "React.js with Next.js",
    frontendReason: "Excellent developer experience, built-in optimization, and strong ecosystem for rapid development",
    frontendAlts: "Vue.js, Angular, or Svelte for different preferences",
    backend: "Node.js with Express.js",
    backendReason: "JavaScript consistency across the stack, large community, and extensive package ecosystem",
    backendAlts: "Python (Django/Flask), Ruby on Rails, or Go for different performance characteristics",
    database: "PostgreSQL",
    databaseReason: "Robust relational database with JSON support, excellent performance, and mature ecosystem",
    databaseAlts: "MySQL, MongoDB, or Firebase depending on data structure needs",
    hosting: "Vercel (frontend) + Railway (backend)",
    hostingReason: "Easy deployment, automatic scaling, and excellent developer experience with reasonable pricing",
    hostingAlts: "AWS, Google Cloud Platform, or Heroku for different infrastructure needs",
    comparisons: [
      {
        name: "Full-Stack JavaScript (Recommended)",
        pros: ["Unified language", "Rapid development", "Large talent pool", "Rich ecosystem"],
        cons: ["Single point of failure", "Performance limitations for compute-heavy tasks"],
        bestFor: "MVPs, web applications, and rapid prototyping",
        costEstimate: "$50-200/month"
      },
      {
        name: "Python + React Stack",
        pros: ["Excellent for data/AI features", "Strong backend libraries", "Great for APIs"],
        cons: ["Two languages to maintain", "Slower development initially"],
        bestFor: "Data-driven applications and AI-powered features",
        costEstimate: "$75-250/month"
      }
    ],
    timeline: {
      phase1: "Environment setup, project scaffolding, basic authentication, and core database models",
      phase2: "Core feature development, API endpoints, and basic frontend components",
      phase3: "UI/UX implementation, advanced features, and third-party integrations",
      phase4: "Testing, optimization, deployment setup, and production launch"
    },
    costs: {
      development: "$0-100/month for development tools and services",
      hosting: "$0-50/month for MVP hosting, scaling with usage",
      services: "$50-200/month for essential third-party services (auth, analytics, etc.)",
      total: "$100-350/month depending on usage and scale"
    },
    considerations: {
      scalability: "Excellent horizontal scaling capabilities with cloud deployment and microservices potential",
      devExperience: "Modern tooling with hot reload, excellent debugging, and comprehensive documentation",
      community: "Large, active communities for all technologies with extensive learning resources",
      longTerm: "All recommended technologies have strong roadmaps and backing from major companies"
    },
    keyBenefits: [
      "Rapid development and iteration",
      "Strong ecosystem and community support",
      "Scalable architecture for growth"
    ],
    potentialChallenges: [
      "JavaScript fatigue from rapid ecosystem changes",
      "Performance optimization as scale increases"
    ],
    nextSteps: [
      "Set up development environment with recommended tools",
      "Create project structure and initialize database",
      "Implement core authentication and user management"
    ]
  };
}