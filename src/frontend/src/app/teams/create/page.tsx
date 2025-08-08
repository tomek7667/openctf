"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Users,
  Save,
  Upload,
  Globe,
  Lock,
  EyeOff,
  Plus,
  X,
  Shield,
  Terminal,
  Settings,
  HelpCircle,
  Image as ImageIcon
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { createTeam, Team } from "@/api/teams";
import { getCountryByCode, getCountryFlag, getPopularCountries } from "@/lib/countries";

const privacyOptions = [
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone can see your team and request to join',
    icon: Globe,
    color: 'text-green-400 border-green-400'
  },
  {
    id: 'invite-only',
    label: 'Invite Only',
    description: 'Only invited members can join, but team is visible',
    icon: Lock,
    color: 'text-yellow-400 border-yellow-400'
  },
  {
    id: 'private',
    label: 'Private',
    description: 'Team is hidden and only accessible by invitation',
    icon: EyeOff,
    color: 'text-red-400 border-red-400'
  }
];

const availableSkills = [
  "Web Security", "Cryptography", "Reverse Engineering", "Binary Exploitation",
  "Digital Forensics", "Network Security", "Mobile Security", "Hardware Hacking",
  "OSINT", "Malware Analysis", "Penetration Testing", "Social Engineering",
  "Python", "JavaScript", "C/C++", "Assembly", "Go", "Rust", "Java"
];

