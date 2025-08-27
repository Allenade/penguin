"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

import UserDropdown from "@/components/UserDropdown";
import UserProtectedRoute from "@/components/UserProtectedRoute";
import { useContent } from "@/lib/hooks/useContent";

export default function HuddlePage() {
  const { getContent } = useContent("huddle");
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handleInvestmentClick = (amount: number) => {
    setSelectedAmount(amount);
    setShowDepositModal(true);
  };

  const handleDepositClick = () => {
    setShowDepositModal(false);
    router.push("/dashboard/deposit");
  };

  const handleCloseModal = () => {
    setShowDepositModal(false);
  };

  return (
    <UserProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              ← Back to PENGU
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <UserDropdown />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Penguin Image */}
            <div className="mb-8 flex justify-center">
              <Image
                src={getContent("hero_image", "/image/pugin.jpeg")}
                alt="Pudgy Penguin Adventure"
                width={300}
                height={300}
                className="w-64 h-auto rounded-2xl shadow-2xl animate-float hover:scale-105 transition-all duration-300 hover:shadow-3xl"
                priority
              />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              {getContent(
                "hero_title",
                "Join the Pudgy Penguins Adventure! 🐧✨"
              )}
            </h1>

            {/* Welcome Text */}
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-semibold">
              <em>
                {getContent(
                  "hero_subtitle",
                  "Welcome to Pudgy Penguins Trading!"
                )}
              </em>
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* What Is Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {getContent("magic_title", "How the Magic Works")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-purple-400">1.</span>
                    <div>
                      <strong className="text-white">
                        {getContent("magic_step_1_title", "Create an Account")}
                      </strong>
                      <p className="text-blue-100 mt-1">
                        {getContent(
                          "magic_step_1_desc",
                          "Sign up to get your personal wallet address linked to Pengu Stocks."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-purple-400">2.</span>
                    <div>
                      <strong className="text-white">
                        {getContent(
                          "magic_step_2_title",
                          "Start Your Journey (Minimum $500)"
                        )}
                      </strong>
                      <p className="text-blue-100 mt-1">
                        {getContent(
                          "magic_step_2_desc",
                          "Begin your adventure by depositing at least $500 (in ETH/BTC/USDT/SOL/PENGU). Your funds are used to acquire Pengu Stocks directly."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-purple-400">3.</span>
                    <div>
                      <strong className="text-white">
                        Get Your Pengu Shares
                      </strong>
                      <p className="text-blue-100 mt-1">
                        Your deposit is converted into Pengu Stocks. You&apos;ll
                        see your holdings and total value in your portfolio
                        dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-purple-400">4.</span>
                    <div>
                      <strong className="text-white">
                        Watch the Magic Happen
                      </strong>
                      <p className="text-blue-100 mt-1">
                        As Pengu grows, your stock value increases. Verified
                        holders also unlock airdrops and exclusive benefits.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-purple-400">5.</span>
                    <div>
                      <strong className="text-white">Withdraw Anytime</strong>
                      <p className="text-blue-100 mt-1">
                        If you wish to exit, simply sell your Pengu Stocks and
                        withdraw your balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/image/happy.png"
                  alt="Happy Penguin"
                  width={250}
                  height={250}
                  className="w-56 h-auto animate-bounce hover:scale-110 transition-all duration-300 hover:rotate-6"
                />
              </div>
            </div>

            {/* Why Invest Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="flex justify-center order-2 md:order-1">
                <Image
                  src="/image/sit.png"
                  alt="Sitting Penguin"
                  width={250}
                  height={250}
                  className="w-56 h-auto animate-pulse hover:scale-110 transition-all duration-300 hover:-rotate-6"
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Success Stories
                </h2>
                <p className="text-lg text-blue-100 mb-4 italic">
                  (For Illustration Only)
                </p>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-purple-400/30">
                    <h3 className="text-xl font-bold text-white mb-3">
                      🚀 Starter Pack
                    </h3>
                    <div className="space-y-2">
                      <p className="text-blue-100">
                        <strong>$5,000 journey</strong>
                      </p>
                      <p className="text-blue-100">
                        With 20% growth in 30 days, portfolio ={" "}
                        <span className="text-green-400 font-bold">
                          $6,000 (+$1,000 profit)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 border border-purple-400/30">
                    <h3 className="text-xl font-bold text-white mb-3">
                      💎 Whale Package
                    </h3>
                    <div className="space-y-2">
                      <p className="text-blue-100">
                        <strong>$50,000 adventure</strong>
                      </p>
                      <p className="text-blue-100">
                        With 20% growth in 30 days, portfolio ={" "}
                        <span className="text-green-400 font-bold">
                          $60,000 (+$10,000 profit)
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-blue-100 mt-4">
                    <strong>
                      📊 Your success depends on market performance.
                    </strong>{" "}
                    The higher your journey, the greater your potential returns.
                  </p>
                </div>
              </div>
            </div>

            {/* Ready to Take the Plunge Section */}
            <div className="text-center mb-16">
              <div className="mb-8">
                <Image
                  src="/image/backgroundsixth.jpeg"
                  alt="Penguin Community"
                  width={600}
                  height={300}
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500 hover:shadow-3xl animate-float-slow"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Take the Plunge?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Don&apos;t just stand on the sidelines—immerse yourself in the
                world of Pudgy Penguins! Join the journey today, and let&apos;s
                embark on this exciting adventure together.
              </p>
              <p className="text-lg text-blue-200 italic mb-8">
                Join us now and make your mark in the Pudgy Penguins universe!
                🌊🐧
              </p>
            </div>

            {/* Investment Buttons */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-8">
                {getContent("investment_title", "Choose Your Adventure")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    amount: 500,
                    name: getContent("investment_amount_1", "Penguin Starter"),
                  },
                  {
                    amount: 1000,
                    name: getContent("investment_amount_2", "Ice Explorer"),
                  },
                  {
                    amount: 2000,
                    name: getContent("investment_amount_3", "Arctic Pioneer"),
                  },
                  {
                    amount: 5000,
                    name: getContent("investment_amount_4", "Blizzard Master"),
                  },
                  {
                    amount: 10000,
                    name: getContent("investment_amount_5", "Polar Legend"),
                  },
                ].map(({ amount, name }) => (
                  <Button
                    key={amount}
                    onClick={() => handleInvestmentClick(amount)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <div>
                      <div className="text-sm opacity-90">{name}</div>
                      <div className="text-lg">${amount.toLocaleString()}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-8">
                Connect With Our Community
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="https://discord.gg/pengu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg">
                    Join Discord
                  </Button>
                </Link>

                <Link
                  href="https://twitter.com/pengu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-lg text-lg">
                    Follow on X
                  </Button>
                </Link>

                <Link
                  href="https://t.me/pengu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-lg text-lg">
                    Telegram
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Images Grid */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Image
                src="/image/firstimagesilde.jpeg"
                alt="Penguin 1"
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg animate-float-delay-1"
              />
              <Image
                src="/image/2imageslide.jpeg"
                alt="Penguin 2"
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg animate-float-delay-2"
              />
              <Image
                src="/image/3slideimage.jpeg"
                alt="Penguin 3"
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg animate-float-delay-3"
              />
              <Image
                src="/image/4imageslide.jpeg"
                alt="Penguin 4"
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg animate-float-delay-4"
              />
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ready to Invest?
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="text-center mb-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">🐧</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    ${selectedAmount.toLocaleString()} Investment
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    You're about to start your Pudgy Penguins adventure with a $
                    {selectedAmount.toLocaleString()} investment.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Choose your preferred cryptocurrency</li>
                    <li>• Complete the deposit process</li>
                    <li>• Start earning with Pudgy Penguins</li>
                  </ul>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDepositClick}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  Go to Deposit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserProtectedRoute>
  );
}
