# A/B Test Results Analyser

Statistical analysis tool for A/B tests with confidence intervals, significance testing, and visual comparison.

## Features

- **Statistical significance testing** with p-value calculations
- **Confidence interval visualisation**
- **Relative uplift** and conversion rate comparisons
- **Interactive charts** showing test performance
- **Sample size recommendations**
- **Clear visual indicators** for test conclusions
- **PDF export** of results

## Live Demo

Visit [https://ab-test-analyzer-brown.vercel.app](https://ab-test-analyzer-brown.vercel.app)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts for data visualisation
- jsPDF for PDF exports

## Getting Started

```bash
npm install
npm run dev
```

## How It Works

1. Enter your test details (channel, date range)
2. Input data for both variants:
   - Number of visitors
   - Number of conversions
3. The tool calculates:
   - Conversion rates for both variants
   - Statistical significance (p-value)
   - Confidence intervals
   - Relative uplift
   - Test recommendation

### Statistical Methods

- Uses z-test for proportion differences
- Calculates 95% confidence intervals
- Determines statistical significance at p < 0.05

## Built By

[Edou Mota](https://github.com/TheDuGuy) - RevOps & Marketing Automation Specialist
