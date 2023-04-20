const host = "http://127.0.0.1:8000";
const alert = document.getElementById("alerta");
const contaniner_parents = document.getElementById("container-parent");
let container_children = document.getElementById("container-children");
const filter_textfiled = document.getElementById("search");
const courses_texfield = document.getElementById("idcourses");
const date_texfield = document.getElementById("date");
date_texfield.min = dayjs().format("YYYY-MM-DD");
const time_texfield = document.getElementById("time");
time_texfield.min = dayjs().format("HH:mm");
const name_perfil = document.getElementById("name_perfil");
const email_perfil = document.getElementById("email_perfil");
const password_perfil = document.getElementById("password_perfil");
const filter_bookingModal_form = document.getElementById("modalbooking");
const form_Edit = document.getElementById("modal-form-edit-users");
const ModalNational = new bootstrap.Modal(
  document.getElementById("bookingModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);

const ModalEditPerfil = new bootstrap.Modal(
  document.getElementById("editperfilModal"),
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

const hadleshowModal = (datos) => {
  courses_texfield.value = `${datos.idcourses}-${datos.courses_name}`;
  ModalNational.show();
};

const createContainerCard = (card) => {
  const div = document.createElement("DIV");
  div.className = "col-lg-4 mb-4";
  div.setAttribute("role", "button");
  div.appendChild(card);
  return div;
};

const createCard = (data) => {
  const div_card = document.createElement("DIV");
  div_card.classList.add("card");
  div_card.id = data.idcourses;
  div_card.style = "height: 400px;";
  div_card;

  const img = document.createElement("IMG");
  img.className = "img-fluid rounded-circle mx-auto d-block mt-4";
  img.style = "width: 120px; height: 120px;";
  img.src =`${host}/assets/img/courses/${data.courses_path}`;

  const div_body = document.createElement("DIV");
  div_body.className = "card-body text-center";

  const h5 = document.createElement("H5");
  h5.className = "card-title";
  h5.textContent = data.courses_name;

  const h6_user = document.createElement("H6");
  h6_user.textContent = data.users_name;

  const h6_level = document.createElement("H6");
  h6_level.textContent = data.courses_level;

  const h6_date = document.createElement("H6");
  h6_date.textContent = data.courses_registration_date;

  const p_description = document.createElement("P");
  p_description.textContent = data.courses_description;

  const button_refence = document.createElement("button");
  button_refence.className = " btn btn-primary text-white mt-3";
  button_refence.type = "button";
  button_refence.textContent = "Reservar aqui!";
  button_refence.addEventListener("click", () => hadleshowModal(data));
  [h5, h6_user, h6_level, h6_date, p_description, button_refence].forEach(
    (item) => div_body.appendChild(item)
  );

  div_card.appendChild(img);
  div_card.appendChild(div_body);

  return div_card;
};

const filterDataName = (data, username) => {
  if (username) {
    username.addEventListener("change", () => {
      const filteredData = data.filter((item) =>
        item.users_name.toLowerCase().includes(username.value.toLowerCase())
      );
      if (container_children) {
        container_children.remove();
      }
      container_children = document.createElement("DIV");
      container_children.id = "container-children";
      container_children.className = "row mt-3";
      contaniner_parents.appendChild(container_children);
      validator(filteredData);
    });
  } else {
    validator(data);
  }
};

const validator = (data) => {
  if (!container_children) {
    container_children = document.createElement("DIV");
    container_children.id = "container-children";
    container_children.className = "row mt-3";
    contaniner_parents.appendChild(container_children);
  }

  if (container_children) {
    data
      .map((row) => createCard(row))
      .forEach((card) =>
        container_children.appendChild(createContainerCard(card))
      );
  }
};

const handleInfo = () => {
  axios.get(host + "/api/courses/read").then((res) => {
    validator(res.data);
    filterDataName(res.data, filter_textfiled);
  });
};

handleInfo();

const hadleSubmitBooking = () => {
  if (filter_bookingModal_form) {
    filter_bookingModal_form.addEventListener("submit", (e) => {
      e.preventDefault();

      const form = new FormData();
      form.append("idcourses", courses_texfield.value.split("-")[0]);
      form.append("booking_date", date_texfield.value);
      form.append("booking_time", time_texfield.value);
      form.append("idusers", sessionStorage.getItem("idusers"));

      axios
        .post(`${host}/api/booking/create`, form, {
          headers: {
            "Content-Type": "multipart/formdata",
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            handleInfoBookingUsers();
            alertDisable({
              class: "alert alert-primary text-center",
              message: res.data.message,
            });
            date_texfield.value = "";
            time_texfield.value = "";
            ModalNational.hide();
          }
        });
    });
  }
};

const hadleSetEditPerfilModal = () => {
  const perfil_Edit = document.getElementById("perfil");

  if (perfil_Edit) {
    perfil_Edit.addEventListener("click", () => {
      name_perfil.value = sessionStorage.getItem("users_name");
      email_perfil.value = sessionStorage.getItem("users_email");
      password_perfil.value = sessionStorage.getItem("users_password");
      ModalEditPerfil.show();
    });
  }
};

const hadleSubmitEditPerfil = () => {
  if (form_Edit) {
    form_Edit.addEventListener("submit", (e) => {
      e.preventDefault();
      axios
        .put(
          `${host}/api/users/update`,
          {
            users_name: name_perfil.value,
            users_email: email_perfil.value,
            users_password: password_perfil.value,
            idusers: sessionStorage.getItem("idusers"),
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            sessionStorage.setItem("users_email", res.data.data.users_email);
            sessionStorage.setItem("users_name", res.data.data.users_name);
            sessionStorage.setItem("users_password", res.data.data.users_password);
            ModalEditPerfil.hide();
          }
        });
    });
  }
};

const deleteSesion = () => {
  const delet = document.getElementById("delet-sesion");
      delet.addEventListener("click",()=>{
        sessionStorage.clear();
        window.location.href="login.html";
      });
}
hadleSubmitBooking();
hadleSetEditPerfilModal();
hadleSubmitEditPerfil();
deleteSesion();