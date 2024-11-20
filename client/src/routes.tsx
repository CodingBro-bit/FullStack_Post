import Signupp from './components/Signup'
import LoginPage from './components/LogComponent'
import Profile from './components/ProfileComponent'
import ViewPost from './components/ViewPost'
import Protected from './ProtectedRoute/Protected'
import NewPost from './components/CreatePost/NewPost'


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
        element:<ViewPost />
        
    },
    {
        path:'/myprofile/create' ,
        element:<NewPost />
        
    }
]

export default router;