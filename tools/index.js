import { format } from "date-fns";
import { es } from "date-fns/locale";

function getIcon(icon) {
  switch (icon) {
    case "user":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>';
    case "lock":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>';
    case "desktop":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>';
    case "duplicate":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>';
    case "cash":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>';
    case "document":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>';
    case "users":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>';
    case "dolar":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
    case "plus":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>';
    case "menu":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    case "user-circle":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
    case "cog":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>';
    case "document-report":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>';
    case "document-text":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>';
    case "briefcase":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>';
    case "user-group":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>';
    case "office-building":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>';
    case "collection":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>';
    case "credit-card":
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>';
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

function selectValidation(required = true) {
  return [
    {
      required,
      message: "Este campo es requerido.",
      trigger: "change",
    },
  ];
}
function amountValidate(trigger, required = false, min = null, max = null) {
  const validation = (rule, value, callback) => {
    if (value == "" && required) {
      callback(new Error("Este campo es requerido."));
    } else if (typeof parseFloat(value) !== "number") {
      callback(new Error("Ingresa un número valido."));
    } else if (min != null && parseFloat(value) < min) {
      callback(new Error(`El número debe ser mayor a ${min}`));
    } else if (max != null && parseFloat(value) > max) {
      callback(new Error(`El número debe ser menor a ${max}`));
    } else {
      callback();
    }

  };
  return [
    {
      validator: validation,
      trigger,
    },

  ];

}

function amountValidate(trigger, required = false, min = null, max = null) {
  const validation = (rule, value, callback) => {
    if (value == "" && required) {
      callback(new Error("Este campo es requerido."));
    } else if (typeof parseFloat(value) !== "number") {
      callback(new Error("Ingresa un número valido."));
    } else if (min != null && parseFloat(value) < min) {
      callback(new Error(`El número debe ser mayor a ${min}`));
    } else if (max != null && parseFloat(value) > max) {
      callback(new Error(`El número debe ser menor a ${max}`));
    } else {
      callback();
    }
  };

  return [
    {
      validator: validation,
      trigger,
    },
  ];
}

const numeroALetras = (num, currency) => {
  currency = currency || {};
  var data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
    letrasCentavos: '',
    letrasMonedaPlural: currency.plural || 'DOLARES',//'PESOS', 'DÃƒÂ³lares', 'BolÃƒÂ­vares', 'etcs'
    letrasMonedaSingular: currency.singular || 'DOLAR', //'PESO', 'DÃƒÂ³lar', 'Bolivar', 'etc'
    letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
    letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO'
  };

  if (data.centavos == 100) {
    data.letrasCentavos = '00/100';
    data.enteros++
  } else if (data.centavos > 0) {
    data.letrasCentavos = `${data.centavos.toString().length == 1 ? '0' : ''}${data.centavos}/100`;
  } else {
    data.letrasCentavos = '00/100';
  };

  if (data.enteros == 0)
    return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  if (data.enteros == 1)
    return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
  else
    return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;

  // CÃ³digo basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {

    switch (num) {
      case 1:
        return 'UN';
      case 2:
        return 'DOS';
      case 3:
        return 'TRES';
      case 4:
        return 'CUATRO';
      case 5:
        return 'CINCO';
      case 6:
        return 'SEIS';
      case 7:
        return 'SIETE';
      case 8:
        return 'OCHO';
      case 9:
        return 'NUEVE';
    }

    return '';
  }//Unidades()

  function Decenas(num) {

    var decena = Math.floor(num / 10);
    var unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return 'DIEZ';
          case 1:
            return 'ONCE';
          case 2:
            return 'DOCE';
          case 3:
            return 'TRECE';
          case 4:
            return 'CATORCE';
          case 5:
            return 'QUINCE';
          default:
            return 'DIECI' + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return 'VEINTE';
          default:
            return 'VEINTI' + Unidades(unidad);
        }
      case 3:
        return DecenasY('TREINTA', unidad);
      case 4:
        return DecenasY('CUARENTA', unidad);
      case 5:
        return DecenasY('CINCUENTA', unidad);
      case 6:
        return DecenasY('SESENTA', unidad);
      case 7:
        return DecenasY('SETENTA', unidad);
      case 8:
        return DecenasY('OCHENTA', unidad);
      case 9:
        return DecenasY('NOVENTA', unidad);
      case 0:
        return Unidades(unidad);
    }
  }//Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + ' Y ' + Unidades(numUnidades)

    return strSin;
  }//DecenasY()

  function Centenas(num) {
    var centenas = Math.floor(num / 100);
    var decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return 'CIENTO ' + Decenas(decenas);
        return 'CIEN';
      case 2:
        return 'DOSCIENTOS ' + Decenas(decenas);
      case 3:
        return 'TRESCIENTOS ' + Decenas(decenas);
      case 4:
        return 'CUATROCIENTOS ' + Decenas(decenas);
      case 5:
        return 'QUINIENTOS ' + Decenas(decenas);
      case 6:
        return 'SEISCIENTOS ' + Decenas(decenas);
      case 7:
        return 'SETECIENTOS ' + Decenas(decenas);
      case 8:
        return 'OCHOCIENTOS ' + Decenas(decenas);
      case 9:
        return 'NOVECIENTOS ' + Decenas(decenas);
    }

    return Decenas(decenas);
  }//Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    var cientos = Math.floor(num / divisor)
    var resto = num - (cientos * divisor)

    var letras = '';

    if (cientos > 0)
      if (cientos > 1)
        letras = Centenas(cientos) + ' ' + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += '';

    return letras;
  }//Seccion()

  function Miles(num) {
    var divisor = 1000;
    var cientos = Math.floor(num / divisor)
    var resto = num - (cientos * divisor)

    var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
    var strCentenas = Centenas(resto);

    if (strMiles == '')
      return strCentenas;

    return strMiles + ' ' + strCentenas;
  }//Miles()

  function Millones(num) {
    var divisor = 1000000;
    var cientos = Math.floor(num / divisor)
    var resto = num - (cientos * divisor)

    var strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    var strMiles = Miles(resto);

    if (strMillones == '')
      return strMiles;

    return strMillones + ' ' + strMiles;
  }//Millones()

}

