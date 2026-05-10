(function () {
  document.querySelectorAll(".amz-item").forEach((item) => {
    const dec = item.querySelector(".amz-qty-dec");
    const inc = item.querySelector(".amz-qty-inc");
    const input = item.querySelector(".amz-qty-input");

    if (dec)
      dec.addEventListener("click", () => {
        let v = Math.max(1, Number(input.value || 1) - 1);
        input.value = v;
        recalc();
      });
    if (inc)
      inc.addEventListener("click", () => {
        let v = Math.max(1, Number(input.value || 1) + 1);
        input.value = v;
        recalc();
      });
    if (input)
      input.addEventListener("change", () => {
        if (Number(input.value) < 1) input.value = 1;
        recalc();
      });
  });

  function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true); // Already loaded
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });
  }

  function getSelectedAddressId() {
    const selected = document.querySelector(
      'input[name="shippingAddress"]:checked'
    );
    if (!selected) return null;
    return selected.value; // this will be address._id
  }

  const paymentSession = async (
    cartId,
    userName,
    userEmail,
    selectedAddressId
  ) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:4000/api/v1/cheakout/${cartId}`,
        {}
      );

      const data = res.data;

      const options = {
        key: "rzp_test_R7iV6LAv6BMWCp",
        amount: data.order.amount + 99,
        currency: data.order.currency,
        name: "AniMerch",
        description: "Test Transaction",
        order_id: data.order.id,
        prefill: {
          name: userName,
          email: userEmail,
          contact: "9999999999",
        },
        handler: async function (response) {
          try {
            const payload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cartId: cartId,
              addressId: selectedAddressId,
              totalPrice: data.order.amount / 100 + 99,
            };

            const res = await axios.post(
              "http://127.0.0.1:4000/api/v1/cheakout/verify-payment",
              payload,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (res.status === 200) {
              window.location.href = "/payment-success";
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Something went wrong during payment verification!");
          }
        },
        theme: {
          color: "#5c3aff",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err);
    }
  };

  document
    .getElementById("amz-checkout-btn")
    .addEventListener("click", async () => {
      const cartId = document.getElementById("cartId").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
      try {
        await loadRazorpayScript();
        const selectedAddressId = getSelectedAddressId();
        paymentSession(cartId, userName, userEmail, selectedAddressId);
      } catch (err) {
        alert(err.message);
      }
    });

  const chashOnDilivery = async (selectedAddressId, totalPrice, cart) => {
    try {
      const res = await axios.post(`http://127.0.0.1:4000/api/v1/order`, {
        payment: "post-paid",
        totalPrice,
        address: selectedAddressId,
        products: cart,
      });

      if (res.status === 201) {
        window.location.href = "/payment-success";
        const res = await axios.delete(
          `http://127.0.0.1:4000/api/v1/users/cart`
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  function getCartItems() {
    const items = document.querySelectorAll(".amz-item");
    const cart = [];

    items.forEach((item) => {
      const productId = item.getAttribute("data-id"); // from data-id
      const qtyInput = item.querySelector(".amz-qty-input");
      const quantity = parseInt(qtyInput.value, 10) || 1;

      cart.push({
        product: productId,
        quantity: quantity,
      });
    });

    console.log(cart);

    return cart;
  }

  document.getElementById("amz-cashOn").addEventListener("click", () => {
    try {
      const selectedAddressId = getSelectedAddressId();
      const totalPrice = parseFloat(
        document.getElementById("amz-total").textContent.replace(/[^\d.]/g, "")
      );
      const cart = getCartItems();
      chashOnDilivery(selectedAddressId, totalPrice, cart);
    } catch (err) {
      alert(err);
    }
  });
})();
