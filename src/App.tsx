import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import UserLoginPage from '@/pages/UserLoginPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <UserLoginPage /> },
  { path: '/oauth2/callback', element: <OAuthCallbackPage /> },
  { path: '/admin/login', element: <LoginPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