const calculatedAmount = (sellingType, documentType, cost, quantity, incTax) => {
  let sujeta = null
  let exenta = null
  let gravada = null
  const amount = parseFloat(quantity) * parseFloat(cost)
  switch (sellingType) {
    case '1':
      sujeta = amount
      break;
    case '2':
      exenta = amount
      break;
    case '3':
      switch (documentType) {
        case "1":
          gravada = amount * (incTax ? 1 : 1.13);
          break;
        case "2":
          gravada = amount / (incTax ? 1.13 : 1);
          break;
      }
      break;
  }
  return { sujeta, exenta, gravada }
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

function hasModule(module, user) {
  const company = user.profile.access.find(
    (a) => a.id == user.workspace.company.id
  );
  const branch = company.branches.find((b) => b.id == user.workspace.branch.id);
  return branch.modules.map((m) => m.id).includes(module);
}

const getHeader = (name, nit, nrc, lastDay, docName, dateType = 'date', preTitle = null) => {
  let title = docName
  if (lastDay) {
    let date = null
    switch (dateType) {
      case 'date':
        date = format(lastDay, 'dd - MMMM - yyyy', { locale: es }).split('-').join('de')
        title = `${docName} AL ${date}`
        break;
      case 'month':
        date = format(lastDay, 'MMMM - yyyy', { locale: es }).split('-').join('de')
        title = `${docName} PARA EL MES DE ${date}`
        break
      case 'period':
        console.log(lastDay);
        const fromDate = format(lastDay[0], 'dd/MM/yyyy')
        const toDate = format(lastDay[1], 'dd/MM/yyyy')
        title = `${docName} EN EL PERÍODO DEL ${fromDate} AL ${toDate}`
        break
    }
  }
  return (currentPage, pageCount, pageSize) => {
    let header = [
      {
        columns: [
          {
            text: name.toUpperCase(),
            fontSize: 12,
            bold: true,

          }
        ],
        margin: [20, 15, 20, 0],
      },
    ]

    if (!preTitle === null) {
      header.push(
        {
          columns: [
            {
              text: preTitle,
              fontSize: 10,
              margin: [0, 5, 0, 0],
            },
          ],
          margin: [20, 0, 20, 0],
        },
      )
    }
    header.push(
      {
        columns: [
          {
            text: title.toUpperCase(),
            fontSize: 10,
            margin: [0, 5, 0, 0],
            width: '70%'
          },
          {
            text: [
              {
                text: 'NIT: ',
                bold: true
              },
              {
                text: nit
              },
              {
                text: '  NRC: ',
                bold: true
              },
              {
                text: nrc
              }
            ],
            fontSize: 9,
            alignment: 'right',
            margin: [0, 5, 0, 0],
            width: '30%'
          }
        ],
        margin: [20, 0, 20, 0],
      },
      {
        canvas: [{ type: 'line', x1: 20, y1: 5, x2: pageSize.width - 20, y2: 5, lineWidth: 1 }]
      }
    )
    return header
  }
}

const getFooter = () => {
  return (currentPage, pageCount, pageSize) => {
    return [
      {
        canvas: [{ type: 'line', x1: 20, y1: 5, x2: pageSize.width - 20, y2: 5, lineWidth: 1 }]
      },
      {
        columns: [
          {
            text: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
            fontSize: 9,
            margin: [0, 5, 0, 0]

          },
          {
            text: `${currentPage.toString()} / ${pageCount}`,
            fontSize: 9,
            alignment: 'right',
            margin: [0, 5, 0, 0]
          }
        ],
        margin: [20, 0, 20, 0],
      }
    ]
  }
}

module.exports = {
  getIcon,
  inputValidation,
  selectValidation,
  amountValidate,
  checkBeforeLeave,
  checkBeforeEnter,
  hasModule,
  numeroALetras,
  calculatedAmount,
  getHeader,
  getFooter
};
