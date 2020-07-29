function getIcon(icon) {
  switch (icon) {
    case "user":
      return '<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>';
      break;
    case "lock":
      return '<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>';
      break;
    case "desktop":
      return '<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>';
      break;
    case "duplicate":
      return '<path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>';
      break;
    case "cash":
      return '<path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>';
      break;
    case "document":
      return '<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>';
      break;
    case "users":
      return '<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>';
      break;
    case "dolar":
      return '<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
      break;
    case "plus":
      return '<path d="M12 4v16m8-8H4"></path>';
      break;
    case "menu":
      return '<path d="M4 6h16M4 12h16M4 18h16"></path>';
      break;
    case "user-circle":
      return '<path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
      break;
  }
}

function inputValidation(required = true, min = null, max = null) {
  const rules = [];
  rules.push({
    required,
    message: "Este campo es requerido.",
    trigger: "blur",
  });
  if (min != null) {
    if (max != null) {
      rules.push({
        min,
        max,
        message: `Minimo ${min} y maximo ${max} caracteres`,
        trigger: "blur",
      });
    } else {
      rules.push({
        min,
        message: `Minimo ${min} caracteres`,
        trigger: "blur",
      });
    }
  } else {
    rules.push({
      max,
      message: `Maximo ${max} caracteres`,
      trigger: "blur",
    });
  }
  return rules;
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
};
