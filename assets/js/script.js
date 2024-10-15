class Expense {
  constructor(name, value, id) {
    this.name = name;
    this.value = value;
    this.id = id;
  }
}

//Array que va a guardar la lista de gastos
let expenses = [];

//Formatear el total a COP
let formater = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

//creamos una funciona que muestra una alerta personalizable
const showAlert = (text, color) => {
  if(!color) document.querySelector(".redAlert").style.backgroundColor = 'red';
  else document.querySelector(".redAlert").style.backgroundColor = color;

  document.querySelector(".redAlert").textContent = text;

  document.querySelector(".redAlert").style.display = "flex";
};

//Funcion para ocultar la alerta mostrada en tiempo personalizable
const hiddeAlert = (time) => {
  if(!time) time = 2000;
  setTimeout(() => {
    document.querySelector(".redAlert").style.display = "none";
  }, time)
};

//Funcion para agregar una nuevo gasto
const add = () => {
  let expenseName = document.querySelector("#nombreGasto").value;
  let expenseValue = document.querySelector("#valorGasto").value;
  let id = crypto.randomUUID();

  if (!expenseName) {
    showAlert('El gasto debe tener al menos un nombre');
    hiddeAlert();
    return;
  } else {
    const newExpense = new Expense(expenseName, Number(expenseValue), id);

    expenses.push(newExpense);

    document.querySelector("#nombreGasto").value = "";
    document.querySelector("#valorGasto").value = "";

    showExpenses();
  }
};

//Funcion para mostrar la lista de gastos, cada vez que se llama se actualiza toda la vista
const showExpenses = () => {
  const expenseList = document.querySelector("#listaDeGastos");
  //Variable para almacenar la lista de gastos
  let list = "";

  //variable para almacenar el total de gastos
  let total = 0;

  //Para cada elemento de la lista de gastos crea un elemento li y lo concatena a la lista
  expenses.forEach((expense) => {
    list += `<li> 
    
    <span class='textList'>
    <b>${expense.name}:</b>&ensp;COP&ensp;${formater.format(expense.value)}
    </span>
    <span class='btns'>
    <button class='btnUpdate' onclick='update("${
      expense.id
    }")'>Modificar</button>
    
    <button class='btnRemove' onclick='remove("${
      expense.id
    }")'>Eliminar</button>
    </span>
    </li>`;
    total += expense.value;
  });

  //Mostrar lista de gastos actualizada
  expenseList.innerHTML = list;

  //Aggregar total
  document.querySelector("#totalGastos").innerHTML = `COP ${formater.format(
    total
  )}`;
};

//Funcion para eliminar un gasto
const remove = (id) => {
  //obtener el indice el elemnto a eliminar
  let indexRemove = expenses.findIndex((expense) => expense.id == id);

  //con el indice removemos el elemento de la lista
  expenses.splice(indexRemove, 1);

  //actualizamos la tabla
  showExpenses();
};

const update = (id) => {

  showAlert('Modifique el nombre y/o el valor del gasto', 'blue')

  //obtenemos todos los elementos del DOM que vamos a necesitar
  const nombreGasto = document.querySelector("#nombreGasto");
  const valorGasto = document.querySelector("#valorGasto");
  const btnAdd = document.querySelector(".btnAdd");
  const btnSaveChanges = document.querySelector(".btnSaveChanges");

  //Obtenemos el indice del elemento a actualizar
  let indexUpdate = expenses.findIndex((expense) => expense.id == id);

  //Desabilitamos los botones de modificar y eliminar de los demas elementos para evitar errores
  document.querySelectorAll(".btnUpdate").forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("not-allowed");
  });
  document.querySelectorAll(".btnRemove").forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("not-allowed");
  });

  //Obtenemos los valores y los mostramos en los inputs
  nombreGasto.value = expenses[indexUpdate].name;
  valorGasto.value = expenses[indexUpdate].value;

  //Cambiamos el boton
  btnAdd.style.display = "none";
  btnSaveChanges.style.display = "block";

  btnSaveChanges.onclick = () => { //con esta accion en lugar de usar addEventListener aseguramos que se ejecute una sola vez
                                    //en cada llamada a la funcion, asi evitamos posibles errores al momento de guardar cambios.

    const currentIndex = indexUpdate;
    //Nuevos valores
    let newName = nombreGasto.value;
    let newValue = valorGasto.value;

    // Verificamos que existan valores a modificar y modificamos
    if (newName != "" && newName != null) {
      expenses[currentIndex].name = newName;
    }
    if (newValue != "" && newValue != null) {
      expenses[currentIndex].value = Number(newValue);
    }

    //Mostramos mensaje de exito
    showAlert('Gasto modificado con éxito!', 'green');

    //Actualizamos la interfaz
    showExpenses();

    //resetar inputs
    nombreGasto.value = "";
    valorGasto.value = "";

    //cambiar el boton otra vez
    btnAdd.style.display = "block";
    btnSaveChanges.style.display = "none";

    //Quitamos el mensaje
    hiddeAlert()
  };
};
