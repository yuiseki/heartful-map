import { getSession } from 'next-auth/client';
import { dbConnect } from '~/lib/dbConnect';
import { UserModel } from '~/models/UserModel';

export default async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();

  if (req.method === 'GET') {
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
    } else {
      if (!user.isAdmin) {
        res.status(401).json({ error: 'Unauthorized' });
        res.end();
        return;
      }
    }
  }

  if (req.method === 'GET') {
    const users = await UserModel.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404);
    }
  }

  if (req.method === 'POST') {
    try {
      const newUser = new UserModel({
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      res.redirect('/');
    } catch (e) {
      res.redirect('/auth/signup?error=' + e.message);
    }
  }
  res.end();
};
