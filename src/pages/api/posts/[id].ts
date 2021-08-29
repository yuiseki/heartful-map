import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { PostModel } from '~/models/PostModel';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  let currentUser = null;
  let post = null;
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
    currentUser = await UserModel.findOne({ email: session.user.email });
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized, User not found.' });
      res.end();
      return;
    }
    if (
      !currentUser.isAdmin &&
      String(post.user._id) !== String(currentUser._id)
    ) {
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
    console.info('Now putting : ' + JSON.stringify(req.body, null, '  '));
    try {
      Object.assign(post, req.body);
      console.info('Asssigned post is : ' + post);
      await PostModel.findOneAndUpdate({ _id: id }, post, { upsert: true });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  }

  res.end();
};
