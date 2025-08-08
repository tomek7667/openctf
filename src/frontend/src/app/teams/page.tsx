"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Users, Shield, Flag, Search, Globe } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getTeams, TeamWithRanking } from "@/api/teams";
import { getCountryByCode, getPopularCountries } from "@/lib/countries";

export default function TeamsPage() {
	const [teams, setTeams] = useState<TeamWithRanking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				setIsLoading(true);
				const response = await getTeams({ limit: 50 });
				setTeams(response.items);
			} catch (error) {
				console.error("Error fetching teams:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTeams();
	}, []);

	const filteredTeams = teams.filter((team) =>
		team.name.toLowerCase().includes(search.toLowerCase())
	);

	const topTeams = filteredTeams.slice(0, 5);

	return (
		<MainLayout>
			<div className="min-h-screen p-4">
				{/* Header */}
				<div className="max-w-7xl mx-auto mb-6">
					<div className="flex items-center gap-3 mb-4">
						<Trophy className="h-6 w-6 text-primary" />
						<h1 className="text-2xl font-bold font-mono">TEAM RANKINGS</h1>
						<span className="text-sm text-muted-foreground">
							{teams.length} teams
						</span>
					</div>

					{/* Search */}
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search teams..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				<div className="max-w-7xl mx-auto">
					{isLoading ? (
						<div className="flex justify-center py-8">
							<LoadingSpinner size="md" />
						</div>
					) : (
						<>
							{/* Top 5 Teams */}
							{topTeams.length > 0 && (
								<div className="mb-8">
									<h2 className="text-xl font-bold font-mono mb-4 text-yellow-400">
										🏆 TOP 5 CHAMPIONS
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{topTeams.map((team, index) => (
											<div
												key={team.id}
												className={`p-4 rounded-lg border ${
													index === 0
														? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400"
														: index === 1
														? "bg-gradient-to-br from-gray-300/20 to-gray-500/20 border-gray-400"
														: index === 2
														? "bg-gradient-to-br from-amber-600/20 to-yellow-700/20 border-amber-600"
														: "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400"
												}`}
											>
												<div className="text-center">
													<div className="text-2xl mb-2">
														{getCountryByCode(team.country_code)?.flag || "🌍"}
													</div>
													<div className="text-lg font-bold mb-1">
														#{team.ranking}
													</div>
													<h3 className="font-bold text-sm mb-2">
														{team.name.toUpperCase()}
													</h3>
													<p className="text-xs text-muted-foreground mb-2">
														{team.description}
													</p>
													<div className="text-xs">
														<div>Rating: {team.ratingPoints.toLocaleString()}</div>
														<div>Contests: {team.contestsCount}</div>
													</div>
													{team.verified_at && (
														<Shield className="h-4 w-4 text-green-400 mx-auto mt-2" />
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* All Teams Table */}
							<div className="bg-card rounded border">
								<div className="p-4 border-b">
									<h2 className="font-bold text-blue-400">
										ALL TEAMS ({filteredTeams.length})
									</h2>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="p-3 text-left">Team</th>
												<th className="p-3 text-left">Country</th>
												<th className="p-3 text-left">Rating</th>
												<th className="p-3 text-left">Contests</th>
												<th className="p-3 text-left">Avg Place</th>
											</tr>
										</thead>
										<tbody>
											{filteredTeams.slice(0, 50).map((team) => (
												<tr key={team.id} className="border-b hover:bg-muted/20">
													<td className="p-3">
														<div className="flex items-center gap-2">
															<div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
																{team.ranking}
															</div>
															<div>
																<div className="font-bold text-sm">
																	{team.name}
																</div>
																<div className="text-xs text-muted-foreground">
																	{team.description}
																</div>
															</div>
														</div>
													</td>
													<td className="p-3">
														<div className="flex items-center gap-2">
															<span>{getCountryByCode(team.country_code)?.flag || "🌍"}</span>
															<span className="text-xs">{team.country_code}</span>
														</div>
													</td>
													<td className="p-3 font-mono text-sm">
														{team.ratingPoints.toLocaleString()}
													</td>
													<td className="p-3 text-sm">{team.contestsCount}</td>
													<td className="p-3 text-sm">{team.avgPlace.toFixed(1)}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</MainLayout>
	);
}
