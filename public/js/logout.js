const logout = async () => {
  try {
    const res = await axios.get(
      "https://animerch-1-76qf.onrender.com/api/v1/users/logout",
    );

    if (res.status === 200)
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
  } catch (err) {
    alert(err);
  }
};

document.getElementById("navLogout").addEventListener("click", (e) => {
  logout();
});
