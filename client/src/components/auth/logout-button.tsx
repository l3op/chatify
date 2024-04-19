import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className='hover:scale-125 ease-in-out duration-300 text-gray-700 font-semibold text-sm hover:text-gray-900'
      title='Log out'
      aria-label='Log out'
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <LogOut />
    </button>
  )
}

export default LogoutButton