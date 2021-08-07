import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { PostModel } from '~/models/PostModel';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();

  if (req.method !== 'GET') {
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
  }

  if (req.method === 'GET') {
    const posts = await PostModel.find();
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404);
    }
  }

  if (req.method === 'POST') {
    try {
      const newPost = new PostModel({
        title: req.body.title,
        body: req.body.body,
      });
      await newPost.save();
      res.redirect('/posts');
    } catch (e) {
      res.redirect('/posts/new?error=' + e.message);
    }
  }
  res.end();
};
