const drop = document.getElementById("drop");
const fileInput = document.getElementById("fileInput");
const pickBtn = document.getElementById("pickBtn");
const previewArea = document.getElementById("previewArea");
const avatarPreview = document.querySelector("#avatarPreview img");
const fileNameEl = document.getElementById("fileName");
const removeBtn = document.getElementById("removeBtn");
const uploadBtn = document.getElementById("uploadBtn");
const successBanner = document.getElementById("successBanner");
const signupForm = document.getElementById("signupForm");

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post("http://127.0.0.1:4000/api/v1/users/signup", {
      name,
      email,
      password,
      passwordConfirm,
    });

    if (res.status === 201) {
      successBanner.textContent = "✅ Singup successful!";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  } catch (err) {
    alert(err);
    const msg =
      err.response?.data?.message ||
      "Signup failed. Please check your credentials.";
    successBanner.textContent = "❌ " + msg;
  }
};

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(signupForm);
  const name = data.get("first") + " " + data.get("last");
  const email = data.get("email");
  const password = data.get("password");
  const passwordConfirm = data.get("confirm");

  signup(name, email, password, passwordConfirm);
});

// ["dragenter", "dragover"].forEach((ev) =>
//   drop.addEventListener(ev, (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     drop.classList.add("dragover");
//   })
// );
// ["dragleave", "drop"].forEach((ev) =>
//   drop.addEventListener(ev, (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     drop.classList.remove("dragover");
//   })
// );

// drop.addEventListener("drop", (e) => {
//   const dt = e.dataTransfer;
//   if (!dt || !dt.files || dt.files.length === 0) return;
//   handleFile(dt.files[0]);
// });

// pickBtn.addEventListener("click", () => fileInput.click());
// fileInput.addEventListener("change", () => {
//   if (fileInput.files.length) handleFile(fileInput.files[0]);
// });

// function handleFile(file) {
//   if (!file) return;
//   if (!file.type.startsWith("image/")) {
//     alert("Please select an image");
//     return;
//   }
//   if (file.size > 5 * 1024 * 1024) {
//     alert("Maximum 5MB");
//     return;
//   }
//   const reader = new FileReader();
//   reader.onload = () => {
//     avatarPreview.src = reader.result;
//     previewArea.style.display = "block";
//     fileNameEl.textContent =
//       file.name + " • " + Math.round(file.size / 1024) + "KB";

//     // small pulse animation on preview
//     avatarPreview.style.transform = "scale(0.96)";
//     setTimeout(() => (avatarPreview.style.transform = "scale(1)"), 60);

//     // store for upload simulation
//     previewArea.dataset.file = file.name;
//   };
//   reader.readAsDataURL(file);
// }

// removeBtn.addEventListener("click", () => {
//   avatarPreview.src = "";
//   previewArea.style.display = "none";
//   fileInput.value = "";
// });

// uploadBtn.addEventListener("click", async () => {
//   if (!previewArea.dataset.file) return alert("Pick a file first");
//   uploadBtn.disabled = true;
//   uploadBtn.textContent = "Uploading...";

//   // create simple progress ring animation using CSS + timeout simulation
//   const start = Date.now();
//   const duration = 900 + Math.random() * 900;
//   let progress = 0;
//   const id = setInterval(() => {
//     progress = Math.min(1, (Date.now() - start) / duration);
//     uploadBtn.style.boxShadow = `0 10px 40px rgba(92,58,255,${
//       0.08 + progress * 0.18
//     })`;
//     if (progress >= 1) {
//       clearInterval(id);
//       uploadBtn.disabled = false;
//       uploadBtn.textContent = "Saved ✓";
//       setTimeout(() => (uploadBtn.textContent = "Upload & Save"), 900);
//     }
//   }, 60);
// });
