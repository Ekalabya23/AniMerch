const login = async (email, password) => {
  try {
    const res = await axios.post("http://127.0.0.1:4000/api/v1/users/login", {
      email,
      password,
    });

    if (res.status === 201) {
      document.getElementById("msg").textContent = "✅ Login successful!";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      "Login failed. Please check your credentials.";
    document.getElementById("msg").textContent = "❌ " + msg;
  }
};

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  login(email, password);
});

const toggle = document.getElementById("togglePwd");
const pwd = document.getElementById("password");

toggle.addEventListener("click", () => {
  if (pwd.type === "password") {
    pwd.type = "text";
    toggle.textContent = "Hide";
  } else {
    pwd.type = "password";
    toggle.textContent = "Show";
  }
});
