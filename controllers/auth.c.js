import userM from '../models/user.m.js';
import bcrypt from 'bcryptjs';

export const getLogin = (req, res) => {
  res.render('auth/login', { layout: 'auth' });
};

export const getRegister = (req, res) => {
  res.render('auth/register', { layout: 'auth' });
};

export const getLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Failed to logout' });
    res.redirect('/auth/login');
  });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userM.oneByUsername(username);

    if (!user) {
      return res.render('auth/login', { layout: 'auth', error: 'Invalid username or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.render('auth/login', { layout: 'auth', error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    
    res.redirect('/'); 

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const postRegister = async (req, res) => {
  const { username, name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
      return res.render('auth/register', { 
          layout: 'auth', 
          error: 'Mật khẩu và xác nhận mật khẩu không khớp', 
          form: { username, name, email } 
      });
  }

  try {
    const existingUser = await userM.oneByUsername(username);
    if (existingUser) {
      return res.render('auth/register', {
        layout: 'auth',
        error: 'Tên đăng nhập đã tồn tại',
        form: { username, name, email }
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      username,
      name,
      email,
      password: hashedPassword
    };

    await userM.add(newUser);
    res.redirect('/auth/login');

  } catch (error) {
    res.status(500).render('auth/register', { 
        layout: 'auth', 
        error: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        form: { username, name, email } 
    });
  }
};