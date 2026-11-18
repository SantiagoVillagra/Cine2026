import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-text-primary">
      <Outlet />
    </main>
  )
}

export default AuthLayout
