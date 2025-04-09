# MetaVault: Multi-Chain Crypto Wallet

MetaVault is a modern, secure multi-chain cryptocurrency wallet application built with Next.js, TypeScript, and PostgreSQL. It allows users to create, manage, and use wallets across multiple blockchain networks from a single interface.

![alt text](image.png)

## 🚀 Features

- **Multi-Chain Support**: Manage ETH, BTC, SOL, and POLYGON wallets from a single application
- **Secure User Authentication**: JWT-based authentication system with encrypted password storage
- **Hierarchical Deterministic Wallets**: Generate multiple wallet addresses from a single mnemonic phrase
- **BIP39 Mnemonic Generation**: Industry-standard seed phrase generation for wallet backup and recovery
- **Transfer Crypto**: Send and receive crypto between wallets of the same type
- **QR Code Generation**: Easy wallet address sharing via QR codes
- **Multiple Account Management**: Create and switch between different accounts with separate wallet sets

## 💻 Technology Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Crypto Libraries**: bip39 for mnemonic generation, ethers.js for wallet derivation
- **UI Components**: Lucide React icons, QRCode React

## 📋 Project Structure

```
├── prisma/                 # Prisma schema and migrations
│   ├── migrations/         # Database migration files
│   └── schema.prisma       # Database schema definition
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── v1/         # API version 1 endpoints
│   │   ├── dashboard/      # Mnemonic generation page
│   │   ├── homePage/       # Main wallet interface
│   │   ├── receive/        # Receive crypto page
│   │   ├── signin/         # User login page
│   │   ├── signup/         # User registration page
│   │   ├── transfer/       # Transfer crypto page
│   │   ├── lib/           # Shared libraries and utilities
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout component
│   │   └── page.tsx       # Landing page
│   └── middleware.ts      # Next.js middleware for auth protection
```

## 🔐 Security Features

- **HttpOnly JWT Cookies**: Prevents XSS attacks by storing authentication tokens in secure cookies
- **Encrypted Passwords**: Uses bcrypt for secure password hashing
- **Private Key Security**: Private keys are never exposed to the frontend
- **Mnemonic Protection**: One-time display of mnemonics with warnings to securely store them
- **Transaction Validation**: Server-side validation of all crypto transfers
- **Unique Key Derivation**: User-specific derivation paths to ensure wallet uniqueness

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/metavault.git
   cd metavault
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/metavault"
   SECRET_KEY="your-secret-key-for-jwt"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage Flow

1. **Sign Up**: Create an account with username, email, and password
2. **Generate Mnemonic**: Securely save your 12-word recovery phrase
3. **Home Page**: View your wallets across different blockchain networks
4. **Create Account**: Generate a new set of wallets (ETH, BTC, SOL, POLYGON)
5. **Transfer**: Send crypto to other wallet addresses
6. **Receive**: Generate QR code for your wallet address to receive funds

## 🧪 Testing

To run the test suite:

```bash
npm test
# or
yarn test
```

## 🔄 API Endpoints

- **POST /api/v1/signup**: Create a new user account
- **POST /api/v1/signin**: Authenticate and receive JWT token
- **POST /api/v1/generateMnemonics**: Generate a BIP39 mnemonic for the user
- **POST /api/v1/createAccount**: Create a new set of wallets
- **GET /api/v1/fetchAccount**: Retrieve user's wallets and balances
- **POST /api/v1/transfer**: Transfer crypto between wallets

## 📈 Future Enhancements

- Integration with real blockchain networks
- Transaction history tracking
- Token swaps between different cryptocurrencies
- Mobile app version
- Hardware wallet integration
- Multi-signature wallet support


## ⚠️ Disclaimer

This project is intended for educational purposes only. It uses simulated balances and does not connect to actual blockchain networks. Do not use it to store or transfer real cryptocurrency.


---

Made with ❤️ by [Shivam Yadav]