# 🏦 Wallet Connect App

A React-based web interface for connecting NEAR wallets to the Bitte.ai Discord Bot. This application provides a secure and user-friendly way for Discord users to link their wallets for on-chain interactions with Bitte.ai agents.

## 🚀 Features

- 🔐 Secure NEAR wallet connection
- 🎯 Discord user-wallet mapping
- 💫 Modern React + Vite setup
- 🔄 Real-time wallet status updates
- 🎨 Clean, responsive UI

## 🛠️ Tech Stack

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [NEAR Wallet Selector](https://github.com/near/wallet-selector) - Wallet Integration
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [React Query](https://tanstack.com/query/latest) - Data Fetching

## 🏗️ Project Structure

```
wallet-connect-app/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and wallet services
│   ├── styles/        # Global styles
│   └── App.jsx        # Main application component
├── public/            # Static assets
└── index.html         # Entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- NEAR Wallet Selector Project ID

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Adding New Features

1. Create new components in `src/components/`
2. Add custom hooks in `src/hooks/`
3. Implement wallet services in `src/services/`
4. Update styles in `src/styles/`

## 🔒 Security

- Secure wallet connection handling
- Environment variable protection
- CORS configuration
- Rate limiting
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

Part of the [Bitte.ai Discord Bot](../README.md) project
