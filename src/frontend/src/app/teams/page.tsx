'use client'

import React, { useEffect } from 'react'
import { useTeamsStore } from '@/stores/teams'
import { TeamsFilterSidebar } from '@/components/teams/TeamsFilterSidebar'
import { TeamsTable } from '@/components/teams/TeamsTable'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Shield, Plus, BarChart3 } from '@/components/icons'

export default function TeamsPage() {
  const { 
    fetchTeams, 
    teams, 
    isLoading, 
    totalCount, 
    currentPage, 
    limit, 
    setCurrentPage, 
    setLimit,
    filters 
  } = useTeamsStore()

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const totalPages = Math.ceil(totalCount / limit)

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1) // Store uses 0-based indexing
  }

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">
              Discover and track CTF teams from around the world
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rankings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{teams.filter(t => t.verified).length}</div>
                <div className="text-sm text-muted-foreground">Verified Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {new Set(teams.map(t => t.country).filter(Boolean)).size}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {teams.filter(t => t.points && t.points > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Active Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <TeamsFilterSidebar />
        </aside>

        {/* Teams Table */}
        <main className="lg:col-span-3 space-y-4">
          <TeamsTable />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {teams.length} of {totalCount.toLocaleString()} teams
                  </div>
                  
                  <Pagination
                    currentPage={currentPage + 1} // Display 1-based indexing
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showSizeChanger
                    pageSize={limit}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[10, 20, 50, 100]}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
