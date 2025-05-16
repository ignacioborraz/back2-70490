document.querySelector("#verify").addEventListener("click", async () => {
  try {
    const email = document.querySelector("#email").value
    const verifyCode = document.querySelector("#verifyCode").value
    const url = `/api/auth/email/${email}/code/${verifyCode}`;
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
    alert(error);
  }
});
