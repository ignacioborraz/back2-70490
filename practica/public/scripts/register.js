document.querySelector("#register").addEventListener("click", async () => {
  try {
    const data = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
      avatar: document.querySelector("#avatar").value,
      nickname: document.querySelector("#nickname").value,
    };
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const url = "/api/auth/register";
    let response = await fetch(url, opts);
    response = await response.json();
    console.log(response);
    if (response.error) {
      alert(response.error);
    } else {
      location.replace("/login");
    }
  } catch (error) {
    console.log(error);
    alert(error.error);
  }
});
