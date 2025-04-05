const findProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const opts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/api/auth/me";
    let response = await fetch(url, opts);
    response = await response.json();
    console.log(response);
    if (response.error) {
      alert(response.error);
    } else {
      document.querySelector("#nickname").innerHTML =
        response.response.nickname;
      document.querySelector("#avatar").src = response.response.avatar;
    }
  } catch (error) {
    console.log(error);
    alert(error.error);
  }
};

findProfile()