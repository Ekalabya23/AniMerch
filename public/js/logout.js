const logout = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:4000/api/v1/users/logout");

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
