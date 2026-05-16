import { 
  RootRoute, 
  Route, 
  Router, 
  RouterProvider, 
  Outlet 
} from '@tanstack/react-router'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { CreateReceiptPage } from './pages/CreateReceiptPage'
import { ReceiptViewPage } from './pages/ReceiptViewPage'
import { ReceiptHistoryPage } from './pages/ReceiptHistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { BanksPage } from './pages/BanksPage'
import { SharedAppLayout } from './layouts/shared-app-layout'
import { Loader2 } from 'lucide-react'
import { Toaster } from '@blinkdotnew/ui'

// 1. ALWAYS Define the RootRoute first
const rootRoute = new RootRoute({
  component: () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (!user) {
      return (
        <>
          <LandingPage />
          <Toaster position="top-right" />
        </>
      )
    }

    return (
      <SharedAppLayout appName="Receipt Maker">
        <Outlet />
        <Toaster position="top-right" />
      </SharedAppLayout>
    )
  }
})

// 2. Define all children AFTER the rootRoute is fully declared
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage
})

const createReceiptRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateReceiptPage
})

const viewReceiptRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/receipt/$id',
  component: ReceiptViewPage
})

const historyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: ReceiptHistoryPage
})

const banksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/banks',
  component: BanksPage
})

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage
})

// 3. Chain them cleanly into the router tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  createReceiptRoute,
  viewReceiptRoute,
  historyRoute,
  banksRoute,
  settingsRoute
])

const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
