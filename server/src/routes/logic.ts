import express from 'express';
import { signUp  ,loGin , createPosts, createComments } from '../controllers/controller' // Adjust the path
import Auth from '../middlewares/authorize';

const router = express.Router();

router.post("/api/signup", signUp); // This will now work correctly
router.post("/api/login", loGin); // This will now work correctly
router.post("/profile/myposts", Auth , createPosts);
router.post("/profile/myposts/:post_id", Auth , createComments);
export default router;
