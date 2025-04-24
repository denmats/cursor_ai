'use client';

import Link from "next/link"
import Image from "next/image";
import { Github, FileText } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ApiDemo } from "@/components/api-demo"

export default function LandingPage() {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn('github');
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <Github className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Dmats AI Github Analyzer</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#demo" className="text-sm font-medium transition-colors hover:text-purple-400">
              Try It
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-purple-400">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="text-sm text-gray-400">Loading...</div>
            ) : session?.user ? (
              <>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full border border-white/20"
                  />
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {session.user.name ?? session.user.email}
                </span>
                <Button
                  variant="ghost"
                  size="default"
                  className="text-white hover:text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
                <Button
                  variant="default"
                  size="default"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  asChild
                >
                  <Link href="/dashboards">Manage API keys →</Link>
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="default"
                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                onClick={handleSignIn}
              >
                Sign in with GitHub
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
              <Badge variant="default" className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border-purple-500/20">
                API Studio is now in beta
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none max-w-3xl">
                Unlock the power of GitHub repositories
              </h1>
              <p className="max-w-[800px] text-gray-300 md:text-xl/relaxed">
                Get valuable summaries and cool facts on any open source GitHub repository.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row">
                <Button variant="default" size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                  <Link href="/login">Get Started →</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/50 text-purple-500 hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/documentation">
                    Read the docs <FileText className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
          </div>
        </section>

        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 bg-black/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Try It Yourself</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how Dmats AI Github Analyzer works with this interactive demo
                </p>
              </div>
            </div>

            <ApiDemo />
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that&apos;s right for you
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col bg-black/40 border border-purple-500/20 text-white rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-gray-400 mt-1">Perfect for getting started</p>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    $0
                    <span className="ml-1 text-sm font-medium text-gray-400">/month</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Track up to 5 repositories
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic analytics
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Daily updates
                    </li>
                  </ul>
                </div>
                <div className="bg-black/20 px-6 py-4 mt-auto">
                  <Button variant="default" size="default" className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col bg-black/40 border border-purple-500/20 text-white rounded-lg overflow-hidden relative">
                <Badge variant="default" className="absolute right-4 top-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/20">
                  Coming Soon
                </Badge>
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-gray-400 mt-1">For developers and small teams</p>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    $19
                    <span className="ml-1 text-sm font-medium text-gray-400">/month</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Track up to 50 repositories
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Real-time updates
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      PR monitoring
                    </li>
                  </ul>
                </div>
                <div className="bg-black/20 px-6 py-4 mt-auto">
                  <Button variant="default" size="default" className="w-full bg-gray-700 text-gray-300 cursor-not-allowed" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>

              <div className="flex flex-col bg-black/40 border border-purple-500/20 text-white rounded-lg overflow-hidden relative">
                <Badge variant="default" className="absolute right-4 top-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/20">
                  Coming Soon
                </Badge>
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-gray-400 mt-1">For organizations and large teams</p>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    $99
                    <span className="ml-1 text-sm font-medium text-gray-400">/month</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited repositories
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Premium analytics
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced PR monitoring
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-purple-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                  </ul>
                </div>
                <div className="bg-black/20 px-6 py-4 mt-auto">
                  <Button variant="default" size="default" className="w-full bg-gray-700 text-gray-300 cursor-not-allowed" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-white/10 py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center">
              <Github className="h-3 w-3" />
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Dmats AI Github Analyzer. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm text-gray-400 hover:text-white hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
