
const ModalBookingRead = new bootstrap.Modal(
  document.getElementById("bookingreadModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);
let datos_table = [];
const body_table = document.getElementById("table-reserva");
const handleInfoBookingUsers = () => {
  axios
    .get(`${host}/api/booking/read/${sessionStorage.getItem("idusers")}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      datos_table.push(...res.data);
      createTable();
    });
};
handleInfoBookingUsers();

const createTable = () => {
  datos_table.forEach((item) => {
    body_table.append(
      addRow(createButton(item.idbooking), [
        addColumn(item.idbooking),
        addColumn(item.courses_name),
        addColumn(item.states_name),
        addColumn(item.booking_date),
      ])
    );
  });
};

const getvalueDelete = (codigo) => {
  axios
    .put(`${host}/api/booking/deactivate`, {
      idbooking: codigo,
    })
    .then((res) => {
      if (res.data.status === "success") {
        datos_table = [];
        body_table.innerHTML = "";
        handleInfoBookingUsers();
        alertDisable({
          class: "alert alert-primary text-center",
          message: res.data.message,
        });
      }
    });
};

const createButton = (codigo) => {
  const button_delete = document.createElement("button");
  button_delete.type = "button";
  button_delete.style =
    "background-color: red;color: white; margin-top:3px;  padding: 5px 5px;border-radius: 5px;border: none; font-size: 15px; cursor: pointer;";
  button_delete.textContent = "DESACTIVAR";
  button_delete.dataset.idbooking = codigo;
  button_delete.addEventListener("click", () =>
    getvalueDelete(button_delete.dataset.idbooking)
  );
  return button_delete;
};

const addRow = (button, columns) => {
  const tr = document.createElement("TR");
  columns.forEach((td) => {
    tr.appendChild(td);
  });
  tr.appendChild(button);
  return tr;
};

const addColumn = (value) => {
  const td = document.createElement("TD");
  td.textContent = value;
  return td;
};

handleInfoBookingUsers();
const showModalReserva = () => {
  const enlace_reserva = document.getElementById("enlace_reserva");
  if (enlace_reserva) {
    enlace_reserva.addEventListener("click", () => {
      ModalBookingRead.show();
      datos_table = [];
      body_table.innerHTML="";
      handleInfoBookingUsers();

    });
  }
};

showModalReserva();
