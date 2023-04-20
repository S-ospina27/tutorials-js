const host = "http://127.0.0.1:8000";
const alert = document.getElementById("alerta");
const filter_textfiled = document.getElementById("search");
const contaniner_parents = document.getElementById("container-parent");
let container_children = document.getElementById("container-children");
const name_perfil = document.getElementById("name_perfil");
const email_perfil = document.getElementById("email_perfil");
const password_perfil = document.getElementById("password_perfil");
const form_Edit = document.getElementById("modal-form-edit-users_teacher");
const add_form_coruses = document.getElementById("add-form-coruses");
const type = document.getElementById("type");
const file = document.getElementById("file");
const nombre_new_coruses = document.getElementById("nombre-new-coruses");
const description_courses = document.getElementById("description-courses");
const ModalEditPerfil = new bootstrap.Modal(
  document.getElementById("editperfilModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);

const ModaladdCourses = new bootstrap.Modal(
  document.getElementById("AddcoursesModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);
const addcourses_enlace = document.getElementById("addcourses_enlace");

const alertDisable = (id, key) => {
  id.className = key.class + " mt-3";
  id.textContent = key.message;

  setTimeout(() => {
    id.textContent = "";
    id.className = "";
  }, 2500);
};

const showModalAddCourse = () => {
  if (addcourses_enlace) {
    addcourses_enlace.addEventListener("click", () => {
      ModaladdCourses.show();
    });
  }
};

showModalAddCourse();

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
  img.src =`${host}/assets/img/courses/${data.courses_path}` ;

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

  [h5, h6_user, h6_level, h6_date, p_description].forEach((item) =>
    div_body.appendChild(item)
  );

  div_card.appendChild(img);
  div_card.appendChild(div_body);

  return div_card;
};

const filterDataName = (data, courses_name) => {
  if (courses_name) {
    courses_name.addEventListener("change", () => {
      const filteredData = data.filter((item) =>
        item.courses_name
          .toLowerCase()
          .includes(courses_name.value.toLowerCase())
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

const handleGetCourses = () => {
  axios
    .get(
      `${host}/api/courses/read-teacher/${sessionStorage.getItem("idusers")}`
    )
    .then((res) => {
      if (!res.data.status) {
        validator(res.data);
        filterDataName(res.data, filter_textfiled);
      } else {
        alertDisable(alert, {
          class: "alert alert-primary text-center",
          message: "No tienes cursos registados aun Animate!!",
        });
      }
    });
};
handleGetCourses();

const deleteSesion = () => {
  const delet = document.getElementById("delet-sesion");
  delet.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });
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
        .put(`${host}/api/users/update`, {
          users_name: name_perfil.value,
          users_email: email_perfil.value,
          users_password: password_perfil.value,
          idusers: sessionStorage.getItem("idusers"),
        })
        .then((res) => {
          if (res.data.status === "success") {
            sessionStorage.setItem("users_email", res.data.data.users_email);
            sessionStorage.setItem("users_name", res.data.data.users_name);
            sessionStorage.setItem(
              "users_password",
              res.data.data.users_password
            );
            ModalEditPerfil.hide();
          }
        });
    });
  }
};

const selectLevel = () => {
  [
    {
      key: "ALTO",
      dbnombre: "Alto",
    },
    {
      key: "MEDIO",
      dbnombre: "Medio",
    },
    {
      key: "BAJO",
      dbnombre: "Bajo",
    },
  ].forEach((item) => {
    const option = document.createElement("OPTION");
    option.value = item.key;
    option.textContent = item.dbnombre;
    type.appendChild(option);
  });
};

const hadlesubmitNewCourses = () => {
  if (add_form_coruses) {
    add_form_coruses.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("courses_name", nombre_new_coruses.value);
      form.append("courses_level", type.value);
      form.append("courses_description", description_courses.value);
      form.append("courses_path", file.files[0]);
      form.append("idusers", sessionStorage.getItem("idusers"));

      axios
        .post(`${host}/api/courses/create`, form, {
          headers: {
            "Content-Type": "multipart/formdata",
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            if (container_children) {
              container_children.remove();
            }
            container_children = document.createElement("DIV");
            container_children.id = "container-children";
            container_children.className = "row mt-3";
            contaniner_parents.appendChild(container_children);
            handleGetCourses();
            alertDisable(document.getElementById("alert-addcourse"), {
              class: "alert alert-primary text-center",
              message:res.data.message,
            });
            nombre_new_coruses.value="";
            type.value="";
            description_courses.value="";
            file.value="";
          }
        });
    });
  }
};

selectLevel();
deleteSesion();
hadleSetEditPerfilModal();
hadleSubmitEditPerfil();
hadlesubmitNewCourses();
