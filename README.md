# Starto

From idea spark to investor-ready startup. Transform your startup idea into a complete business package with GPT-5 powered validation, pitch decks, and tech stack recommendations - all in minutes, not weeks.

## Features

### 🔍 Idea Validator
- Comprehensive market research and analysis
- Competitor landscape with SWOT analysis  
- TAM/SAM/SOM market sizing estimates
- Validation score with actionable insights
- Exportable validation reports

### 🎯 Pitch Builder
- Professional 6-slide pitch deck generation
- Investor-ready presentation materials
- Email templates for outreach
- Speaker notes and talking points
- Multiple export formats

### ⚙️ Tech Stack Guide
- Personalized technology recommendations
- Stack comparison analysis
- Implementation timeline
- Cost breakdown
- Technical considerations

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- AIML API key for GPT-5 access

### Installation

1. Clone or download the project:
```bash
git clone <repository-url>
cd starto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API key:
```
OPENAI_API_KEY=your_aiml_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Complete Startup Package Workflow

1. **Validate Your Idea** (`/validator`)
   - Describe your business concept
   - Get market research and competitive analysis
   - Receive validation score and next steps
   - Export detailed validation report

2. **Build Your Pitch** (`/pitch-builder`) 
   - Input your validated idea
   - Generate professional 6-slide deck
   - Get investor email templates
   - Export presentation materials

3. **Create Technical Prototype** (`/prototype`)
   - Select your platform (Web, Mobile, API, Full-stack)
   - Generate architecture and code scaffolds
   - Get database schema and API designs
   - Export technical documentation

## API Integration

The application integrates with GPT-5 via the AIML API:

- **Base URL**: `https://api.aimlapi.com/v1`
- **Model**: `openai/gpt-5-chat-latest`
- **Features**: Structured JSON responses, comprehensive analysis, code generation

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **API**: GPT-5 via AIML API
- **Deployment**: Vercel-ready

## Project Structure

```
/src
  /app                 # Next.js app router pages
    /api              # API route handlers
    /dashboard        # Main dashboard
    /validator        # Idea validation module
    /pitch-builder    # Pitch deck generator
    /prototype        # Code scaffold generator
  /components         # Reusable UI components
  /lib               # Utilities and API integration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | AIML API key for GPT-5 access | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL for client-side requests | No |

## Demo Examples

### Idea Example
"An app that matches fitness coaches with people recovering from injuries, focusing on personalized rehabilitation programs and safe exercise routines"

This generates:
- Market analysis showing $15B+ rehabilitation market
- Competitor analysis of existing fitness/health platforms
- Technical architecture for matching algorithm
- 6-slide investor pitch highlighting unique positioning

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue in the repository
- Check existing documentation
- Review API integration examples

---

Built for the GPT-5 Hackathon 🚀
