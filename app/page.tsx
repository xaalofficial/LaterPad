"use client"

import { useState, useEffect } from "react"
import { QuickInput } from "@/components/quick-input"
import { NotesList } from "@/components/notes-list"
import { AboutSection } from "@/components/about-section"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Zap, Archive, ArrowLeft, ArrowRight, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { useSwipe } from "@/hooks/use-swipe"

type Tab = "add" | "notes" | "about"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 p-0"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("add")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [noteCount, setNoteCount] = useState(0)

  const handleNoteSaved = () => {
    setRefreshTrigger((prev) => prev + 1)
    setNoteCount((prev) => prev + 1)
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow key navigation between tabs
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (activeTab === "notes") setActiveTab("add")
        else if (activeTab === "about") setActiveTab("notes")
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        if (activeTab === "add") setActiveTab("notes")
        else if (activeTab === "notes") setActiveTab("about")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [activeTab])

  // Swipe navigation for mobile
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      if (activeTab === "add") setActiveTab("notes")
      else if (activeTab === "notes") setActiveTab("about")
    },
    onSwipeRight: () => {
      if (activeTab === "notes") setActiveTab("add")
      else if (activeTab === "about") setActiveTab("notes")
    },
    threshold: 50,
  })

  const tabs = [
    {
      id: "add" as Tab,
      label: "Quick Add",
      icon: Zap,
      description: "Capture instantly",
    },
    {
      id: "notes" as Tab,
      label: "All Notes",
      icon: Archive,
      description: "Browse & search",
      badge: noteCount > 0 ? noteCount : undefined,
    },
    {
      id: "about" as Tab,
      label: "About",
      icon: Info,
      description: "Learn more",
    },
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      <div
        className="min-h-screen bg-background"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold">LaterPad</h1>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Quick Actions - only show on desktop */}
                <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    <ArrowRight className="h-3 w-3" />
                    <span>Navigate</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs">Ctrl+F</kbd>
                    <span>Search</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs">Ctrl+⏎</kbd>
                    <span>Save</span>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto bg-muted rounded-lg p-1 gap-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative h-auto py-2 sm:h-12 px-3 sm:px-6 gap-2 sm:gap-3 transition-all duration-200 justify-start sm:justify-center ${
                      isActive ? "shadow-sm" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tab.label}</span>
                        {tab.badge && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {tab.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{tab.description}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "add" && (
              <div className="animate-in fade-in-50 duration-200">
                <QuickInput onNoteSaved={handleNoteSaved} />
              </div>
            )}

            {activeTab === "notes" && (
              <div className="animate-in fade-in-50 duration-200">
                <NotesList refreshTrigger={refreshTrigger} onNotesCountChange={setNoteCount} />
              </div>
            )}

            {activeTab === "about" && (
              <div className="animate-in fade-in-50 duration-200">
                <AboutSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
