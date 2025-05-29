"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Code, Zap, Target, Heart, Coffee } from "lucide-react"

export function AboutSection() {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleParagraphs((prev) => {
        if (prev < 4) return prev + 1
        clearInterval(timer)
        return prev
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: Zap, label: "Instant Capture", description: "No friction, just paste and go" },
    { icon: Target, label: "Smart Detection", description: "Auto-categorizes URLs, todos, and notes" },
    { icon: Code, label: "Learning Project", description: "Built to master Next.js and fullstack development" },
  ]

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold">About LaterPad</h2>
        </div>
      </div>

      {/* Story Cards */}
      <div className="space-y-6">
        {/* Problem Statement */}
        <Card
          className={`transition-all duration-700 ${
            visibleParagraphs >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">The Problem I Faced</h3>
                <p className="text-muted-foreground leading-relaxed">
                  LaterPad is a minimalist note-saving app I built to solve a real problem I face daily: the need to
                  quickly capture a thought, a URL, a task, or something I want to revisit — without worrying about
                  where to put it or how to organize it right away.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Solutions */}
        <Card
          className={`transition-all duration-700 ${
            visibleParagraphs >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Coffee className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">My Messy Workflow</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I often found myself using random text files or even a private Discord server just to quickly store
                  things. Tools like Notion were too slow and structured for this use case. I wanted something that
                  opened instantly, let me write or paste without friction, and helped me stay organized later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card
          className={`transition-all duration-700 ${
            visibleParagraphs >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">The Solution</h3>
                <div className="text-muted-foreground leading-relaxed">
                  That's how LaterPad came to life — based on the idea:{" "}
                  <Badge variant="secondary" className="mx-1 font-mono">
                    "Paste now, don't worry later."
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Journey */}
        <Card
          className={`transition-all duration-700 ${
            visibleParagraphs >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Learning Journey</h3>
                <p className="text-muted-foreground leading-relaxed">
                  It's also a personal learning project. I'm using it to deepen my skills in Next.js, improve as a
                  fullstack developer, and gain hands-on experience building a complete product — from backend API
                  routes to frontend UI and UX.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div
        className={`transition-all duration-700 delay-500 ${
          visibleParagraphs >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h3 className="text-xl font-semibold text-center mb-6">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">{feature.label}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div
        className={`text-center transition-all duration-700 delay-700 ${
          visibleParagraphs >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-muted/50 rounded-lg p-6">
          <p className="text-muted-foreground">
            Ready to start capturing your thoughts?{" "}
            <span className="inline-flex items-center gap-1">
              Press <kbd className="px-2 py-1 bg-background border rounded text-xs">←</kbd> to go back to Quick Add
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
