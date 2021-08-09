import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  let currentUser = null;
  let user = null;
  const { id } = req.query;

  try {
    user = await UserModel.findOne({ _id: id });
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
    if (!currentUser.isAdmin && String(currentUser._id) !== String(user._id)) {
      res.status(401).json({ error: 'Unauthorized, User is not owner.' });
      res.end();
      return;
    }
  }

  if (req.method === 'GET') {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
    }
  }

  // TODO: 論理削除にすべき
  if (req.method === 'DELETE') {
    await UserModel.findOneAndDelete({ _id: id });
    res.status(204);
  }

  if (req.method === 'PUT') {
    console.info(req.body);
    try {
      Object.assign(user, req.body);
      console.info(user);
      await UserModel.findOneAndUpdate({ _id: id }, user, { upsert: true });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  }

  res.end();
};
