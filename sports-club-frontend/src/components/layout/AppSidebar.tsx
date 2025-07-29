import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  MapPin,
  CreditCard,
  MessageSquare,
  Users,
  Bell,
  User,
  Settings,
  Trophy,
  Activity,
  UserCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Events', url: '/events', icon: Calendar },
  { title: 'Facilities', url: '/facilities', icon: MapPin },
  { title: 'Teams', url: '/teams', icon: Users },
  { title: 'Forum', url: '/forum', icon: MessageSquare },
  { title: 'Payments', url: '/payments', icon: CreditCard },
];

const adminItems = [
  { title: 'Member Management', url: '/admin/members', icon: UserCheck },
  { title: 'Analytics', url: '/admin/analytics', icon: Activity },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const userItems = [
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      isActive(path)
        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
        : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Sidebar
      className={cn(
        'border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">Sports Club</h2>
              <p className="text-sm text-sidebar-foreground/70">Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            'text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2',
            collapsed && 'sr-only'
          )}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              'text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2',
              collapsed && 'sr-only'
            )}>
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            'text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2',
            collapsed && 'sr-only'
          )}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="space-y-3">
            {!collapsed && (
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-white text-sm font-semibold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size={collapsed ? 'icon' : 'sm'}
              onClick={handleLogout}
              className="w-full border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {collapsed ? (
                <User className="h-4 w-4" />
              ) : (
                'Sign Out'
              )}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
