import React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  rightContent: React.ReactNode
}

export function AuthLayout({ children, rightContent }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-white">
        
      </header>
      <main className="flex-1">
        <div className="container flex min-h-[calc(100vh-4rem-4rem)] items-center justify-center">
          <div className="w-full max-w-5xl rounded-xl border bg-white shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="p-8">{children}</div>
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-r-xl">
                  {rightContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

