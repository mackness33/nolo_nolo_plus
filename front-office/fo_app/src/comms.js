import axios from "axios";

export async function checkLogged() {
  const res = await axios.get("http://localhost:8000/front/user/alreadyLogged");
  console.log(res);
  return res.data.success;
}

export async function identity() {
  const res = await axios.get("http://localhost:8000/front/user/whoAmI");
  if (res.data.name === "notLogged") {
    return { success: false };
  } else {
    return { success: true, payload: res.data };
  }
}

export async function logOut() {
  try {
    const res = await axios.get("http://localhost:8000/front/auth/logout");
    return res.data.success;
  } catch (error) {
    console.log("errore");
    return false;
  }
}
