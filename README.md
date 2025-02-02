# Blockchain Analytics Dashboard

A real-time cryptocurrency analytics platform built with React, TypeScript, and Tailwind CSS. Track cryptocurrency prices, market statistics, and detailed asset information with a beautiful, responsive interface.

![Blockchain Analytics Dashboard](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232&ixlib=rb-4.0.3)

## Features

- 🚀 Real-time cryptocurrency price tracking
- 📊 Interactive price charts with multiple timeframes
- 💹 Live market statistics and indicators
- 🌓 Dark/Light theme support
- 📱 Fully responsive design
- ⚡ Live ticker with top cryptocurrencies
- 🕒 Real-time clock and date display

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockchain-analytics.git
cd blockchain-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
blockchain-analytics/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── index.html           # HTML template
```

## Key Features

### Dashboard
- Overview of top cryptocurrencies
- Market statistics and trends
- Real-time price updates
- Interactive price charts

### Asset Details
- Detailed information for each cryptocurrency
- Historical price data
- Supply information
- Price statistics
- Asset description

### Live Ticker
- Real-time price updates
- Price change indicators
- Smooth scrolling animation
- Pause on hover

## API Integration

This project uses the CoinGecko API for cryptocurrency data. The following endpoints are utilized:

- `/coins/markets` - For market data and top cryptocurrencies
- `/coins/{id}` - For detailed asset information
- `/global` - For global market statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for charts
- [Lucide React](https://lucide.dev) for icons