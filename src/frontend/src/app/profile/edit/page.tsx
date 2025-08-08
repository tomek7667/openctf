"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  User,
  Save,
  Github,
  Linkedin,
  Globe,
  Eye,
  EyeOff,
  Plus,
  X,
  Shield,
  Link as LinkIcon,
  CheckCircle as Check,
  Terminal,
  Eye as Bell,
  EyeOff as BellOff
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";

// Enhanced user profile interface
interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  avatar?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    ctftime?: string;
    discord?: string;
  };
  skills: string[];
  specializations: string[];
  certifications: string[];
  preferences: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showLocation: boolean;
    emailNotifications: boolean;
    discordNotifications: boolean;
    teamInvitations: boolean;
    contestReminders: boolean;
  };
  externalAccounts: {
    github: { connected: boolean; username?: string; verifiedAt?: string };
    ctftime: { connected: boolean; teamId?: string; verifiedAt?: string };
    discord: { connected: boolean; username?: string; userId?: string };
  };
}

// Mock API functions
const updateUserProfile = async (profile: Partial<UserProfile>): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, data: profile as UserProfile };
};

const connectExternalAccount = async (provider: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (provider === 'github') {
    return { 
      success: true, 
      data: { username: 'cyberninja', verifiedAt: new Date().toISOString() } 
    };
  }
  return { success: true, data: {} };
};

