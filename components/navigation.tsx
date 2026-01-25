"use client";

import { motion } from "framer-motion";
import { Menu, X, Sparkles, User, LogOut, Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AISettingsModal } from "./ai-settings-modal";
import { useAuth } from "./auth-provider";
import Link from "next/link";

type View = "home" | "gallery" | "reading" | "guidebook" | "spread-builder";

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const { isAuthenticated, profile, signOut, isLoading } = useAuth();

  const navItems: { label: string; view: View }[] = [
    { label: "Home", view: "home" },
    { label: "The Deck", view: "gallery" },
    { label: "Reading", view: "reading" },
    { label: "Create Spread", view: "spread-builder" },
    { label: "Guidebook", view: "guidebook" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center group-hover:border-primary transition-colors">
            <span className="text-sm font-serif text-gold-gradient">A</span>
          </div>
          <span className="text-lg font-semibold tracking-wider text-gold-gradient hidden sm:block">
            ADINKRAROTA
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative px-4 py-2 text-sm font-serif transition-colors ${
                currentView === item.view
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {currentView === item.view && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
          
          {/* AI Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAISettings(true)}
            className="ml-2 gap-2 text-muted-foreground hover:text-primary"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden lg:inline">AI</span>
          </Button>
        </div>

        {/* User Menu / Auth */}
        <div className="flex items-center gap-2">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link href="/portal">
                    <Button variant="ghost" size="sm" className="gap-2">
                      {profile?.accountType === "member" ? (
                        <Crown className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {profile?.displayName || "Portal"}
                      </span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="hidden sm:flex"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
        >
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md font-serif transition-colors ${
                  currentView === item.view
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowAISettings(true);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md font-serif text-muted-foreground hover:bg-accent"
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Settings
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-md font-serif text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </motion.nav>
  );
}
