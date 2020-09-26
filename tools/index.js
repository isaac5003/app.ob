function getIcon(icon) {
  switch (icon) {
    case "user":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>';
      break;
    case "lock":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>';
      break;
    case "desktop":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>';
      break;
    case "duplicate":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>';
      break;
    case "cash":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>';
      break;
    case "document":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>';
      break;
    case "users":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>';
      break;
    case "dolar":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
      break;
    case "plus":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>';
      break;
    case "menu":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      break;
    case "user-circle":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
      break;
    case "cog":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>';
      break;
    case "document-report":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>';
      break;
    case "document-text":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>';
      break;
  }
}

function inputValidation(required = true, min = null, max = null, type = null) {
  const rules = [];
  if (type == "email") {
    rules.push({
      type: type,
      required,
      message: "Ingresa una direccion de correo valida.",
      trigger: ["blur", "change"],
    });
  } else {
    rules.push({
      type: type,
      required,
      message: "Este campo es requerido.",
      trigger: "blur",
    });
  }
  if (min != null) {
    if (max != null) {
      rules.push({
        type: type,
        min,
        max,
        message: `Minimo ${min} y maximo ${max} caracteres`,
        trigger: "blur",
      });
    } else {
      rules.push({
        type: type,
        min,
        message: `Minimo ${min} caracteres`,
        trigger: "blur",
      });
    }
  } else {
    rules.push({
      type: type,
      max,
      message: `Maximo ${max} caracteres`,
      trigger: "blur",
    });
  }
  return rules;
}

/**
 * Funcion que permite identificar si hay informacion sin guardar
 * @param {object} self Referencia a this.
 * @param {text} storagekey Nombre de la llave a usar en localstorage
 * @param {function} next Funcion para conginuar
 */
function checkBeforeLeave(self, storagekey, next) {
  const stored = localStorage.getItem(storagekey);
  if (!stored) {
    return next();
  }
  self
    .$confirm(
      "Existe informacion sin guardar. ¿Estas seguro que deseas salir?",
      "Autoguardado",
      {
        confirmButtonText: "Si, salir",
        cancelButtonText: "No, gracias",
        type: "warning",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }
    )
    .then(() => {
      localStorage.removeItem(storagekey);
      next();
    });
}

/**
 * Funcion que permite identificar informacion que se dejo pendiente
 * @param {object} self Referencia a this
 * @param {string} storagekey Nombre de la llave a usar en el LocalStorage
 * @param {string} form Name of the object where to store
 */
function checkBeforeEnter(self, storagekey, form) {
  const stored = localStorage.getItem(storagekey);
  if (stored) {
    self
      .$confirm(
        "Existe informacion guardada previamente. ¿deseas recuperarla?",
        "Autoguardado",
        {
          confirmButtonText: "Si, recuperar",
          cancelButtonText: "No, gracias",
          type: "info",
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }
      )
      .then(() => {
        self[form] = JSON.parse(stored);
      })
      .catch(() => {
        localStorage.removeItem(storagekey);
      });
  }
}

function selectValidation(required = true) {
  return [
    {
      required,
      message: "Este campo es requerido.",
      trigger: "change",
    },
  ];
}

module.exports = {
  getIcon,
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
};
