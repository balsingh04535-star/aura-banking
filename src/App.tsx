import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BankingProvider, useBanking } from './store/BankingContext';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { WelcomeTour } from './components/onboarding/WelcomeTour';
import { TopHeader } from './components/navigation/TopHeader';
import { FloatingNav } from './components/navigation/FloatingNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { PaymentsScreen } from './components/screens/PaymentsScreen';
import { CardsScreen } from './components/screens/CardsScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

// Global Modals & Sheets
import { SendMoneyModal } from './components/payments/SendMoneyModal';
import { RequestMoneyModal } from './components/payments/RequestMoneyModal';
import { AddMoneyModal } from './components/payments/AddMoneyModal';
import { TransactionDetailSheet } from './components/dashboard/TransactionDetailSheet';
import { SearchFilterSheet } from './components/dashboard/SearchFilterSheet';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { StatementsModal } from './components/profile/StatementsModal';
import { SupportChatModal } from './components/profile/SupportChatModal';

const BankingAppInner: React.FC = () => {
  const { activeTab, isOnboarded, setIsOnboarded } = useBanking();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isOnboarded) {
    return <WelcomeTour onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] dark:bg-[#0B0C0E] light:bg-[#F4F5F7] text-white dark:text-white light:text-[#0F172A] transition-colors duration-200 flex flex-col items-center">
      {/* Main Full Responsive Application Viewport */}
      <div className="w-full max-w-lg min-h-screen flex flex-col relative bg-[#0B0C0E]">
        {/* Top Header */}
        <TopHeader />

        {/* Main Screen Content */}
        <div className="flex-1 w-full relative z-10 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeScreen key="home" />}
            {activeTab === 'payments' && <PaymentsScreen key="payments" />}
            {activeTab === 'cards' && <CardsScreen key="cards" />}
            {activeTab === 'insights' && <InsightsScreen key="insights" />}
            {activeTab === 'profile' && <ProfileScreen key="profile" />}
          </AnimatePresence>
        </div>

        {/* Floating Bottom Navigation */}
        <FloatingNav />

        {/* Global Sheets & Modals */}
        <SendMoneyModal />
        <RequestMoneyModal />
        <AddMoneyModal />
        <TransactionDetailSheet />
        <SearchFilterSheet />
        <NotificationCenter />
        <StatementsModal />
        <SupportChatModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingAppInner />
    </BankingProvider>
  );
}
