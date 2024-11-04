import Signupp from './components/Signup'
import LoginPage from './components/LogComponent'
import Profile from './components/ProfileComponent'
import Post_Item from './components/PostComponent'
import Protected from './ProtectedRoute/Protected'
const router = [
    {
        path:'/signup' ,
        element:<Signupp />

    },
    {
        path:'/login' ,
        element:<LoginPage />
        
    },
    {
        path:'/myprofile' ,
        element:
        <Protected>
            <Profile />
        </Protected>
        
    },
    {
        path:'/myprofile/:post_id' ,
        element:<Post_Item />
        
    }
]

export default router;