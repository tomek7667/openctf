"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Eye,
  Edit,
  Save,
  Upload,
  Terminal,
  Code,
  Shield,
  Zap,
  Cpu,
  Lock,
  Search,
  X,
  Plus,
  HelpCircle
} from "@/components/ui/icons";
import { createWriteup, Writeup } from "@/api/writeups";

// Import highlight.js themes
import "highlight.js/styles/tokyo-night-dark.css";

const categories = [
  { id: 'web', label: 'Web Exploitation', icon: Code, color: 'from-blue-500 to-purple-500' },
  { id: 'crypto', label: 'Cryptography', icon: Lock, color: 'from-purple-500 to-pink-500' },
  { id: 'reverse', label: 'Reverse Engineering', icon: Cpu, color: 'from-pink-500 to-red-500' },
  { id: 'pwn', label: 'Binary Exploitation', icon: Zap, color: 'from-red-500 to-orange-500' },
  { id: 'forensics', label: 'Digital Forensics', icon: Search, color: 'from-orange-500 to-yellow-500' },
  { id: 'misc', label: 'Miscellaneous', icon: Shield, color: 'from-yellow-500 to-green-500' },
];

const difficulties = [
  { id: 'Easy', label: 'Easy', color: 'text-green-400' },
  { id: 'Medium', label: 'Medium', color: 'text-yellow-400' },
  { id: 'Hard', label: 'Hard', color: 'text-orange-400' },
  { id: 'Insane', label: 'Insane', color: 'text-red-400' },
];

const defaultTemplate = `# Challenge Name

## Challenge Overview

Brief description of the challenge and what it involves.

## Initial Analysis

Describe your initial approach and reconnaissance.

\`\`\`bash
# Example command
curl -X GET "https://example.com/api"
\`\`\`

## Solution

Step-by-step explanation of your solution.

### Step 1: Discovery

Explanation of the first step.

\`\`\`python
#!/usr/bin/env python3
# Your exploit code here
import requests

response = requests.get("https://example.com")
print(response.text)
\`\`\`

### Step 2: Exploitation

Continue with the exploitation process.

## Key Takeaways

Important lessons learned from this challenge:

> Remember to always validate your inputs and use proper sanitization!

- Point 1
- Point 2
- Point 3

## References

- [Link to documentation](https://example.com)
- [Related writeup](https://example.com)
`;

function HackerMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-green max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4 border-l-4 border-green-400 pl-4">
              &gt; {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold font-mono text-green-400 mt-6 mb-3 border-l-2 border-green-400 pl-3">
              [[ {children} ]]
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold font-mono text-blue-400 mt-4 mb-2">
              &gt;&gt; {children}
            </h3>
          ),
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded font-mono text-sm border border-green-500/30" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-gray-900/90 backdrop-blur border border-green-500/30 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 border-b border-green-500/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="font-mono text-xs text-gray-400">{className?.replace('language-', '') || 'code'}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              </div>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 bg-blue-900/20 pl-4 py-3 my-4 italic text-blue-300 font-mono">
              💡 {children}
            </blockquote>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-4 font-mono">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start space-x-2 text-gray-300 font-mono">
              <span className="text-green-400 mt-1">&gt;</span>
              <span>{children}</span>
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function MarkdownGuide() {
  return (
    <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
      <h3 className="font-mono text-green-400 font-bold mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2" />
        MARKDOWN GUIDE
      </h3>
      <div className="space-y-3 text-sm font-mono text-gray-300">
        <div>
          <div className="text-green-400 mb-1">Headers:</div>
          <div className="bg-gray-900/50 p-2 rounded">
            # H1 Header<br/>
            ## H2 Header<br/>
            ### H3 Header
          </div>
        </div>
        <div>
          <div className="text-green-400 mb-1">Code:</div>
          <div className="bg-gray-900/50 p-2 rounded">
            `inline code`<br/>
            ```python<br/>
            # code block<br/>
            print("hello")<br/>
            ```
          </div>
        </div>
        <div>
          <div className="text-green-400 mb-1">Lists:</div>
          <div className="bg-gray-900/50 p-2 rounded">
            - Bullet point<br/>
            1. Numbered item
          </div>
        </div>
        <div>
          <div className="text-green-400 mb-1">Quotes:</div>
          <div className="bg-gray-900/50 p-2 rounded">
            &gt; Important note
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateWriteupPage() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(defaultTemplate);
  const [category, setCategory] = useState("web");
  const [difficulty, setDifficulty] = useState("Medium");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [contestName, setContestName] = useState("");
  const [challengeName, setChallengeName] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      const writeupData: Partial<Writeup> = {
        title,
        description,
        content,
        category: category as any,
        difficulty: difficulty as any,
        tags,
        contestName: contestName || undefined,
        challengeName: challengeName || undefined,
      };

      const response = await createWriteup(writeupData);
      if (response.success && response.data) {
        router.push(`/writeups/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating writeup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-6 font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO WRITEUPS
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-4">
                [CREATE WRITEUP]
              </h1>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Terminal className="h-5 w-5" />
                <span className="text-lg font-mono">&gt; Share your knowledge with the community</span>
                <div className="w-2 h-5 bg-green-400 animate-pulse" />
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
                >
                  <h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
                    <Edit className="h-5 w-5 mr-2" />
                    BASIC INFORMATION
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">TITLE</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter writeup title..."
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">DESCRIPTION</label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the writeup..."
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        multiline
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">CONTEST (Optional)</label>
                        <Input
                          value={contestName}
                          onChange={(e) => setContestName(e.target.value)}
                          placeholder="e.g. picoCTF 2024"
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">CHALLENGE (Optional)</label>
                        <Input
                          value={challengeName}
                          onChange={(e) => setChallengeName(e.target.value)}
                          placeholder="e.g. Web Gauntlet"
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Category and Difficulty */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
                >
                  <h2 className="font-mono text-green-400 font-bold mb-6">CLASSIFICATION</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">CATEGORY</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={`flex items-center space-x-2 p-3 rounded-lg font-mono text-sm transition-all ${
                                category === cat.id
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">DIFFICULTY</label>
                      <div className="space-y-2">
                        {difficulties.map((diff) => (
                          <button
                            key={diff.id}
                            type="button"
                            onClick={() => setDifficulty(diff.id)}
                            className={`w-full text-left p-3 rounded-lg font-mono text-sm transition-all ${
                              difficulty === diff.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                            }`}
                          >
                            [{diff.label.toUpperCase()}]
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
                >
                  <h2 className="font-mono text-green-400 font-bold mb-6">TAGS</h2>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add tags (press Enter)"
                        className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="font-mono border-green-500/50 text-green-400"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="font-mono text-green-400 border-green-500/50 group cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          #{tag}
                          <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Content Editor */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between bg-gray-800/50 px-6 py-4 border-b border-green-500/30">
                    <h2 className="font-mono text-green-400 font-bold flex items-center">
                      <Terminal className="h-5 w-5 mr-2" />
                      CONTENT
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={!isPreview ? "default" : "outline"}
                        onClick={() => setIsPreview(false)}
                        className="font-mono text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        EDIT
                      </Button>
                      <Button
                        type="button"
                        variant={isPreview ? "default" : "outline"}
                        onClick={() => setIsPreview(true)}
                        className="font-mono text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        PREVIEW
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {!isPreview ? (
                        <motion.div
                          key="editor"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your markdown content here..."
                            className="w-full h-96 bg-gray-900/50 border border-green-500/30 rounded-lg p-4 font-mono text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-400"
                            required
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="min-h-96 bg-gray-900/50 border border-green-500/30 rounded-lg p-4"
                        >
                          <HackerMarkdown content={content} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Actions */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-4">ACTIONS</h3>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={loading || !title.trim() || !description.trim() || !content.trim()}
                      className="w-full font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "PUBLISHING..." : "PUBLISH WRITEUP"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-mono border-gray-500 text-gray-400"
                      disabled
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      SAVE DRAFT
                    </Button>
                  </div>
                </div>

                {/* Markdown Guide */}
                <MarkdownGuide />

                {/* Preview Info */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-4">PREVIEW INFO</h3>
                  <div className="space-y-3 text-sm font-mono text-gray-300">
                    <div className="flex justify-between">
                      <span>Word count:</span>
                      <span className="text-green-400">{content.split(/\s+/).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Character count:</span>
                      <span className="text-green-400">{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated read:</span>
                      <span className="text-green-400">{Math.ceil(content.length / 200)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tags:</span>
                      <span className="text-green-400">{tags.length}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
