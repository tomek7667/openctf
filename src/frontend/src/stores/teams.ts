/**
 * Teams Store
 *
 * Manages teams data and related state with:
 * - Comprehensive filtering and sorting
 * - Optimistic updates
 * - Real-time data sync
 * - Advanced caching
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { teamsApi } from "@/api";
import {
	Team,
	ListTeamsDto,
	CreateTeamDto,
	TeamSortField,
	SortOrder,
	PaginatedResponse,
	FilterOptions,
} from "@/types/api";
import { ApiClientError } from "@/api/client";

// =============================================================================
// Types
// =============================================================================

interface TeamsState {
	// Data
	teams: Team[];
	currentTeam: Team | null;
	totalCount: number;

	// Pagination
	currentPage: number;
	pageSize: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;

	// Filtering & Sorting
	filters: {
		search: string;
		countryCodes: string[];
		year: number | undefined;
		verified?: undefined | boolean;
		minPoints?: undefined | number;
	};
	sortBy: TeamSortField;
	sortOrder: SortOrder;

	// UI State
	isLoading: boolean;
	isLoadingMore: boolean;
	error: string | null;

	// Cache & Metadata
	lastFetchTime: number;
	filterOptions: FilterOptions | null;
	selectedTeamIds: Set<number>;

	// Real-time updates
	pendingUpdates: Map<number, Partial<Team>>;
}

interface TeamsActions {
	// Data fetching
	fetchTeams: (params?: undefined | Partial<ListTeamsDto>) => Promise<void>;
	fetchMoreTeams: () => Promise<void>;
	fetchTeam: (teamId: number) => Promise<void>;
	refreshTeams: () => Promise<void>;

	// CRUD operations
	createTeam: (teamData: CreateTeamDto) => Promise<Team>;
	updateTeam: (
		teamId: number,
		teamData: Partial<CreateTeamDto>
	) => Promise<void>;
	deleteTeam: (teamId: number) => Promise<void>;

	// Filtering & Sorting
	setFilters: (filters: Partial<TeamsState["filters"]>) => void;
	setSorting: (sortBy: TeamSortField, sortOrder: SortOrder) => void;
	clearFilters: () => void;

	// Pagination
	setPage: (page: number) => void;
	setPageSize: (size: number) => void;

	// Team operations
	verifyTeam: (
		teamId: number,
		verified: boolean,
		reason?: undefined | string
	) => Promise<void>;
	mergeTeams: (
		mergerId: number,
		mergeeId: number,
		reason: string
	) => Promise<void>;

	// Selection
	selectTeam: (teamId: number) => void;
	deselectTeam: (teamId: number) => void;
	selectAllTeams: () => void;
	clearSelection: () => void;

	// Utility
	clearError: () => void;
	resetStore: () => void;

	// Real-time updates
	updateTeamOptimistic: (teamId: number, updates: Partial<Team>) => void;
	commitPendingUpdates: () => void;
	rollbackPendingUpdates: () => void;
}

type TeamsStore = TeamsState & TeamsActions;

// =============================================================================
// Initial State
// =============================================================================

const initialFilters = {
	search: "",
	countryCodes: [] as string[],
	year: undefined as number | undefined,
	verified: undefined as boolean | undefined,
	minPoints: undefined as number | undefined,
};

const initialState: TeamsState = {
	teams: [],
	currentTeam: null,
	totalCount: 0,
	currentPage: 0,
	pageSize: 30,
	hasNextPage: false,
	hasPrevPage: false,
	filters: initialFilters,
	sortBy: TeamSortField.POINTS,
	sortOrder: SortOrder.DESC,
	isLoading: false,
	isLoadingMore: false,
	error: null,
	lastFetchTime: 0,
	filterOptions: null,
	selectedTeamIds: new Set(),
	pendingUpdates: new Map(),
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useTeamsStore = create<TeamsStore>()(
	devtools(
		subscribeWithSelector(
			immer((set, get) => ({
				...initialState,

				// Data Fetching

				fetchTeams: async (params?: undefined | Partial<ListTeamsDto>) => {
					const currentState = get();

					set((state) => {
						state.isLoading = true;
						state.error = null;
					});

					try {
						const requestParams = {
							offset: currentState.currentPage * currentState.pageSize,
							limit: currentState.pageSize,
							sortBy: currentState.sortBy,
							sortOrder: currentState.sortOrder,
							...params,
							...(currentState.filters.countryCodes.length > 0 && {
								countryCodes: currentState.filters.countryCodes,
							}),
							...(currentState.filters.search && {
								search: currentState.filters.search,
							}),
							...(currentState.filters.year !== undefined && {
								year: currentState.filters.year,
							}),
							...(currentState.filters.verified !== undefined && {
								verified: currentState.filters.verified,
							}),
							...(currentState.filters.minPoints !== undefined && {
								minPoints: currentState.filters.minPoints,
							}),
						} as ListTeamsDto;

						const response: PaginatedResponse<Team> =
							await teamsApi.getTeams(requestParams);

						set((state) => {
							state.teams = response.items;
							state.totalCount = response.pagination.total;
							state.hasNextPage = response.pagination.hasNext;
							state.hasPrevPage = response.pagination.hasPrev;
							state.isLoading = false;
							state.lastFetchTime = Date.now();
						});
					} catch (error) {
						const errorMessage =
							error instanceof ApiClientError
								? error.message
								: "Failed to fetch teams";

						set((state) => {
							state.error = errorMessage;
							state.isLoading = false;
						});
						throw error;
					}
				},

				fetchMoreTeams: async () => {
					const { hasNextPage, isLoadingMore, currentPage } = get();

					if (!hasNextPage || isLoadingMore) return;

					set((state) => {
						state.isLoadingMore = true;
					});

					try {
						// Temporarily increment page for the request
						const nextPage = currentPage + 1;
						const currentState = get();

						const requestParams = {
							offset: nextPage * currentState.pageSize,
							limit: currentState.pageSize,
							sortBy: currentState.sortBy,
							sortOrder: currentState.sortOrder,
							...(currentState.filters.countryCodes.length > 0 && {
								countryCodes: currentState.filters.countryCodes,
							}),
							...(currentState.filters.search && {
								search: currentState.filters.search,
							}),
							...(currentState.filters.year !== undefined && {
								year: currentState.filters.year,
							}),
							...(currentState.filters.verified !== undefined && {
								verified: currentState.filters.verified,
							}),
							...(currentState.filters.minPoints !== undefined && {
								minPoints: currentState.filters.minPoints,
							}),
						} as ListTeamsDto;

						const response: PaginatedResponse<Team> =
							await teamsApi.getTeams(requestParams);

						set((state) => {
							state.teams = [...state.teams, ...response.items];
							state.currentPage = nextPage;
							state.hasNextPage = response.pagination.hasNext;
							state.isLoadingMore = false;
						});
					} catch (error) {
						set((state) => {
							state.isLoadingMore = false;
						});
						throw error;
					}
				},

				fetchTeam: async (teamId: number) => {
					try {
						const team = await teamsApi.getTeam(teamId);

						set((state) => {
							state.currentTeam = team;

							// Update in teams list if present
							const index = state.teams.findIndex((t) => t.id === teamId);
							if (index !== -1) {
								state.teams[index] = team;
							}
						});
					} catch (error) {
						throw error;
					}
				},

				refreshTeams: async () => {
					const { currentPage, pageSize } = get();
					await get().fetchTeams({
						offset: 0, // Reset to first page
						limit: (currentPage + 1) * pageSize, // Load all currently visible items
					});
				},

				// CRUD Operations

				createTeam: async (teamData: CreateTeamDto) => {
					set((state) => {
						state.isLoading = true;
						state.error = null;
					});

					try {
						const newTeam = await teamsApi.createTeam(teamData);

						set((state) => {
							state.teams.unshift(newTeam); // Add to beginning
							state.totalCount += 1;
							state.isLoading = false;
						});

						return newTeam;
					} catch (error) {
						const errorMessage =
							error instanceof ApiClientError
								? error.message
								: "Failed to create team";

						set((state) => {
							state.error = errorMessage;
							state.isLoading = false;
						});
						throw error;
					}
				},

				updateTeam: async (
					teamId: number,
					teamData: Partial<CreateTeamDto>
				) => {
					// Optimistic update
					const originalTeam = get().teams.find((t) => t.id === teamId);

					set((state) => {
						const index = state.teams.findIndex((t) => t.id === teamId);
						if (index !== -1) {
							Object.assign(state.teams[index]!, teamData);
						}
						if (state.currentTeam?.id === teamId) {
							Object.assign(state.currentTeam, teamData);
						}
					});

					try {
						const updatedTeam = await teamsApi.updateTeam(teamId, teamData);

						set((state) => {
							const index = state.teams.findIndex((t) => t.id === teamId);
							if (index !== -1) {
								state.teams[index] = updatedTeam;
							}
							if (state.currentTeam?.id === teamId) {
								state.currentTeam = updatedTeam;
							}
						});
					} catch (error) {
						// Rollback optimistic update
						if (originalTeam) {
							set((state) => {
								const index = state.teams.findIndex((t) => t.id === teamId);
								if (index !== -1) {
									state.teams[index] = originalTeam;
								}
								if (state.currentTeam?.id === teamId) {
									state.currentTeam = originalTeam;
								}
							});
						}
						throw error;
					}
				},

				deleteTeam: async (teamId: number) => {
					// Optimistic removal
					const originalIndex = get().teams.findIndex((t) => t.id === teamId);
					const originalTeam = get().teams[originalIndex];

					set((state) => {
						state.teams = state.teams.filter((t) => t.id !== teamId);
						state.totalCount -= 1;
						if (state.currentTeam?.id === teamId) {
							state.currentTeam = null;
						}
					});

					try {
						await teamsApi.deleteTeam(teamId);
					} catch (error) {
						// Rollback optimistic removal
						if (originalTeam) {
							set((state) => {
								state.teams.splice(originalIndex, 0, originalTeam);
								state.totalCount += 1;
							});
						}
						throw error;
					}
				},

				// Filtering & Sorting

				setFilters: (newFilters: Partial<TeamsState["filters"]>) => {
					set((state) => {
						state.filters = { ...state.filters, ...newFilters };
						state.currentPage = 0; // Reset pagination
					});

					// Automatically fetch with new filters
					get().fetchTeams();
				},

				setSorting: (sortBy: TeamSortField, sortOrder: SortOrder) => {
					set((state) => {
						state.sortBy = sortBy;
						state.sortOrder = sortOrder;
						state.currentPage = 0; // Reset pagination
					});

					get().fetchTeams();
				},

				clearFilters: () => {
					set((state) => {
						state.filters = {
							search: "",
							countryCodes: [],
							year: undefined,
							verified: undefined,
							minPoints: undefined,
						};
						state.currentPage = 0;
					});

					get().fetchTeams();
				},

				// Pagination

				setPage: (page: number) => {
					set((state) => {
						state.currentPage = page;
					});

					get().fetchTeams();
				},

				setPageSize: (size: number) => {
					set((state) => {
						state.pageSize = size;
						state.currentPage = 0; // Reset to first page
					});

					get().fetchTeams();
				},

				// Team Operations

				verifyTeam: async (
					teamId: number,
					verified: boolean
					// reason?: string
				) => {
					// Optimistic update
					set((state) => {
						const index = state.teams.findIndex((t) => t.id === teamId);
						if (index !== -1) {
							state.teams[index]!.verifiedAt = verified
								? new Date().toISOString()
								: undefined;
						}
						if (state.currentTeam?.id === teamId) {
							state.currentTeam.verifiedAt = verified
								? new Date().toISOString()
								: undefined;
						}
					});

					try {
						// await teamsApi.verifyTeam({ teamId, verified, reason });
					} catch (error) {
						// Rollback optimistic update
						set((state) => {
							const index = state.teams.findIndex((t) => t.id === teamId);
							if (index !== -1) {
								state.teams[index]!.verifiedAt = !verified
									? new Date().toISOString()
									: undefined;
							}
							if (state.currentTeam?.id === teamId) {
								state.currentTeam.verifiedAt = !verified
									? new Date().toISOString()
									: undefined;
							}
						});
						throw error;
					}
				},

				mergeTeams: async (
					mergerId: number,
					mergeeId: number
					// reason: string
				) => {
					try {
						// await teamsApi.mergeTeams({ mergerId, mergeeId, reason });

						// Remove the merged team from the list
						set((state) => {
							state.teams = state.teams.filter((t) => t.id !== mergeeId);
							state.totalCount -= 1;
						});

						// Refresh the merger team data
						get().fetchTeam(mergerId);
					} catch (error) {
						throw error;
					}
				},

				// Selection

				selectTeam: (teamId: number) => {
					set((state) => {
						state.selectedTeamIds.add(teamId);
					});
				},

				deselectTeam: (teamId: number) => {
					set((state) => {
						state.selectedTeamIds.delete(teamId);
					});
				},

				selectAllTeams: () => {
					set((state) => {
						state.teams.forEach((team) => {
							state.selectedTeamIds.add(team.id);
						});
					});
				},

				clearSelection: () => {
					set((state) => {
						state.selectedTeamIds.clear();
					});
				},

				// Utility

				clearError: () => {
					set((state) => {
						state.error = null;
					});
				},

				resetStore: () => {
					set(() => ({
						...initialState,
						selectedTeamIds: new Set(),
						pendingUpdates: new Map(),
					}));
				},

				// Real-time Updates

				updateTeamOptimistic: (teamId: number, updates: Partial<Team>) => {
					set((state) => {
						// Store pending update
						const existing = state.pendingUpdates.get(teamId) || {};
						state.pendingUpdates.set(teamId, { ...existing, ...updates });

						// Apply optimistic update
						const index = state.teams.findIndex((t) => t.id === teamId);
						if (index !== -1) {
							Object.assign(state.teams[index]!, updates);
						}
						if (state.currentTeam?.id === teamId) {
							Object.assign(state.currentTeam, updates);
						}
					});
				},

				commitPendingUpdates: () => {
					set((state) => {
						state.pendingUpdates.clear();
					});
				},

				rollbackPendingUpdates: () => {
					// This would require storing original values, implemented as needed
					set((state) => {
						state.pendingUpdates.clear();
					});

					// Refresh data from server
					get().refreshTeams();
				},
			}))
		),
		{ name: "teams-store" }
	)
);

export default useTeamsStore;
