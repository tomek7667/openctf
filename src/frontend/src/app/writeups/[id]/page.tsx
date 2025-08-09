"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  Star,
  Eye,
  Heart,
  Calendar,
  User,
  Trophy,
  Award,
  CheckCircle,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  Code,
  Shield,
  Zap,
  Cpu,
  Lock,
  Search,
  Edit,
  Copy,
  Download
} from "@/components/ui/icons";
import { 
  getWriteup, 
  getWriteupComments, 
  addWriteupComment, 
  rateWriteup, 
  Writeup, 
  WriteupComment 
} from "@/api/writeups";
import { useAuthStore } from "@/store/authStore";

// Import highlight.js themes
import "highlight.js/styles/tokyo-night-dark.css";

const categories = {
  web: { icon: Code, color: "from-blue-500 to-purple-500" },
  crypto: { icon: Lock, color: "from-purple-500 to-pink-500" },
  reverse: { icon: Cpu, color: "from-pink-500 to-red-500" },
  pwn: { icon: Zap, color: "from-red-500 to-orange-500" },
  forensics: { icon: Search, color: "from-orange-500 to-yellow-500" },
  misc: { icon: Shield, color: "from-yellow-500 to-green-500" },
};



function HackerMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-green max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 border-l-4 border-green-400 pl-4"
            >
              &gt; {children}
            </motion.h1>
          ),
          h2: ({ children }) => (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold font-mono text-green-400 mt-8 mb-4 border-l-2 border-green-400 pl-3"
            >
              [[ {children} ]]
            </motion.h2>
          ),
          h3: ({ children }) => (
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold font-mono text-blue-400 mt-6 mb-3"
            >
              &gt;&gt; {children}
            </motion.h3>
          ),
          img: ({ src, alt, title }) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group my-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gray-900/90 backdrop-blur border border-green-500/30 rounded-lg overflow-hidden p-4">
                <img
                  src={src}
                  alt={alt}
                  title={title}
                  className="w-full h-auto rounded-lg border border-green-500/20"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-32 bg-gray-800 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 font-mono text-sm';
                    fallback.innerHTML = `<span>❌ Image failed to load: ${alt || 'Unknown'}</span>`;
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
                {alt && (
                  <div className="mt-2 text-center text-sm text-gray-400 font-mono">
                    &gt; {alt}
                  </div>
                )}
                {title && (
                  <div className="mt-1 text-center text-xs text-gray-500 font-mono">
                    {title}
                  </div>
                )}
              </div>
            </motion.div>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors font-mono"
            >
              {children}
              {href?.startsWith('http') && (
                <span className="inline-block ml-1 text-xs">↗</span>
              )}
            </a>
          ),
          code: ({ className, children, ...props }: any) => {
            const inline = props.inline;
            if (inline) {
              return (
                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded font-mono text-sm border border-green-500/30" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
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
              </motion.div>
            );
          },
          blockquote: ({ children }) => (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-4 border-blue-400 bg-blue-900/20 pl-4 py-3 my-4 italic text-blue-300 font-mono"
            >
              💡 {children}
            </motion.blockquote>
          ),
          p: ({ children }) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 leading-relaxed mb-4 font-mono"
            >
              {children}
            </motion.p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-2 text-gray-300 font-mono"
            >
              <span className="text-green-400 mt-1">&gt;</span>
              <span>{children}</span>
            </motion.li>
          ),
          ol: ({ children }) => (
            <ol className="list-none space-y-2 mb-4 counter-reset-step">
              {children}
            </ol>
          ),
          table: ({ children }) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-x-auto mb-6"
            >
              <table className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg overflow-hidden">
                {children}
              </table>
            </motion.div>
          ),
          th: ({ children }) => (
            <th className="bg-green-900/30 text-green-400 font-mono font-bold px-4 py-3 text-left border-b border-green-500/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-gray-300 font-mono px-4 py-3 border-b border-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function StarRating({ rating, onRate, size = "md" }: { 
  rating: number; 
  onRate?: (rating: number) => void; 
  size?: "sm" | "md" | "lg" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          disabled={!onRate}
          className={`${sizeClasses[size]} transition-all ${
            star <= rating 
              ? "text-yellow-400 fill-current" 
              : "text-gray-600 hover:text-yellow-400"
          } ${onRate ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star className="w-full h-full" />
        </button>
      ))}
    </div>
  );
}

function CommentCard({ comment, onLike, onDislike }: { 
  comment: WriteupComment; 
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${comment.level > 0 ? 'ml-8 mt-4' : 'mt-6'}`}
    >
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:border-green-500/30 transition-colors">
        <div className="flex items-start space-x-3">
          {comment.avatarUrl && (
            <img 
              src={comment.avatarUrl} 
              alt={comment.username}
              className="w-8 h-8 rounded-full border border-green-500/50"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-mono font-bold text-green-400">@{comment.username}</span>
              <span className="text-gray-500 text-sm font-mono">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300 font-mono text-sm mb-3">
              {comment.content}
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onLike(comment.id)}
                className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="font-mono text-sm">{comment.likes}</span>
              </button>
              <button 
                onClick={() => onDislike(comment.id)}
                className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="font-mono text-sm">{comment.dislikes || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WriteupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [writeup, setWriteup] = useState<Writeup | null>(null);
  const [comments, setComments] = useState<WriteupComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadWriteup = async () => {
      try {
        const writeupResponse = await getWriteup(params.id as string);
        if (writeupResponse.success && writeupResponse.data) {
          setWriteup(writeupResponse.data);
        }

        const commentsResponse = await getWriteupComments(params.id as string);
        if (commentsResponse.success && commentsResponse.data) {
          setComments(commentsResponse.data);
        }
      } catch (error) {
        console.error('Error loading writeup:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWriteup();
  }, [params.id]);

  const handleRate = async (rating: number) => {
    if (!writeup) return;
    
    setUserRating(rating);
    try {
      await rateWriteup(writeup.id, rating);
      // Refresh writeup to get updated rating
      const response = await getWriteup(writeup.id);
      if (response.success && response.data) {
        setWriteup(response.data);
      }
    } catch (error) {
      console.error('Error rating writeup:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !writeup) return;

    try {
      const response = await addWriteupComment(writeup.id, newComment);
      if (response.success && response.data) {
        setComments([...comments, response.data]);
        setNewComment("");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Update comment likes locally
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislikeComment = async (commentId: string) => {
    // Update comment dislikes locally
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: (comment.dislikes || 0) + 1 }
        : comment
    ));
  };

  const handleShare = async () => {
    try {
      if (navigator.share && writeup) {
        await navigator.share({
          title: writeup.title,
          text: writeup.description,
          url: window.location.href
        });
      } else {
        handleCopyLink();
      }
    } catch (error) {
      // Fallback to copying URL
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSave = () => {
    // Toggle save state (in real app, this would save to user's bookmarks)
    alert('Writeup saved to your bookmarks!');
  };

  const handleExportMD = () => {
    if (!writeup) return;
    
    const markdown = `# ${writeup.title}\n\n${writeup.description}\n\n${writeup.content}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${writeup.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAuthorClick = () => {
    if (writeup?.authorId) {
      router.push(`/users/${writeup.authorId}`);
    }
  };

  const handleContestClick = () => {
    if (writeup?.contestId) {
      router.push(`/contests/${writeup.contestId}`);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (!writeup) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-mono text-red-400 mb-4">Writeup not found</h1>
          <Button onClick={() => router.back()}>Go back</Button>
        </div>
      </MainLayout>
    );
  }

  const categoryInfo = categories[writeup.category as keyof typeof categories];
  const Icon = categoryInfo?.icon || Shield;

  return (
    <MainLayout>
      <div className="min-h-screen relative">
        
        <div className="container mx-auto px-4 py-8 relative z-10">
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

            <div className="bg-card/30 border border-border rounded-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} bg-opacity-20 border border-current/30`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
                      {writeup.title}
                    </h1>
                    <p className="text-lg text-gray-300 font-mono mb-4">
                      {writeup.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {writeup.category.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`font-mono ${
                          writeup.difficulty === 'Easy' ? 'text-green-400 border-green-400' :
                          writeup.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-400' :
                          writeup.difficulty === 'Hard' ? 'text-orange-400 border-orange-400' :
                          'text-red-400 border-red-400'
                        }`}
                      >
                        [{writeup.difficulty.toUpperCase()}]
                      </Badge>
                      {writeup.featured && (
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-mono">FEATURED</span>
                        </div>
                      )}
                      {writeup.verified && (
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-mono">VERIFIED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {isAuthenticated && user?.id?.toString() === writeup.authorId && (
                    <Button
                      onClick={() => router.push(`/writeups/${writeup.id}/edit`)}
                      className="font-mono bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      EDIT
                    </Button>
                  )}
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="font-mono border-gray-500 text-gray-400 hover:border-green-500 hover:text-green-400"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    SHARE
                  </Button>
                  <Button 
                    onClick={handleSave}
                    variant="outline" 
                    className="font-mono border-gray-500 text-gray-400 hover:border-green-500 hover:text-green-400"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    SAVE
                  </Button>
                </div>
              </div>

              {/* Author and Contest Info */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    {writeup.authorAvatar && (
                      <img 
                        src={writeup.authorAvatar} 
                        alt={writeup.authorName}
                        className="w-10 h-10 rounded-full border-2 border-green-500/50"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-400" />
                        <button 
                          onClick={handleAuthorClick}
                          className="font-mono text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                        >
                          @{writeup.authorName}
                        </button>
                      </div>
                      {writeup.contestName && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Trophy className="h-4 w-4 text-gray-400" />
                          <button 
                            onClick={handleContestClick}
                            className="font-mono text-lime-400 underline text-sm hover:text-lime-300 transition-colors cursor-pointer"
                          >
                            {writeup.contestName}
                          </button>
                          {writeup.challengeName && (
                            <span className="font-mono text-gray-400 text-sm">/ {writeup.challengeName}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span className="font-mono">{writeup.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span className="font-mono">{writeup.likes}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-mono">{new Date(writeup.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {writeup.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-mono text-gray-400 border-gray-600">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-card/20 border border-border rounded-lg p-8">
                <HackerMarkdown content={writeup.content} />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Rating */}
              <div className="bg-card/30 border border-border rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-4">RATE THIS WRITEUP</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold font-mono text-yellow-400 mb-1">
                    {writeup.averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={writeup.averageRating} size="lg" />
                  <div className="text-sm text-gray-400 font-mono mt-1">
                    ({writeup.totalRatings} ratings)
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm font-mono text-gray-400 mb-2">Your rating:</div>
                  <div className="flex justify-center">
                    <StarRating rating={userRating} onRate={handleRate} size="lg" />
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-card/30 border border-border rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-4">SHARE</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleCopyLink}
                    variant="outline" 
                    className="w-full font-mono justify-start hover:border-green-500 hover:text-green-400"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button 
                    onClick={handleExportMD}
                    variant="outline" 
                    className="w-full font-mono justify-start hover:border-green-500 hover:text-green-400"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export MD
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="bg-card/20 border border-border rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold font-mono text-green-400">
                  COMMENTS ({comments.length})
                </h2>
              </div>

              {/* Add Comment */}
              <form onSubmit={handleComment} className="mb-8">
                <div className="mb-4">
                  <Input
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                    multiline
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    COMMENT
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onLike={handleLikeComment}
                    onDislike={handleDislikeComment}
                  />
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
