"use client";

import { useState } from "react";
import { Plus, GitBranch, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from '@/components/user-avatar';
import { CreateOrganizationModal } from "@/components/create-organization-modal";
import { createOrganization } from "@/app/organizations/actions";
import Link from 'next/link';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Image from 'next/image';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  created_at: string;
  role: 'owner' | 'admin' | 'viewer';
}

interface User extends SupabaseUser {
  profile?: {
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
}

interface DashboardClientProps {
  user: User;
  organizations: Organization[];
}

export function DashboardClient({ user, organizations }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateOrganization = async (data: { name: string; slug: string; logo?: File }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      await createOrganization(formData);
      // Refresh the page to show the new organization
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="cursor-pointer">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <GitBranch className="w-5 h-5 text-gray-800 dark:text-white" />
              </div>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Changelog Hub</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserAvatar user={user} />
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-6xl px-6 min-h-screen dark:bg-black py-6 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Welcome back, {user.profile?.first_name || user.email}!
          </h2>
          <p className="text-muted-foreground">
            Manage your organizations and changelogs from one central dashboard.
          </p>
        </div>

        {/* Organizations Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">
              Your Organizations
            </h3>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </div>

          {organizations.length === 0 ? (
            <Card className="border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
                  <GitBranch className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">
                  No organizations yet
                </h4>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  You&apos;re not part of any organizations yet. Create an organization to publish your product&apos;s first changelog.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Organization
                  </Button>
                  <Button variant="outline">
                    Join Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-zinc-700 dark:bg-zinc-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {org.logo_url ? (
                          <Image
                            src={org.logo_url}
                            alt={`${org.name} logo`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GitBranch className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        org.role === 'owner'
                          ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {org.role}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-foreground">{org.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {new Date(org.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button asChild className="flex-1">
                        <Link href={`/changelog?org=${org.id}`}>
                          View Changelog
                        </Link>
                      </Button>
                      {org.role === 'owner' && (
                        <Button variant="outline" asChild>
                          <Link href={`/organization/${org.id}/settings`}>
                            Settings
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {organizations.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Create Post</h4>
                      <p className="text-sm text-muted-foreground">Add a new changelog entry</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Invite Members</h4>
                      <p className="text-sm text-muted-foreground">Add team members to your org</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">New Organization</h4>
                      <p className="text-sm text-muted-foreground">Create another organization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <CreateOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrganization}
      />
    </>
  );
}