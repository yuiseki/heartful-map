import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { PostModel } from '~/models/PostModel';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  let user = null;

  if (req.method !== 'GET') {
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    user = await UserModel.findOne({ email: session.user.email });
    /*
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    */
  }

  if (req.method === 'GET') {
    const { state, city } = req.query;
    const condition = {};
    if (state) {
      Object.assign(condition, {
        placeState: state,
      });
    }
    if (city) {
      Object.assign(condition, {
        placeCity: city,
      });
    }
    const posts = await PostModel.find(condition, null, {
      sort: { updatedAt: -1 },
      limit: 100,
    }).populate('user', '_id name');
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404);
    }
  }

  if (req.method === 'POST') {
    console.info(req.body);
    try {
      const newPost = new PostModel({
        ...req.body,
        category: req.body['category[]'],
        user: user,
      });
      await newPost.save();
      res.redirect('/');
    } catch (e) {
      res.redirect('/posts/new?error=' + e.message);
    }
  }
  res.end();
};
