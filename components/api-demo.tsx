"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, Copy, Check } from 'lucide-react'

export function ApiDemo() {
  const defaultPayload = {
    githubUrl: "https://github.com/langchain-ai/langchain",
  }

  const defaultResponse = {
    success: true,
    summary:
      "LangChain is a framework for developing LLM-powered applications. It provides a standard interface for models, embeddings, and data sources, enabling real-time data augmentation and model interoperability. Key features include integrations with various tools, vector stores, and model providers. It simplifies complex AI application development and adapts to evolving technology. It's part of an ecosystem including LangSmith for debugging and observability, and LangGraph for agent orchestration and deployment.",
    cool_facts: [
      "LangChain offers seamless integration with its ecosystem products like LangSmith and LangGraph.",
      "LangGraph, a low-level agent orchestration framework within the LangChain ecosystem, is used in production by companies like LinkedIn, Uber, Klarna, and GitLab.",
      "LangChain provides a Javascript/Typescript version: LangChain.js",
    ],
  }

  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("request")
  const [copied, setCopied] = useState(false)

  const handleSendRequest = async () => {
    try {
      setLoading(true)
      setActiveTab("response")

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set the default response
      setResponse(JSON.stringify(defaultResponse, null, 2))
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            success: false,
            error: "An error occurred while processing your request.",
          },
          null,
          2,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black/40 border-purple-500/20 text-white">
      <CardHeader className="">
        <CardTitle className="">API Demo</CardTitle>
        <CardDescription className="text-gray-400">
          Try out the GitHub Analyzer API with this interactive demo
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger value="request" className="">Request</TabsTrigger>
            <TabsTrigger value="response" className="">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="request" className="mt-4">
            <div className="min-h-[300px] rounded-md border border-purple-500/20 bg-black/30 p-4 font-mono text-sm text-gray-300 overflow-auto">
              <pre>{JSON.stringify(defaultPayload, null, 2)}</pre>
            </div>
          </TabsContent>
          <TabsContent value="response" className="mt-4">
            <div className="min-h-[300px] rounded-md border border-purple-500/20 bg-black/30 p-4 font-mono text-sm text-gray-300 overflow-auto relative">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : response ? (
                <>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1 rounded-md bg-black/30 hover:bg-black/50 text-gray-400 hover:text-white"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre>{response}</pre>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Send a request to see the response
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-gray-400">
          <span className="hidden sm:inline">Status:</span>
          {response ? (
            <span className="ml-2 px-2 py-1 rounded bg-green-500/20 text-green-300">200 OK</span>
          ) : (
            <span className="ml-2 px-2 py-1 rounded bg-gray-500/20 text-gray-300">Ready</span>
          )}
        </div>
        <Button variant="default" size="default" onClick={handleSendRequest} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Request
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}