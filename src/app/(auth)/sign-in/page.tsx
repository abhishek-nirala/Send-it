'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function SignIn() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className="bg-orange-600 px-3 py-1 rounded mx-5" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-600 px-3 py-1 rounded mx-5" onClick={() => signIn()}>Sign in</button>
    </>
  )
}