const register = async (req, res) => {
  const response = req.user;
  res.json201(response, "Registered");
};
const login = async (req, res) => {
  const response = req.user;
  const token = req.token;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  res.cookie("token", token, opts).json200(response, "Logged in");
};
const online = async (req, res) => {
  if (!req.user.user_id) {
    res.json401();
  }
  res.json200({ user: req.user });
};
const signout = async (req, res) => {
  res.clearCookie("token").json200(null, "Signed out");
};
const badAuth = async (req, res) => {
  res.json401("Bad auth from redirect");
};
const google = async (req, res) => {
  const response = req.user;
  res.json200(response);
};

export { register, login, online, signout, badAuth, google };