const disconnectExternalAccount = async (_provider: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

// Available skills and specializations
const availableSkills = [
  "Web Security", "Cryptography", "Reverse Engineering", "Binary Exploitation",
  "Digital Forensics", "Network Security", "Mobile Security", "Hardware Hacking",
  "Social Engineering", "OSINT", "Malware Analysis", "Penetration Testing",
  "Python", "JavaScript", "C/C++", "Assembly", "Go", "Rust", "Java", "PHP"
];

const availableSpecializations = [
  "Web Application Testing", "API Security", "Cloud Security", "DevSecOps",
  "Incident Response", "Threat Hunting", "Vulnerability Research", "Bug Bounty",
  "Red Team", "Blue Team", "Purple Team", "Security Architecture"
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  
  // Form state
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    username: "CyberNinja",
    email: "cyberninja@example.com",
    bio: "",
    location: "",
    joinedDate: "2019-03-15",
    socialLinks: {},
    skills: [],
    specializations: [],
    certifications: [],
    preferences: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true,
      emailNotifications: true,
      discordNotifications: false,
      teamInvitations: true,
      contestReminders: true,
    },
    externalAccounts: {
      github: { connected: false },
      ctftime: { connected: false },
      discord: { connected: false },
    }
  });

  const [newSkill, setNewSkill] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Mock loading user profile
    const loadProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadProfile();
  }, [isAuthenticated, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateUserProfile(profile);
      if (response.success) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectAccount = async (provider: string) => {
    setConnecting(provider);
    try {
      const response = await connectExternalAccount(provider);
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          externalAccounts: {
            ...prev.externalAccounts,
            [provider]: {
              connected: true,
              ...response.data
            }
          }
        }));
      }
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnectAccount = async (provider: string) => {
    try {
      const response = await disconnectExternalAccount(provider);
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          externalAccounts: {
            ...prev.externalAccounts,
            [provider]: { connected: false }
          }
        }));
      }
    } catch (error) {
      console.error(`Error disconnecting ${provider}:`, error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !profile.specializations.includes(newSpecialization.trim())) {
      setProfile(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setProfile(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !profile.certifications.includes(newCertification.trim())) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
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
              BACK TO PROFILE
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-4">
                [EDIT PROFILE]
              </h1>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Terminal className="h-5 w-5" />
                <span className="text-lg font-mono">&gt; Configure your hacker identity</span>
                <div className="w-2 h-5 bg-green-400 animate-pulse" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  BASIC INFORMATION
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">USERNAME</label>
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white"
                        disabled // Username changes require verification
                      />
                      <p className="text-xs font-mono text-gray-500 mt-1">Contact support to change username</p>
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">EMAIL</label>
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white"
                        type="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-green-400 mb-2">BIO</label>
                    <Input
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell the community about yourself..."
                      className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      multiline
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-green-400 mb-2">LOCATION</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. San Francisco, CA"
                      className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  SOCIAL LINKS
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
                    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
                    { key: 'twitter', label: 'Twitter', icon: LinkIcon, placeholder: 'https://twitter.com/username' },
                    { key: 'ctftime', label: 'CTFtime', icon: Shield, placeholder: 'https://ctftime.org/user/12345' },
                    { key: 'discord', label: 'Discord', icon: LinkIcon, placeholder: 'username#1234' }
                  ].map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-mono text-green-400 mb-2">{label.toUpperCase()}</label>
                      <Input
                        value={profile.socialLinks[key as keyof typeof profile.socialLinks] || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            [key]: e.target.value
                          }
                        }))}
                        placeholder={placeholder}
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skills & Expertise */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h2 className="font-mono text-green-400 font-bold mb-6">SKILLS & EXPERTISE</h2>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-mono text-green-400 mb-3">TECHNICAL SKILLS</label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
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
                      onClick={addSkill}
                      variant="outline"
                      className="font-mono border-green-500/50 text-green-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="font-mono text-green-400 border-green-500/50 cursor-pointer group"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-6">
                  <label className="block text-sm font-mono text-green-400 mb-3">SPECIALIZATIONS</label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      placeholder="Add specialization..."
                      className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                      list="specializations-list"
                    />
                    <datalist id="specializations-list">
                      {availableSpecializations.map(spec => (
                        <option key={spec} value={spec} />
                      ))}
                    </datalist>
                    <Button
                      type="button"
                      onClick={addSpecialization}
                      variant="outline"
                      className="font-mono border-green-500/50 text-green-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map(spec => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="font-mono text-blue-400 border-blue-500/50 cursor-pointer group"
                        onClick={() => removeSpecialization(spec)}
                      >
                        {spec}
                        <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-mono text-green-400 mb-3">CERTIFICATIONS</label>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="e.g. CISSP, CEH, OSCP..."
                      className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      onClick={addCertification}
                      variant="outline"
                      className="font-mono border-green-500/50 text-green-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map(cert => (
                      <Badge
                        key={cert}
                        variant="outline"
                        className="font-mono text-purple-400 border-purple-500/50 cursor-pointer group"
                        onClick={() => removeCertification(cert)}
                      >
                        {cert}
                        <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* External Accounts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h3 className="font-mono text-green-400 font-bold mb-4">EXTERNAL ACCOUNTS</h3>
                <div className="space-y-4">
                  {[
                    { key: 'github', label: 'GitHub', icon: Github, color: 'text-gray-300' },
                    { key: 'ctftime', label: 'CTFtime', icon: Shield, color: 'text-orange-400' },
                    { key: 'discord', label: 'Discord', icon: LinkIcon, color: 'text-purple-400' }
                  ].map(({ key, label, icon: Icon, color }) => {
                    const account = profile.externalAccounts[key as keyof typeof profile.externalAccounts];
                    return (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${color}`} />
                          <div>
                            <div className="font-mono text-white text-sm">{label}</div>
                            {account.connected && (
                              <div className="font-mono text-xs text-gray-400">
                                Connected {account.username && `as ${account.username}`}
                              </div>
                            )}
                          </div>
                        </div>
                        {account.connected ? (
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-400" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnectAccount(key)}
                              className="font-mono border-red-500/50 text-red-400 text-xs"
                            >
                              DISCONNECT
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnectAccount(key)}
                            disabled={connecting === key}
                            className="font-mono border-green-500/50 text-green-400 text-xs"
                          >
                            {connecting === key ? 'CONNECTING...' : 'CONNECT'}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Privacy Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h3 className="font-mono text-green-400 font-bold mb-4">PRIVACY SETTINGS</h3>
                <div className="space-y-4">
                  {[
                    { key: 'profileVisibility', label: 'Profile Visibility', type: 'select', options: ['public', 'private'] },
                    { key: 'showEmail', label: 'Show Email', type: 'boolean' },
                    { key: 'showLocation', label: 'Show Location', type: 'boolean' },
                  ].map(({ key, label, type, options }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-mono text-gray-300 text-sm">{label}</span>
                      {type === 'boolean' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              [key]: !prev.preferences[key as keyof typeof prev.preferences]
                            }
                          }))}
                          className={`font-mono text-xs ${
                            profile.preferences[key as keyof typeof profile.preferences] 
                              ? 'border-green-500/50 text-green-400' 
                              : 'border-red-500/50 text-red-400'
                          }`}
                        >
                          {profile.preferences[key as keyof typeof profile.preferences] ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              ON
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              OFF
                            </>
                          )}
                        </Button>
                      ) : (
                        <select
                          value={profile.preferences[key as keyof typeof profile.preferences] as string}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              [key]: e.target.value
                            }
                          }))}
                          className="bg-gray-800 border border-green-500/30 rounded px-2 py-1 font-mono text-xs text-white"
                        >
                          {options?.map(option => (
                            <option key={option} value={option}>
                              {option.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h3 className="font-mono text-green-400 font-bold mb-4">NOTIFICATIONS</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications' },
                    { key: 'discordNotifications', label: 'Discord Notifications' },
                    { key: 'teamInvitations', label: 'Team Invitations' },
                    { key: 'contestReminders', label: 'Contest Reminders' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-mono text-gray-300 text-sm">{label}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            [key]: !prev.preferences[key as keyof typeof prev.preferences]
                          }
                        }))}
                        className={`font-mono text-xs ${
                          profile.preferences[key as keyof typeof profile.preferences] 
                            ? 'border-green-500/50 text-green-400' 
                            : 'border-gray-500/50 text-gray-400'
                        }`}
                      >
                        {profile.preferences[key as keyof typeof profile.preferences] ? (
                          <>
                            <Bell className="h-3 w-3 mr-1" />
                            ON
                          </>
                        ) : (
                          <>
                            <BellOff className="h-3 w-3 mr-1" />
                            OFF
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
              >
                <h3 className="font-mono text-green-400 font-bold mb-4">ACTIONS</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile')}
                    className="w-full font-mono border-gray-500 text-gray-400"
                  >
                    CANCEL
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
