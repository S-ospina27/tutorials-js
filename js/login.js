const host = "http://127.0.0.1:8000";
const modal_form_create_users = document.getElementById(
  "modal-form-create-users"
);
const name_register = document.getElementById("name");
const email_register = document.getElementById("email_register");
const password_register = document.getElementById("password_register");
const tipe = document.getElementById("type");
const alert = document.getElementById("alerta");
const password_login = document.getElementById("password_login");
const email_login = document.getElementById("email_login");
const form_login = document.getElementById("form-login");

const ModalNational = new bootstrap.Modal(
  document.getElementById("registerModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);

const alertDisable = (key) => {
  alert.className = key.class + " mt-3";
  alert.textContent = key.message;

  setTimeout(() => {
    alert.textContent = "";
    alert.className = "";
  }, 2500);
};

const selectRole = () => {
  [
    {
      key: "Estudiante",
      dbnombre: 2,
    },
    {
      key: "Profesor",
      dbnombre: 1,
    },
  ].forEach((role) => {
    const option = document.createElement("OPTION");
    option.value = role.dbnombre;
    option.textContent = role.key;
    tipe.appendChild(option);
  });
};

const hadleshowModal = () => {
  const registerEnlace = document.getElementById("register_enlace");

  if (registerEnlace) {
    registerEnlace.addEventListener("click", () => {
      ModalNational.show();
    });
  }
};

handlesubmitRegister = () => {
  if (modal_form_create_users) {
    modal_form_create_users.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = new FormData();
      form.append("users_name", name_register.value);
      form.append("users_email", email_register.value);
      form.append("users_password", password_register.value);
      form.append("idroles", tipe.value);

      axios
        .post(`${host}/api/users/create`, form, {
          headers: {
            "Content-Type": "multipart/formdata",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.status === "success") {
            alertDisable({
              class: "alert alert-primary text-center",
              message: res.data.message,
            });
            name_register.value = "";
            email_register.value = "";
            password_register.value = "";
            tipe.value = "";
            tipe.textContent = "";
            ModalNational.hide();
          }
        });
    });
  }
};

handlesubmitLogin = () => {
  if (form_login) {
    form_login.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("users_email", email_login.value);
      form.append("users_password", password_login.value);
      axios
        .post(`${host}/api/auth`, form, {
          headers: {
            "Content-Type": "multipart/formdata",
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            sessionStorage.setItem("idusers", res.data.data.idusers);
            sessionStorage.setItem("idroles", res.data.data.idroles);
            sessionStorage.setItem("users_email", res.data.data.users_email);
            sessionStorage.setItem("users_name", res.data.data.users_name);
            sessionStorage.setItem("users_password", res.data.data.users_password);
            alertDisable({
              class: "alert alert-primary text-center",
              message: res.data.message,
            });
            email_login.value = "";
            password_login.value = "";
            if (res.data.data.idroles === 2) {
              window.location.href="inicio.html";
            }else{
              window.location.href="teacher.html";
            }
         
          } else {
            alertDisable({
              class: "alert alert-danger text-center",
              message: res.data.message,
            });
          }
        });
    });
  }
};

handlesubmitLogin()

selectRole();
hadleshowModal();
handlesubmitRegister();