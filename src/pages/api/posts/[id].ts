import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { PostModel } from '~/models/PostModel';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  let post = null;
  let user = null;
  const { id } = req.query;

  try {
    post = await PostModel.findOne({ _id: id }).populate('user', '_id name');
  } catch (e) {
    res.status(404);
    res.end();
    return;
  }

  // permission check
  if (req.method !== 'GET') {
    if (!session) {
      res.status(401).json({ error: 'Unauthorized, session is empty.' });
      res.end();
      return;
    }
    user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized, User not found.' });
      res.end();
      return;
    }
    if (String(post.user._id) !== String(user._id)) {
      res.status(401).json({ error: 'Unauthorized, User is not owner.' });
      res.end();
      return;
    }
  }

  if (req.method === 'GET') {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404);
    }
  }

  // TODO: 論理削除にすべき
  if (req.method === 'DELETE') {
    await PostModel.findOneAndDelete({ _id: id });
    res.status(204);
  }

  if (req.method === 'PUT') {
    console.info(req.body);
    try {
      Object.assign(post, {
        title: req.body.title,
        body: req.body.body,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        placeState: req.body.placeState,
        placeCity: req.body.placeCity,
      });
      console.info(post);
      await PostModel.findOneAndUpdate({ _id: id }, post, { upsert: true });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  }

  res.end();
};
