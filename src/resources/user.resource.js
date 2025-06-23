const userResource = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  createdAt: user.createdAt,
});

module.exports = userResource;
