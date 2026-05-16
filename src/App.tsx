import { 
  createRouter, 
  createRoute, 
  createRootRoute, 
  RouterProvider, 
  Outlet 
} from '@tanstack/react-router'
import { Toaster } from '@blinkdotnew/ui'
import { useAuth } from './hooks/useAuth'
import { DashboardPage } from './pages/DashboardPage'
import { CreateReceiptPage } from './pages/CreateReceiptPage'
import { ReceiptHistoryPage } from './pages/ReceiptHistoryPage'
import { ReceiptViewPage } from './pages/ReceiptViewPage'
import { BanksPage } from './pages/BanksPage'
import { SettingsPage } from './pages/SettingsPage'
import { LandingPage } from './pages/LandingPage'
import { SharedAppLayout } from './layouts/shared-app-layout'
import { Loader2 } from 'lucide-react'
import { blink } from './blink/client'

const rootRoute = createRootRoute({
  component: () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (!user) {
      return <LandingPage />
    }

    return (
      <SharedAppLayout appName="Receipt Maker">
        <Outlet />
        <Toaster position="top-right" />
      </SharedAppLayout>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const createRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateReceiptPage,
})

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: ReceiptHistoryPage,
})

const receiptViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipt/$id',
  component: ReceiptViewPage,
})

const banksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/banks',
  component: BanksPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  createRoute,
  historyRoute,
  receiptViewRoute,
  banksRoute,
  settingsRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
