import { HOST, PORT } from "../config.js";

const accountAPI = `http://${HOST}:${PORT}/api/accounts/`;

export function submitSignInForm(e, email, password) {
  e.preventDefault();
  fetch(`${accountAPI}login/`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        alert("Wrong email or password!");
        window.location.href =
          "http://127.0.0.1:5500/server/web/templates/General/formSignIn.html";
      }
    })
    .then((response) => {
      let acc = response;
      console.log(acc);
      sessionStorage.setItem("currentUser", JSON.stringify(acc));
      if (acc.isAdmin) {
        window.location.href =
          "http://127.0.0.1:5500/server/web/templates/Admin/main.html";
      } else {
        window.location.href =
          "http://127.0.0.1:5500/server/web/templates/Client/main.html";
      }
    });
}
export function submitSignUpForm(e, acc) {
  e.preventDefault();
  fetch(`${accountAPI}create/`, {
    method: "POST",
    body: JSON.stringify(acc),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  }).then(function () {
      window.location.reload()
  })
}
export function getInfor() {
  const acc = JSON.parse(sessionStorage.getItem("currentUser"))
  return acc
}
export function signOut() {
  sessionStorage.removeItem("currentUser");
  window.location.replace(
    "http://127.0.0.1:5500/server/web/templates/General/unSign.html"
  );
}
export function handleEdit(acc) {
  fetch(`${accountAPI}update/${acc.id}/`, {
    method: "PUT",
    body: JSON.stringify(acc),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    sessionStorage.setItem("currentUser", JSON.stringify(acc));
    alert("Update successfully");
  })
}
