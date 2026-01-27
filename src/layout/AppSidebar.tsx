import { Bug, Code2, Home, Smile } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items for navigation
const menuItems = [
  {
    title: 'Home',
    path: '/',
    icon: Home,
  },
  {
    title: 'Examples',
    path: '/examples',
    icon: Code2,
  },
  {
    title: 'Error Handling',
    path: '/errors',
    icon: Bug,
  },
  {
    title: 'Jokes',
    path: '/jokes',
    icon: Smile,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="font-semibold text-gray-900 text-lg">Your App</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <p className="text-center text-gray-500 text-xs">Frontend Boilerplate</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
