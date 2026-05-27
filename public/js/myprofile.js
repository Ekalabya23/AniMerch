// Avatar upload preview + animation
(function () {
  const fileInput = document.getElementById("avatarInput");
  const avatarImg = document.getElementById("avatarImg");
  const avatarFrame = document.getElementById("avatarFrame");
  const removeBtn = document.getElementById("removeAvatarBtn");
  const profileForm = document.getElementById("profileForm");

  fileInput.addEventListener("change", async (event) => {
    const f = event.target.files && event.target.files[0];
    if (!f) return;

    // check file type
    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // ---- Preview + Animation ----
    const reader = new FileReader();
    reader.onload = () => {
      avatarImg.src = reader.result;
      avatarFrame.classList.add("uploading");
      setTimeout(() => avatarFrame.classList.remove("uploading"), 900);
    };
    reader.readAsDataURL(f);

    // ---- Upload to backend ----
    try {
      const form = new FormData();
      form.append("photo", f);

      const res = await axios.patch(
        "https://animerch-1-76qf.onrender.com/api/v1/users/updateMyPhoto",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.status === 200) {
        alert("Profile photo updated successfully!");
        location.reload(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  });
})();

// Password toggle
(function () {
  const pwToggle = document.getElementById("pwToggle");
  const pwForm = document.getElementById("pwForm");
  const passwordForm = document.getElementById("passwordForm");
  const newPw = document.getElementById("newPw");
  const confirmPw = document.getElementById("confirmPw");
  const feedback = document.getElementById("pwFeedback");

  function setExpanded(val) {
    pwToggle.setAttribute("aria-expanded", String(val));
    pwForm.style.display = val ? "block" : "none";
  }
  pwToggle.addEventListener("click", () => {
    const expanded = pwToggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  // validate passwords before submission
  passwordForm &&
    passwordForm.addEventListener("submit", (e) => {
      if (newPw.value.length < 8) {
        e.preventDefault();
        feedback.textContent = "Password must be at least 8 characters.";
        feedback.className = "status-err";
        newPw.focus();
        return;
      }
      if (newPw.value !== confirmPw.value) {
        e.preventDefault();
        feedback.textContent = "Passwords do not match.";
        feedback.className = "status-err";
        confirmPw.focus();
        return;
      }
      // else allow normal SSR form submit to server
      feedback.textContent = "Saving…";
      feedback.className = "status-ok";
    });
})();

// Address form toggling + simple edit flow
(function () {
  const addBtn = document.getElementById("addAddressBtn");
  const formWrap = document.getElementById("addressFormWrap");
  const addressForm = document.getElementById("addressForm");
  const addressId = document.getElementById("addressId");
  const addressLabel = document.getElementById("addressLabel");
  const addressLine1 = document.getElementById("addressLine1");
  const addressCity = document.getElementById("addressCity");
  const addressPostal = document.getElementById("addressPostal");
  const removeAddress = document.getElementById("elRemove");

  addBtn.addEventListener("click", () => {
    showAddressForm();
  });

  window.editAddress = function (id) {
    const card = document.querySelector(
      '.address-card[data-address-id="' + id + '"]',
    );
    if (!card) {
      showAddressForm();
      return;
    }
    addressId.value = id;
    const label = card
      .querySelector("div > div:first-child")
      .textContent.trim();
    addressLabel.value = label;
    const body = card.querySelector(".addr-body").innerText || "";
    const lines = body.split(/\n/);
    addressLine1.value = lines[0] || "";
    addressCity.value = lines[1] || "";
    addressPostal.value = "";
    showAddressForm();
  };

  function showAddressForm() {
    formWrap.style.display = "block";
    addressLabel.focus();
  }

  window.hideAddressForm = function () {
    formWrap.style.display = "none";
    addressForm.reset();
    addressId.value = "";
  };

  const addAddress = async (
    city,
    street,
    houseNumber,
    pinCode,
    state,
    district,
    country,
  ) => {
    try {
      const res = await axios.post(
        "https://animerch-1-76qf.onrender.com/api/v1/users/address",
        {
          city,
          street,
          houseNumber,
          pinCode,
          state,
          district,
          country,
        },
      );
      if (res.status === 201) location.reload(true);
    } catch (err) {
      alert(err);
    }
  };

  addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const street = document.getElementById("addressStreet").value;
    const houseNumber = document.getElementById("addressHn").value;
    const city = document.getElementById("addressCity").value;
    const pinCode = Number(document.getElementById("addressPostal").value);
    const state = document.getElementById("addressState").value;
    const district = document.getElementById("addressDist").value;
    const country = "India";
    addAddress(city, street, houseNumber, pinCode, state, district, country);
  });

  const editProfile = async (name, email) => {
    try {
      const res = await axios.patch(
        "https://animerch-1-76qf.onrender.com/api/v1/users/updateMe",
        {
          name,
          email,
        },
      );

      if (res.status === 200) location.reload(true);
    } catch (err) {
      alert(err);
    }
  };

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    editProfile(name, email);
  });

  const changePassword = async (passwordCurrent, password, passwordConfirm) => {
    try {
      const res = await axios.patch(
        "https://animerch-1-76qf.onrender.com/api/v1/users/changePassword",
        {
          passwordCurrent,
          password,
          passwordConfirm,
        },
      );

      if (res.status === 200) location.reload(true);
    } catch {
      alert(err);
    }
  };

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("currPw").value;
    const password = document.getElementById("newPw").value;
    const passwordConfirm = document.getElementById("confirmPw").value;
    changePassword(passwordCurrent, password, passwordConfirm);
  });

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(
        `https://animerch-1-76qf.onrender.com/api/v1/users/address/${id}`,
      );

      if (res.status === 200) location.reload(true);
    } catch (err) {
      alert(err);
    }
  };
  document.querySelector(".elRemove").addEventListener("click", (e) => {
    const id = document.getElementById("addressId").value;

    deleteAddress(id);
  });
})();
