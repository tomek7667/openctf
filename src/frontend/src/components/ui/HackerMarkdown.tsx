"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface HackerMarkdownProps {
	content: string;
	setToastMessage?: (message: string) => void;
	setShowToast?: (show: boolean) => void;
}

export function HackerMarkdown({ content, setToastMessage, setShowToast }: HackerMarkdownProps) {
	return (
		<div className="max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					[
						rehypeHighlight,
						{
							detect: true,
							ignoreMissing: true,
							subset: false,
						},
					],
					rehypeRaw,
				]}
				components={{
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-3 border-l-4 border-green-400 pl-3 first:mt-0">
							&gt; {children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-xl font-bold font-mono text-green-400 mt-4 mb-2 border-l-2 border-green-400 pl-2 first:mt-0">
							[[ {children} ]]
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-lg font-bold font-mono text-blue-400 mt-3 mb-1.5 first:mt-0">
							&gt;&gt; {children}
						</h3>
					),
					code: ({ className, children, ...props }: any) => {
						const inline = !className;
						if (inline) {
							return (
								<code
									className="bg-gray-800 text-green-400 px-1 py-0.5 rounded font-mono text-sm border border-green-500/30"
									{...props}
								>
									{children}
								</code>
							);
						}
						return (
							<div className="relative group my-2 first:mt-0 last:mb-0">
								<div className="relative border border-green-500/30 rounded-lg overflow-hidden shadow-xl" style={{backgroundColor: '#0d1117'}}>
									<div className="flex items-center justify-between px-3 py-1.5 border-b border-green-500/30" style={{backgroundColor: '#0d1117'}}>
										<div className="flex items-center space-x-2">
											<div className="w-3 h-3 rounded-full bg-red-500"></div>
											<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
											<div className="w-3 h-3 rounded-full bg-green-500"></div>
										</div>
										<div className="flex items-center space-x-2">
											<span className="font-mono text-xs text-green-400 font-semibold">
												{className?.replace("language-", "") || "text"}
											</span>
											{setToastMessage && setShowToast && (
												<button
													type="button"
													onClick={async (e) => {
														e.preventDefault();
														e.stopPropagation();

														const codeElement = e.currentTarget
															?.closest(".relative")
															?.querySelector("pre code");

														const codeText = codeElement?.textContent || '';

														if (!codeText.trim()) {
															setToastMessage("No code to copy");
															setShowToast(true);
															setTimeout(() => setShowToast(false), 3000);
															return;
														}

														if (navigator.clipboard) {
															navigator.clipboard.writeText(codeText.trim()).catch(() => {});
														} else {
															const textArea = document.createElement('textarea');
															textArea.value = codeText.trim();
															document.body.appendChild(textArea);
															textArea.select();
															document.execCommand('copy');
															document.body.removeChild(textArea);
														}
														setToastMessage("Code copied to clipboard!");
														setShowToast(true);
														setTimeout(() => setShowToast(false), 3000);

														const btn = e.currentTarget;
														btn.classList.add("text-green-400");
														setTimeout(() => {
															btn.classList.remove("text-green-400");
														}, 1000);
													}}
													className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110"
													title="Copy code"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
														/>
													</svg>
												</button>
											)}
										</div>
									</div>
									<div className="relative" style={{backgroundColor: '#0d1117'}}>
										<pre className="p-3 overflow-x-auto text-sm leading-relaxed" style={{backgroundColor: '#0d1117'}}>
											<code className={className} {...props} style={{backgroundColor: 'transparent'}}>
												{children}
											</code>
										</pre>
									</div>
								</div>
							</div>
						);
					},
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-blue-400 bg-blue-900/20 pl-4 py-3 my-4 italic text-blue-300 font-mono first:mt-0 last:mb-0">
							💡 {children}
						</blockquote>
					),
					p: ({ children }) => (
						<p className="text-gray-300 leading-relaxed mb-4 font-mono first:mt-0 last:mb-0">
							{children}
						</p>
					),
					ul: ({ children }) => (
						<ul className="list-none space-y-2 mb-4 first:mt-0 last:mb-0">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="list-none space-y-2 mb-4 first:mt-0 last:mb-0">
							{children}
						</ol>
					),
					li: ({ children }) => (
						<li className="flex items-start space-x-2 text-gray-300 font-mono">
							<span className="text-green-400 mt-0.5 flex-shrink-0">&gt;</span>
							<span className="flex-1">{children}</span>
						</li>
					),
					a: ({ children, href }) => (
						<a
							href={href}
							className="text-blue-400 hover:text-blue-300 underline font-mono"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),
					img: ({ src, alt }) => (
						<img
							src={src}
							alt={alt}
							className="max-w-full h-auto rounded-lg border border-green-500/30 my-4 first:mt-0 last:mb-0"
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}