export default function CreateTeamPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form data
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    privacy: 'public' as 'public' | 'invite-only' | 'private',
    country: "",
    maxMembers: 5,
    website: "",
    discord: "",
    github: "",
    
    // Recruitment settings
    isRecruiting: false,
    recruitmentDescription: "",
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    minExperience: "",
    timeCommitment: "",
    contactMethod: 'application' as 'application' | 'invitation_only',
    
    // Team settings
    allowApplications: true,
    requireApproval: true,
    autoAcceptFromRating: 0,
    visibilityLevel: 'public' as 'public' | 'members_only' | 'captain_only'
  });

  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/teams');
    }
  }, [isAuthenticated, router]);

  const addRequiredSkill = () => {
    if (newRequiredSkill.trim() && !teamData.requiredSkills.includes(newRequiredSkill.trim())) {
      setTeamData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newRequiredSkill.trim()]
      }));
      setNewRequiredSkill("");
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setTeamData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim() && !teamData.preferredSkills.includes(newPreferredSkill.trim())) {
      setTeamData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, newPreferredSkill.trim()]
      }));
      setNewPreferredSkill("");
    }
  };

  const removePreferredSkill = (skill: string) => {
    setTeamData(prev => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    if (!teamData.name.trim() || !teamData.description.trim()) {
      return;
    }

    setLoading(true);
    try {
      const team: Partial<Team> = {
        name: teamData.name,
        description: teamData.description,
        logoUrl: teamData.logoUrl || undefined,
        bannerUrl: teamData.bannerUrl || undefined,
        privacy: teamData.privacy,
        country: teamData.country || undefined,
        maxMembers: teamData.maxMembers,
        socialLinks: {
          website: teamData.website || undefined,
          discord: teamData.discord || undefined,
          github: teamData.github || undefined,
        },
        recruitment: {
          isRecruiting: teamData.isRecruiting,
          description: teamData.recruitmentDescription || undefined,
          requiredSkills: teamData.requiredSkills,
          preferredSkills: teamData.preferredSkills,
          minExperience: teamData.minExperience || undefined,
          timeCommitment: teamData.timeCommitment || undefined,
          contactMethod: teamData.contactMethod,
          maxMembers: teamData.maxMembers
        },
        settings: {
          allowApplications: teamData.allowApplications,
          requireApproval: teamData.requireApproval,
          autoAcceptFromRating: teamData.autoAcceptFromRating,
          visibilityLevel: teamData.visibilityLevel
        }
      };

      const response = await createTeam(team, user?.id?.toString() || "");
      if (response.success && response.data) {
        router.push(`/teams/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
              BACK TO TEAMS
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-4">
                [CREATE TEAM]
              </h1>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Terminal className="h-5 w-5" />
                <span className="text-lg font-mono">&gt; Assemble your cyber elite</span>
                <div className="w-2 h-5 bg-green-400 animate-pulse" />
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[
                  { step: 1, label: "Basic Info" },
                  { step: 2, label: "Recruitment" },
                  { step: 3, label: "Settings" }
                ].map(({ step: stepNum, label }) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold ${
                        step >= stepNum
                          ? 'border-green-400 bg-green-400/20 text-green-400'
                          : 'border-gray-600 text-gray-600'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className={`ml-2 font-mono text-sm ${step >= stepNum ? 'text-green-400' : 'text-gray-600'}`}>
                      {label}
                    </span>
                    {stepNum < 3 && (
                      <div className={`w-12 h-0.5 mx-4 ${step > stepNum ? 'bg-green-400' : 'bg-gray-600'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Team Details */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    TEAM DETAILS
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">TEAM NAME *</label>
                      <Input
                        value={teamData.name}
                        onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your team name..."
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">DESCRIPTION *</label>
                      <Input
                        value={teamData.description}
                        onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your team's focus and goals..."
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        multiline
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">COUNTRY</label>
                        <select
                          value={teamData.country}
                          onChange={(e) => setTeamData(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white"
                        >
                          <option value="">Select country...</option>
                          {getPopularCountries().map(code => {
                            const country = getCountryByCode(code);
                            return (
                              <option key={code} value={code}>
                                {getCountryFlag(code)} {country?.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">MAX MEMBERS</label>
                        <Input
                          type="number"
                          min="2"
                          max="20"
                          value={teamData.maxMembers}
                          onChange={(e) => setTeamData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 5 }))}
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h2 className="font-mono text-green-400 font-bold mb-6">PRIVACY LEVEL</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {privacyOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTeamData(prev => ({ ...prev, privacy: option.id as any }))}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            teamData.privacy === option.id
                              ? `${option.color} bg-current/10`
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          <Icon className="h-6 w-6 mb-2" />
                          <h3 className="font-mono font-bold mb-1">{option.label}</h3>
                          <p className="text-sm font-mono opacity-80">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Media & Links */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h2 className="font-mono text-green-400 font-bold mb-6">MEDIA & LINKS</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">TEAM LOGO URL</label>
                      <Input
                        value={teamData.logoUrl}
                        onChange={(e) => setTeamData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">BANNER IMAGE URL</label>
                      <Input
                        value={teamData.bannerUrl}
                        onChange={(e) => setTeamData(prev => ({ ...prev, bannerUrl: e.target.value }))}
                        placeholder="https://example.com/banner.png"
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">WEBSITE</label>
                        <Input
                          value={teamData.website}
                          onChange={(e) => setTeamData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://team.example.com"
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">DISCORD</label>
                        <Input
                          value={teamData.discord}
                          onChange={(e) => setTeamData(prev => ({ ...prev, discord: e.target.value }))}
                          placeholder="https://discord.gg/team"
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">GITHUB</label>
                        <Input
                          value={teamData.github}
                          onChange={(e) => setTeamData(prev => ({ ...prev, github: e.target.value }))}
                          placeholder="https://github.com/team"
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!teamData.name.trim() || !teamData.description.trim()}
                    className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    NEXT: RECRUITMENT
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Recruitment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Recruitment Toggle */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono text-green-400 font-bold flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      RECRUITMENT STATUS
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => setTeamData(prev => ({ ...prev, isRecruiting: !prev.isRecruiting }))}
                      className={`font-mono ${
                        teamData.isRecruiting 
                          ? 'border-green-500/50 text-green-400' 
                          : 'border-gray-500/50 text-gray-400'
                      }`}
                    >
                      {teamData.isRecruiting ? 'RECRUITING' : 'NOT RECRUITING'}
                    </Button>
                  </div>

                  {teamData.isRecruiting && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">RECRUITMENT MESSAGE</label>
                        <Input
                          value={teamData.recruitmentDescription}
                          onChange={(e) => setTeamData(prev => ({ ...prev, recruitmentDescription: e.target.value }))}
                          placeholder="Describe what you're looking for in new members..."
                          className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                          multiline
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-mono text-green-400 mb-2">MIN EXPERIENCE</label>
                          <Input
                            value={teamData.minExperience}
                            onChange={(e) => setTeamData(prev => ({ ...prev, minExperience: e.target.value }))}
                            placeholder="e.g. 2+ years, Beginner friendly"
                            className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-mono text-green-400 mb-2">TIME COMMITMENT</label>
                          <Input
                            value={teamData.timeCommitment}
                            onChange={(e) => setTeamData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                            placeholder="e.g. 10+ hours/week"
                            className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-green-400 mb-2">CONTACT METHOD</label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setTeamData(prev => ({ ...prev, contactMethod: 'application' }))}
                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-all ${
                              teamData.contactMethod === 'application'
                                ? 'border-green-500/50 bg-green-500/20 text-green-400'
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            Accept Applications
                          </button>
                          <button
                            type="button"
                            onClick={() => setTeamData(prev => ({ ...prev, contactMethod: 'invitation_only' }))}
                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-all ${
                              teamData.contactMethod === 'invitation_only'
                                ? 'border-green-500/50 bg-green-500/20 text-green-400'
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            Invitation Only
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Requirements */}
                {teamData.isRecruiting && (
                  <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                    <h2 className="font-mono text-green-400 font-bold mb-6">SKILL REQUIREMENTS</h2>

                    {/* Required Skills */}
                    <div className="mb-6">
                      <label className="block text-sm font-mono text-green-400 mb-3">REQUIRED SKILLS</label>
                      <div className="flex space-x-2 mb-3">
                        <Input
                          value={newRequiredSkill}
                          onChange={(e) => setNewRequiredSkill(e.target.value)}
                          placeholder="Add required skill..."
                          className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                          list="skills-list"
                        />
                        <datalist id="skills-list">
                          {availableSkills.map(skill => (
                            <option key={skill} value={skill} />
                          ))}
                        </datalist>
                        <Button
                          type="button"
                          onClick={addRequiredSkill}
                          variant="outline"
                          className="font-mono border-green-500/50 text-green-400"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {teamData.requiredSkills.map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="font-mono text-red-400 border-red-500/50 cursor-pointer group"
                            onClick={() => removeRequiredSkill(skill)}
                          >
                            {skill}
                            <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-3">PREFERRED SKILLS</label>
                      <div className="flex space-x-2 mb-3">
                        <Input
                          value={newPreferredSkill}
                          onChange={(e) => setNewPreferredSkill(e.target.value)}
                          placeholder="Add preferred skill..."
                          className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                          list="skills-list"
                        />
                        <Button
                          type="button"
                          onClick={addPreferredSkill}
                          variant="outline"
                          className="font-mono border-green-500/50 text-green-400"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {teamData.preferredSkills.map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="font-mono text-green-400 border-green-500/50 cursor-pointer group"
                            onClick={() => removePreferredSkill(skill)}
                          >
                            {skill}
                            <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="font-mono border-gray-500 text-gray-400"
                  >
                    BACK
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    NEXT: SETTINGS
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Settings */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Team Settings */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    TEAM SETTINGS
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <div className="font-mono text-white text-sm">Allow Applications</div>
                        <div className="font-mono text-gray-400 text-xs">Users can apply to join your team</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTeamData(prev => ({ ...prev, allowApplications: !prev.allowApplications }))}
                        className={`font-mono text-xs ${
                          teamData.allowApplications 
                            ? 'border-green-500/50 text-green-400' 
                            : 'border-red-500/50 text-red-400'
                        }`}
                      >
                        {teamData.allowApplications ? 'ENABLED' : 'DISABLED'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <div className="font-mono text-white text-sm">Require Approval</div>
                        <div className="font-mono text-gray-400 text-xs">All applications need captain approval</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTeamData(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                        className={`font-mono text-xs ${
                          teamData.requireApproval 
                            ? 'border-green-500/50 text-green-400' 
                            : 'border-red-500/50 text-red-400'
                        }`}
                      >
                        {teamData.requireApproval ? 'ENABLED' : 'DISABLED'}
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">AUTO-ACCEPT FROM RATING</label>
                      <Input
                        type="number"
                        min="0"
                        max="3000"
                        value={teamData.autoAcceptFromRating}
                        onChange={(e) => setTeamData(prev => ({ ...prev, autoAcceptFromRating: parseInt(e.target.value) || 0 }))}
                        placeholder="0 = disabled"
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      />
                      <p className="text-xs font-mono text-gray-500 mt-1">
                        Automatically accept applications from users with this rating or higher (0 to disable)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">TEAM VISIBILITY</label>
                      <select
                        value={teamData.visibilityLevel}
                        onChange={(e) => setTeamData(prev => ({ ...prev, visibilityLevel: e.target.value as any }))}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white"
                      >
                        <option value="public">Public - Anyone can see team details</option>
                        <option value="members_only">Members Only - Only members see detailed info</option>
                        <option value="captain_only">Captain Only - Only captain sees sensitive info</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h2 className="font-mono text-green-400 font-bold mb-6">REVIEW</h2>
                  
                  <div className="space-y-4 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Team Name:</span>
                      <span className="text-white">{teamData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Privacy:</span>
                      <span className="text-white">{teamData.privacy.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Members:</span>
                      <span className="text-white">{teamData.maxMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recruiting:</span>
                      <span className={teamData.isRecruiting ? 'text-green-400' : 'text-red-400'}>
                        {teamData.isRecruiting ? 'YES' : 'NO'}
                      </span>
                    </div>
                    {teamData.isRecruiting && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Required Skills:</span>
                          <span className="text-white">{teamData.requiredSkills.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contact Method:</span>
                          <span className="text-white">{teamData.contactMethod.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="font-mono border-gray-500 text-gray-400"
                  >
                    BACK
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "CREATING..." : "CREATE TEAM"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
