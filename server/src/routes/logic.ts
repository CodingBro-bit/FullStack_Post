import express from 'express';
import { signUp  ,loGin , createPosts, createComments } from '../controllers/controller' // Adjust the path
import Auth from '../middlewares/authorize';
import { deletePost_api} from '../controllers/deletePost';
import EditPosts from '../controllers/Editpost';
const router = express.Router();

router.post("/api/signup", signUp); // This will now work correctly
router.post("/api/login", loGin); // This will now work correctly
router.post("/api/profile/myposts", Auth , createPosts);
router.post("/api/profile/myposts/:post_id", Auth , createComments);
router.delete("/api/profile/myposts/:post_id" , Auth , deletePost_api);
router.put("/api/profile/myposts/:post_id" , Auth , EditPosts)
router.put('api/profile/myposts/:post_id/comments' , Auth , createComments);

export default router;
