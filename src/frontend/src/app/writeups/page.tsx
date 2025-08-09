"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Filter,
  Star,
  Eye,
  Heart,
  BookOpen,
  PlusCircle,
  Award,
  CheckCircle,
  Terminal,
  Code,
  Shield,
  Zap,
  Cpu,
  Lock,
  Trophy
} from "@/components/ui/icons";
import { getWriteups, Writeup, WriteupFilters } from "@/api/writeups";

const categories = [
  { id: 'all', label: 'All Categories', icon: Terminal, color: 'from-green-500 to-blue-500' },
  { id: 'web', label: 'Web', icon: Code, color: 'from-blue-500 to-purple-500' },
  { id: 'crypto', label: 'Crypto', icon: Lock, color: 'from-purple-500 to-pink-500' },
  { id: 'reverse', label: 'Reverse', icon: Cpu, color: 'from-pink-500 to-red-500' },
  { id: 'pwn', label: 'Pwn', icon: Zap, color: 'from-red-500 to-orange-500' },
  { id: 'forensics', label: 'Forensics', icon: Search, color: 'from-orange-500 to-yellow-500' },
  { id: 'misc', label: 'Misc', icon: Shield, color: 'from-yellow-500 to-green-500' },
];

const difficulties = [
  { id: 'all', label: 'All Levels', color: 'text-gray-400' },
  { id: 'Easy', label: 'Easy', color: 'text-green-400' },
  { id: 'Medium', label: 'Medium', color: 'text-yellow-400' },
  { id: 'Hard', label: 'Hard', color: 'text-orange-400' },
  { id: 'Insane', label: 'Insane', color: 'text-red-400' },
];

const sortOptions = [
  { id: 'newest', label: 'Latest' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'views', label: 'Most Viewed' },
  { id: 'likes', label: 'Most Liked' },
];

function WriteupCard({ writeup }: { writeup: Writeup }) {
  const categoryInfo = categories.find(c => c.id === writeup.category) || categories[0];
  const difficultyInfo = difficulties.find(d => d.id === writeup.difficulty) || difficulties[0];
  const Icon = categoryInfo?.icon || Shield;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-card/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 h-full hover:border-green-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} bg-opacity-20 border border-current/30`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                <Link href={`/writeups/${writeup.id}`}>
                  {writeup.title}
                </Link>
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {writeup.category.toUpperCase()}
                </Badge>
                <span className={`text-xs font-mono ${difficultyInfo?.color || 'text-gray-400'}`}>
                  [{writeup.difficulty.toUpperCase()}]
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {writeup.featured && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <Award className="h-4 w-4" />
                <span className="text-xs font-mono">FEATURED</span>
              </div>
            )}
            {writeup.verified && (
              <CheckCircle className="h-4 w-4 text-green-400" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 font-mono">
          {writeup.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {writeup.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
              #{tag}
            </Badge>
          ))}
          {writeup.tags.length > 4 && (
            <Badge variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
              +{writeup.tags.length - 4} more
            </Badge>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Bottom section - Author, Contest, Stats */}
        <div>
          {/* Author and Contest */}
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
              {writeup.authorAvatar && (
                <img 
                  src={writeup.authorAvatar} 
                  alt={writeup.authorName}
                  className="w-6 h-6 rounded-full border border-green-500/50"
                />
              )}
              <span className="text-gray-300 font-mono">@{writeup.authorName}</span>
            </div>
            {writeup.contestName && (
              <div className="flex items-center space-x-1 text-gray-400">
                <Trophy className="h-4 w-4" />
                <Link href={`/contests/${writeup.contestId || '#'}`} className="font-mono text-lime-400 underline hover:text-lime-300 transition-colors">
                  {writeup.contestName}
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-mono">{writeup.averageRating.toFixed(1)}</span>
                <span className="text-xs">({writeup.totalRatings})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span className="font-mono">{writeup.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span className="font-mono">{writeup.likes}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {new Date(writeup.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GlowingHeader() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold font-mono text-foreground mb-2">
        WRITEUP_DATABASE
      </h1>
      <p className="text-sm text-muted-foreground font-mono">
        Explore comprehensive writeups from CTF competitions
      </p>
    </div>
  );
}

export default function WriteupsPage() {
  const [writeups, setWriteups] = useState<Writeup[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  const loadWriteups = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters: WriteupFilters = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
        sortBy: selectedSort as any,
      };

      const response = await getWriteups(currentFilters, currentPage, 12);
      if (response.success && response.data) {
        setWriteups(response.data.writeups);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading writeups:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedSort, currentPage]);

  useEffect(() => {
    loadWriteups();
  }, [loadWriteups]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadWriteups();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedSort("newest");
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div>
        <div>
          <GlowingHeader />

          {/* Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search writeups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                  />
                </div>
              </form>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  FILTERS
                </Button>
                
                <Link href="/writeups/create">
                  <Button className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    CREATE WRITEUP
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/30 border border-green-500/30 rounded-lg p-6 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">CATEGORY</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`flex items-center space-x-2 p-2 rounded-lg font-mono text-sm transition-all ${
                                selectedCategory === category.id
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{category.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">DIFFICULTY</label>
                      <div className="space-y-2">
                        {difficulties.map((difficulty) => (
                          <button
                            key={difficulty.id}
                            onClick={() => setSelectedDifficulty(difficulty.id)}
                            className={`w-full text-left p-2 rounded-lg font-mono text-sm transition-all ${
                              selectedDifficulty === difficulty.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                            }`}
                          >
                            [{difficulty.label.toUpperCase()}]
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">SORT BY</label>
                      <div className="space-y-2">
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedSort(option.id)}
                            className={`w-full text-left p-2 rounded-lg font-mono text-sm transition-all ${
                              selectedSort === option.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="font-mono border-gray-500 text-gray-400 hover:bg-gray-700/50"
                    >
                      RESET FILTERS
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* Writeups Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AnimatePresence>
                  {writeups.map((writeup) => (
                    <WriteupCard key={writeup.id} writeup={writeup} />
                  ))}
                </AnimatePresence>
              </div>

              {/* No Results */}
              {writeups.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-mono text-gray-400 mb-2">No writeups found</h3>
                  <p className="text-gray-500 font-mono">Try adjusting your search criteria or create a new writeup</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="font-mono border-green-500/50 text-green-400 disabled:opacity-50"
                  >
                    PREV
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-mono text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-green-500 text-black font-bold'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="font-mono border-green-500/50 text-green-400 disabled:opacity-50"
                  >
                    NEXT
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
