export const tables = `
CREATE TABLE IF NOT EXISTS myuser (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL
);       
`
export const post_table = `
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,            
    liked BOOLEAN DEFAULT false,       
    FOREIGN KEY (user_id) REFERENCES myuser(id) ON DELETE CASCADE
);`

export const comments_table = `
    CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    likes INTEGER DEFAULT 0,            -- Column to store the number of likes for the comment
    liked BOOLEAN DEFAULT false,        -- Column to track if the comment is liked
    user_id INTEGER NOT NULL,           -- Foreign key linking to the users table
    post_id INTEGER NOT NULL,           -- Foreign key linking to the posts table
    FOREIGN KEY (user_id) REFERENCES myuser(id) ON DELETE CASCADE,   -- Reference users table
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE    -- Reference posts table
);`
export const url = process.env.CONNECTION;

export const insert_to_database = `INSERT INTO myuser (username,password) 
VALUES ($1,$2) RETURNING * `

export const search_database = `
SELECT * 
FROM myuser
WHERE username=$1`
export const search_database_forId = `SELECT id FROM myuser WHERE username=$1`
// export const search_posts_with_username = 'SELECT * FROM myuser WHERE username=$1'
export const search_byId_database = `SELECT * FROM myuser WHERE id=$1  `

export const search_posts_byId = `
SELECT posts.content, posts.createdAt , posts.likes , posts.liked
FROM posts  
INNER JOIN myuser ON myuser.id = posts.user_id
WHERE myuser.id = $1;
 `
export const get_posts = `SELECT * FROM posts`
export const search_posts = `SELECT * FROM posts WHERE id=$1`
export const insert_to_posts = 
`INSERT INTO posts (content , user_id)
VALUES ($1,$2) RETURNING *
`
export const insert_to_comments = 
`INSERT INTO comments (content , user_id , post_id)
VALUES ($1,$2,$3) RETURNING *
`
export const delete_post_byId = `
DELETE
FROM posts
WHERE id=$1
`
export const get_comments_for_post = `SELECT * FROM comments WHERE post_id=$1`

export const update_post = `UPDATE posts
SET content = $1 
WHERE id = $2 
RETURNING *
`

// export const join_user_posts = `
// SELECT myuser.username, 
// posts.id, 
// posts.content, 
// posts.likes, 
// posts.liked, 
// posts.createdAt
// FROM myuser 
// INNER JOIN posts 
// ON posts.user_id = myuser.id
// WHERE myuser.username=$1`;

export const join_posts_comments = 
`
SELECT  
posts.id ,
comments.id , 
comments.content , 
comments.createdAt,
comments.likes ,
comments.liked
FROM comments
INNER JOIN posts 
ON posts.id = comments.post_id
WHERE posts.id=$1
`