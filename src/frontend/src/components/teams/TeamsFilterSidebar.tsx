'use client'

import React, { useState, useEffect } from 'react'
import { useTeamsStore } from '@/stores/teams'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { X, Filter } from 'lucide-react'

// Mock country data - in real app, this would come from API
const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'RU', label: 'Russia' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
]

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return { value: year.toString(), label: year.toString() }
})

interface TeamsFilterSidebarProps {
  className?: string
}

export function TeamsFilterSidebar({ className }: TeamsFilterSidebarProps) {
  const { filters, setFilters } = useTeamsStore()
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm)
  const [selectedCountry, setSelectedCountry] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== filters.searchTerm) {
        setFilters({ searchTerm: localSearchTerm })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchTerm, filters.searchTerm, setFilters])

  const handleAddCountry = () => {
    if (selectedCountry && !filters.countryCodes.includes(selectedCountry)) {
      setFilters({
        countryCodes: [...filters.countryCodes, selectedCountry]
      })
      setSelectedCountry('')
    }
  }

  const handleRemoveCountry = (countryCode: string) => {
    setFilters({
      countryCodes: filters.countryCodes.filter(code => code !== countryCode)
    })
  }

  const handleYearChange = (year: string) => {
    setFilters({ year: year ? Number(year) : undefined })
  }

  const clearAllFilters = () => {
    setFilters({
      countryCodes: [],
      searchTerm: '',
      year: undefined,
    })
    setLocalSearchTerm('')
  }

  const hasActiveFilters = filters.countryCodes.length > 0 || filters.searchTerm || filters.year

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Input
            label="Search Teams"
            placeholder="Search by team name..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
        </div>

        {/* Year Filter */}
        <div>
          <Select
            label="Year"
            options={YEARS}
            value={filters.year?.toString() || ''}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="All years"
          />
        </div>

        {/* Country Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Countries</label>
          
          <div className="flex space-x-2 mb-3">
            <Select
              options={COUNTRIES}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              placeholder="Select country"
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleAddCountry}
              disabled={!selectedCountry || filters.countryCodes.includes(selectedCountry)}
            >
              Add
            </Button>
          </div>

          {/* Selected Countries */}
          {filters.countryCodes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Selected countries:</div>
              <div className="flex flex-wrap gap-2">
                {filters.countryCodes.map((countryCode) => {
                  const country = COUNTRIES.find(c => c.value === countryCode)
                  return (
                    <Badge
                      key={countryCode}
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleRemoveCountry(countryCode)}
                    >
                      {country?.label || countryCode}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Active filters:</div>
            <div className="space-y-1 text-xs">
              {filters.searchTerm && (
                <div>Search: "{filters.searchTerm}"</div>
              )}
              {filters.year && (
                <div>Year: {filters.year}</div>
              )}
              {filters.countryCodes.length > 0 && (
                <div>Countries: {filters.countryCodes.length} selected</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
