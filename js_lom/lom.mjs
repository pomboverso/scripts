import { execSync } from "child_process";

const gcolor = {
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  LIGHTGRAY: 37,
  GRAY: 90,
  LIGHTRED: 91,
  LIGHTGREEN: 92,
  LIGHTYELLOW: 93,
  LIGHTBLUE: 94,
  LIGHTMAGENTA: 95,
  LIGHTCYAN: 96,
  WHITE: 97,
};

const profiles = ["doruk", "bruno"];

// function isOnWeek(date = new Date(), reference = new Date("2024-01-01")) {
//   // Make sure reference is a Monday
//   const ref = new Date(reference);
//   ref.setHours(0, 0, 0, 0);
//   const refDay = ref.getDay();
//   if (refDay !== 1) {
//     // shift back to previous Monday
//     ref.setDate(ref.getDate() - ((refDay + 6) % 7));
//   }

//   // Align input date to Monday as well
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   const day = d.getDay();
//   d.setDate(d.getDate() - ((day + 6) % 7));

//   const msInWeek = 7 * 24 * 60 * 60 * 1000;
//   const weekIndex = Math.floor((d - ref) / msInWeek);
//   return weekIndex % 2 === 0; // or === 1 to shift phase
// }

// const alternateWeek = isOnWeek();

function renderProgressBar(progress, total) {
  const percent = Math.floor((progress / total) * 100);
  const barLength = 30; // characters
  const filledLength = Math.floor((barLength * percent) / 100);

  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`[${bar}] ${percent}%`);
}

function changeColor(text, color) {
  return `\x1b[0;${color}m${text}\x1b[0m`;
}

const h = {
  separator: (len = 30, char = "-") => char.repeat(len),

  print: (message, color = gcolor.WHITE) =>
    console.log(changeColor(message, color)),

  title: (title, color = gcolor.YELLOW, len) => {
    const separator = h.separator(len);
    h.print(`${separator} ${title}`, color);
  },

  sectionTitle: (title, len = 30) => {
    const separator = h.separator(len);
    h.print(`${separator} ${title} ${separator}`, gcolor.GRAY);
  },

  stop: (app) => {
    h.print(`cerrar ${app}`, gcolor.LIGHTRED);
    execSync(`adb shell am force-stop ${app}`);
  },

  screenshot: (localPath, filename) => {
    h.print(`tomar captura de pantalla`, gcolor.LIGHTMAGENTA);
    const remotePath = `/sdcard/${filename}.png`;
    const fullLocalPath = `${localPath}/${filename}.png`;
    execSync(`adb shell screencap -p ${remotePath}`);
    execSync(`adb pull ${remotePath} ${fullLocalPath}`);
    execSync(`adb shell rm ${remotePath}`);
  },

  repeat: (fn, times, message) => {
    if (message) {
      h.print(message, gcolor.WHITE);
    }
    for (let i = 0; i < times; i++) {
      renderProgressBar(i + 1, times);
      fn(i);
    }
    console.log("\nacabado");
  },

  tap: (x, y, message, wait = 1) => {
    if (message) {
      h.print(message, gcolor.WHITE);
    }
    execSync(`adb shell input tap ${x} ${y}`);
    if (wait) {
      h.wait(wait);
    }
  },

  swipe: (xStart, yStart, xFinal, yFinal, duration, message, wait) => {
    if (message) {
      h.print(message, gcolor.LIGHTGREEN);
    }
    execSync(
      `adb shell input swipe ${xStart} ${yStart} ${xFinal} ${yFinal} ${duration}`
    );
    if (wait) {
      h.wait(wait);
    }
  },

  wait: (seconds = 1, message) => {
    if (message) {
      h.print(message, gcolor.LIGHTMAGENTA);
    }
    const ms = seconds * 1000;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  },
};

const homeSection = {
  init() {
    h.sectionTitle("Home");
    homeSection.menuBar();
    homeSection.soul();
    homeSection.gifts();
  },
  initFinalTasks() {
    h.sectionTitle("Home");
    homeSection.tasks();
  },
  soul() {
    h.title("Alma Marcial");
    h.tap(910, 1500, "abrir seccion de alma marcial", 1);
    h.tap(880, 1950, "navegar a la seccion de obtencion de alma marcial", 1);
    h.tap(520, 860, "abrir provocacion de alma marcial", 1);
    h.tap(900, 470, "tomar recompensas diarias", 2.5);
    h.tap(900, 470, "cerrar notificacion", 1);
    h.tap(890, 2150, "salir de la seccion de provocacion de alma marcial", 1);
    h.tap(520, 2100, "salir de la seccion de alma marcial", 1);
  },
  menuBar() {
    h.title("Menu");
    h.tap(80, 172, "abrir menu principal", 1);
    homeSection.mail();
    homeSection.friends();
    homeSection.share();
  },
  mail() {
    h.title("Correo");
    h.tap(80, 765, "abrir correo", 1);
    h.tap(711, 1640, "recibir correo", 2.5);
    h.tap(711, 1640, "cerrar la notificacion", 1);
    h.tap(520, 1810, "salir del correo", 1);
  },
  friends() {
    h.title("Amigos");
    h.tap(80, 1070, "entrar a la seccion de amigos", 2.5);
    h.tap(520, 1540, "dar y recibir monedas de oro", 2.5);
    h.tap(520, 1540, "cerrar notificacion", 1);
    h.tap(520, 1760, "salir de la seccion de amigos", 1);
  },
  share() {
    h.title("Compartir");
    h.tap(80, 1400, "abrir seccion de compartir", 0.5);
    h.tap(340, 1480, "compartir con discord", 0.5);
    h.stop("com.brave.browser");
    h.stop("com.discord");
    h.wait(0.5);
    h.tap(300, 1350, "recibir gemas de discord", 2.5);
    h.tap(300, 1350, "cerrar notificacion de compra");
    h.tap(520, 2140, "cerrar modal", 1);
  },
  tasks() {
    h.title("Tareas");
    h.tap(50, 600, `Abrir modal de tareas`, 1);

    const steps = [
      {
        coord: { x: 750, y: 870 },
        item: "lamp thief",
      },
      {
        coord: { x: 750, y: 1050 },
        item: "molten ruins",
      },
      {
        coord: { x: 750, y: 1200 },
        item: "lamp thief 3 times",
      },
      {
        coord: { x: 750, y: 1400 },
        item: "molten ruins 3 times",
      },
      {
        coord: { x: 750, y: 1550 },
        item: "15 skills draws",
      },
      {
        coord: { x: 750, y: 1700 },
        item: "15 pal draws",
      },
    ];

    steps.forEach(({ item, coord }) => {
      h.tap(coord.x, coord.y, item, 0);
    });
    h.wait(1);
    h.tap(100, 600, `cerrar notificacion`, 1);

    const steps2 = [
      {
        coord: { x: 750, y: 870 },
        item: "use 500 diamonds",
      },
      {
        coord: { x: 750, y: 1050 },
        item: "share game once",
      },
      {
        coord: { x: 750, y: 1200 },
        item: "defeat 50 enemies",
      },
      {
        coord: { x: 750, y: 1400 },
        item: "defeat 100 enemies",
      },
    ];

    steps2.forEach(({ item, coord }) => {
      h.tap(coord.x, coord.y, item, 0);
    });
    h.wait(1);
    h.tap(100, 600, `cerrar notificacion`, 1);

    h.tap(750, 870, "defeat 150 enemies", 1);
    h.tap(100, 600, `cerrar notificacion`, 1);
    h.tap(450, 600, `tomar recompensas`, 1);
    h.tap(100, 600, `cerrar notificacion`, 1);

    h.tap(900, 2010, `salir del modal de tareas`, 1);
  },
  gifts() {
    h.title("Regalos");
    h.tap(50, 500, `Abrir modal de regalos`, 1);

    h.tap(500, 1600, `Abrir seccion de privilegios`, 1);
    h.tap(500, 1500, `Tomar recompensa`, 1);
    h.tap(500, 1500, `Cerrar notificaion`, 1);
    h.tap(750, 1600, `Abrir seccion de eventos`, 1);

    h.tap(500, 700, `Abrir seccion de paquete de crescimiento`, 1);
    h.tap(780, 450, `tomar recompensa`, 1);
    h.tap(780, 450, `cerrar notificacion`, 1);
    h.tap(500, 1850, `cerrar seccion de crescimiento`, 1);

    h.tap(500, 1100, `Abrir seccion de oferta diaria`, 1);
    h.tap(780, 550, `tomar recompensa`, 1);
    h.tap(780, 550, `cerrar notificacion`, 1);
    h.tap(500, 1850, `cerrar seccion de oferta diaria`, 1);

    // if (alternateWeek) {
    //   h.tap(500, 1300, `Abrir seccion del baul de reembolso`, 1);
    //   h.tap(780, 550, `tomar recompensa`, 1);
    //   h.tap(780, 550, `cerrar notificacion`, 1);
    //   h.tap(500, 1850, `cerrar seccion del baul de reembolso`, 1);
    // } else {
    //   h.tap(500, 1300, `Abrir seccion de paquete de seleccion`, 1);
    //   h.tap(780, 900, `tomar recompensa`, 1);
    //   h.tap(500, 400, `cerrar notificacion`, 1);
    //   h.tap(500, 1850, `cerrar seccion de paquete de seleccion`, 1);
    // }

    h.tap(500, 1500, `Abrir seccion de tarjeta de valor`, 1);
    h.tap(780, 550, `tomar recompensa`, 1);
    h.tap(780, 550, `cerrar notificacion`, 1);
    h.tap(500, 1850, `cerrar seccion de tarjeta`, 1);

    h.tap(500, 1800, `salir del modal de regalos`, 1);
  },
};

const fightSection = {
  init() {
    h.sectionTitle("Lucha");
    h.tap(430, 2180, "abrir seccion de lucha", 1);
    h.swipe(
      520,
      800,
      520,
      2200,
      100,
      "navegar hacia arriba del menu de lucha",
      1
    );
    fightSection.lampDungeon();
    fightSection.diamondDungeon();

    h.swipe(
      520,
      1930,
      520,
      1000,
      3500,
      "navegar a la seccion de ciudad antigua",
      3.25
    );
    fightSection.relicDungeon();
    fightSection.chronoDungeon();
    fightSection.runestonesDungeon();
    fightSection.darkTrialDungeon();

    h.swipe(520, 1930, 520, 1000, 10, "navegar a la seccion del arbol", 1);
    fightSection.sacredTree();
    h.tap(430, 2180, "cerrar seccion de lucha", 1);
  },
  lampDungeon() {
    h.title("Ladron de Lampara Magica");
    h.tap(830, 1430, "abrir menu de ladron de la lampara magica", 1);
    h.repeat(
      () => {
        h.tap(450, 1570, null, null);
      },
      80,
      "hacer raide"
    );
    h.tap(520, 1900, "cerrar modal", 1);
  },
  diamondDungeon() {
    h.title("Ruinas de las LLamas");
    h.tap(830, 1750, "abrir menu de ruinas de las llamas", 1);
    h.repeat(
      () => {
        h.tap(450, 1570, null, null);
      },
      80,
      "hacer raide"
    );
    h.tap(520, 1900, "cerrar modal", 1);
  },
  sacredTree() {
    h.title("Sacred Tree Trial");
    h.tap(830, 1500, "abrir menu de sacred tree", 1);
    h.tap(70, 600, "abrir menu de raide", 1);
    h.tap(700, 1300, "aceptar", 1);
    h.tap(700, 1300, "tomar recompensa", 1);
    h.tap(900, 2170, "salir de sacred tree", 1);
  },
  // second pass / flaky
  relicDungeon() {
    h.title("Ciudad Antigua");
    h.tap(830, 940, "abrir menu de ciudad antigua", 2.5);
    h.repeat(
      () => {
        h.tap(330, 1920, null, null);
      },
      80,
      "hacer raide"
    );
    h.tap(520, 2079, "cerrar modal", 1);
    h.tap(711, 1260, "confirmar cerrar modal", 1);
  },
  chronoDungeon() {
    h.title("Torre Cronologica");
    h.tap(830, 1250, "abrir menu de torre cronologica", 1);
    h.repeat(
      () => {
        h.tap(450, 1570, null, null);
      },
      80,
      "hacer raide"
    );
    h.tap(520, 1900, "cerrar modal", 1);
  },
  runestonesDungeon() {
    h.title("Santuario de las LLamas");
    h.tap(830, 1560, "abrir menu de santuario de llama ardiente", 1);
    h.repeat(
      () => {
        h.tap(410, 1600, null, null);
      },
      80,
      "hacer raide"
    );
    h.tap(520, 1900, "cerrar modal", 1);
  },
  darkTrialDungeon() {
    h.title("Povocacion de oscuridad");
    h.tap(830, 1870, "abrir menu de provocacion de oscuridad", 1);
    h.repeat(
      () => {
        h.tap(500, 1350, "\nabrir menu de raide", 1);
        h.tap(500, 1600, "confirmar", 1);
        h.tap(500, 1600, "tomar recompensa", 1);

        h.tap(500, 1350, "reiniciar desafio", 1);
        h.tap(700, 1300, "aceptar", 1);
      },
      4,
      "hacer raide"
    );

    h.tap(
      500,
      2100,
      "salir de provocacion de ocuridad o del menu de compra de pase",
      1
    );
    h.tap(
      500,
      2100,
      "salir de provocacion de ocuridad (en caso de que este abierto el menu de compra)",
      1
    );
  },
};

const islandSection = {
  init() {
    h.sectionTitle("Isla");
    h.tap(610, 2180, "ir a la isla", 1);
    // islandSection.farm()
    islandSection.parking();
    islandSection.clerk();
    // islandSection.merchant();
    h.tap(610, 2180, "salir de la isla", 1);
  },
  // farm() {
  //   h.title('Hacienda')
  //   h.tap(400, 1590, 'abrir hacienda', 1)
  //   h.tap(700, 2180, 'abrir tienda', 1)
  //   h.tap(700, 1250, 'abrir modal de compra de abono', 1)
  //   h.tap(730, 1100, 'seleccionar 5', 1)
  //   h.tap(520, 1290, 'comprar', 2.5)
  //   h.tap(900, 630, 'cerrar notificacion de compra', 1)
  //   h.tap(900, 2180, 'salir de la hacienda', 1)
  // },
  parking() {
    h.title("Estacionamiento");
    h.tap(800, 1200, "abrir estacionamiento", 1);
    h.tap(700, 2180, "abrir tienda", 1);
    h.tap(280, 1300, "abrir modal de compra de guia", 1);
    h.tap(730, 1100, "seleccionar 5", 1);
    h.tap(520, 1290, "comprar", 2.5);
    h.tap(900, 630, "cerrar notificacion de compra", 1);
    h.tap(900, 2180, "salir del estacionamiento", 1);
  },
  clerk() {
    h.title("Oficiante");
    h.tap(590, 750, "abrir seccion de oficiante", 2);
    h.tap(350, 320, "abrir modal de conseguir lates", 2);
    h.tap(750, 1080, "aumentar la cantidad de lates", 1);
    h.tap(520, 1250, "comprar lates", 2);
    h.tap(520, 430, "cerrar notificacion de compra", 2);
    h.tap(830, 750, "abrir modal de dar lates a la primera persona", 1);
    h.tap(520, 1470, "dar lates", 1);
    h.tap(520, 1840, "salir de ver intimidad", 1);
  },
  merchant() {
    h.title("Comerciante");
    h.tap(500, 1650, `Abrir modal del comerciante`, 1);

    h.swipe(
      520,
      900,
      520,
      1600,
      10,
      "navegar hacia arriba con el comerciante",
      1
    );

    // const steps = [
    //   {
    //     coord: { x: 290, y: 970 },
    //     item: "trigo",
    //   },
    //   {
    //     coord: { x: 670, y: 970 },
    //     item: "fruta gurmet",
    //   },
    //   {
    //     coord: { x: 290, y: 1400 },
    //     item: "spirit bloom",
    //   },
    //   {
    //     coord: { x: 670, y: 1400 },
    //     item: "fruta de corazon",
    //   },
    // ];

    // steps.forEach(({ item, coord }) => {
    //   h.tap(coord.x, coord.y, `abrir modal de compra de ${item}`, 1);
    //   h.tap(750, 1100, `seleccionar 10`, 0);
    //   h.tap(750, 1100, `seleccionar 10`, 0);
    //   h.tap(750, 1100, `seleccionar 10`, 0);
    //   h.tap(750, 1100, `seleccionar 10`, 0);
    //   h.tap(750, 1100, `seleccionar 10`, 1);

    //   h.tap(500, 1250, `comprar`, 1);
    //   h.tap(200, 600, `cerrar notificacion`, 1);
    // });

    h.swipe(
      520,
      1400,
      520,
      1200,
      2000,
      "navegar hacia la esencia de vitalidad",
      3.25
    );

    h.tap(670, 1600, `abrir modal de compra de esencia de vitalidad`, 1);
    h.tap(750, 1100, `seleccionar 10`, 0);
    h.tap(750, 1100, `seleccionar 10`, 1);
    h.tap(500, 1250, `comprar`, 1);
    h.tap(200, 600, `cerrar notificacion`, 1);

    h.swipe(
      520,
      1600,
      520,
      800,
      10,
      "navegar hacia abajo con el comerciante",
      1
    );

    const steps2 = [
      {
        coord: { x: 670, y: 720 },
        item: "lamp key",
      },
      {
        coord: { x: 290, y: 1150 },
        item: "red key",
      },
      // {
      //   coord: { x: 670, y: 1150 },
      //   item: "chrono key",
      // },
    ];

    steps2.forEach(({ item, coord }) => {
      h.tap(coord.x, coord.y, `abrir modal de compra de ${item}`, 1);
      h.tap(750, 1100, `seleccionar 10`, 0);
      h.tap(750, 1100, `seleccionar 10`, 0);
      h.tap(750, 1100, `seleccionar 10`, 0);
      h.tap(750, 1100, `seleccionar 10`, 1);

      h.tap(500, 1250, `comprar`, 1);
      h.tap(200, 600, `cerrar notificacion`, 1);
    });

    h.tap(900, 1970, `salir del modal del comerciante`, 1);
  },
};

const clanSection = {
  init() {
    h.sectionTitle("Clan");
    h.tap(800, 2180, "ir a la isla del clan", 1);
    h.swipe(520, 150, 520, 2000, 7000, "caminar hasta abajo");
    clanSection.hall();
    h.tap(800, 2180, "salir de la isla del clan", 2.5);
  },
  hall() {
    h.title("Salon del Clan");
    h.tap(380, 350, "abrir el modal del salon", 1);
    h.tap(630, 1900, "abrir modal de donaciones", 1);
    h.repeat(
      () => {
        h.tap(520, 1270, null, null);
      },
      15,
      "donar al clan"
    );
    h.wait(2);
    h.tap(520, 1270, "cerrar notificacion", 2);
    h.tap(420, 1910, "navegar a la seccion de ayuda de clan", 1);
    h.tap(520, 1890, "ayudar a todos", 2);
    h.tap(520, 1890, "cerrar notificacion", 1);
    h.tap(520, 2000, "salir de la seccion de ayuda", 1.5);
    h.tap(520, 2000, "salir del salon", 2);
  },
};

const shopSection = {
  init() {
    h.sectionTitle("Tienda");
    h.tap(940, 2180, "ir a la tienda", 1);
    h.tap(170, 2010, "navegar a la seccion de roleta de habilidades", 2.5);
    shopSection.getItems();
    h.tap(660, 450, "navegar a la seccion de roleta de companeros", 1);
    shopSection.getItems();
    h.tap(940, 2180, "salir de la tienda", 1);
  },
  getItems() {
    h.repeat(
      () => {
        h.tap(300, 1450, null, null);
      },
      3,
      "rodar maquina por 35"
    );
    h.wait(2);
    h.tap(520, 1900, "cerrar notificacion", 1);
  },
};

function changeUser() {
  h.sectionTitle("Cambiar de Usuario");
  h.tap(80, 150, "abrir menu principal", 1);
  h.tap(180, 500, "abrir perfil del jugador", 1);
  h.tap(730, 1380, "abrir cambiar de cuenta", 1);
  h.tap(760, 1070, "click en la lista de cuentas", 1);
  // h.tap(520, 1385, "seleccionar la ultima", 1);
  h.tap(520, 1250, "seleccionar el segundo usuario", 1);
  h.tap(520, 1200, "aceptar", null);
  h.wait(15);
  // h.swipe(520, 10, 520, 2100, 7000, "navegar hacia abajo en la lista de usuarios")
}

function init() {
  console.clear();
  h.sectionTitle("other tests");

  profiles.forEach((profile) => {
    h.sectionTitle(profile);

    h.tap(660, 1590, "recibir recompensa");
    h.tap(660, 1590, "cerrar notificacion", 2);
    h.tap(660, 1590, null, 1);
    h.repeat(
      () => {
        h.tap(520, 20, null, 1);
      },
      5,
      "asegurar que las notificaciones y modales cierren"
    );
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/T/g, "_")
      .split(".")[0];
    const filename = `${profile}_${timestamp}`;
    h.screenshot(`/home/pandora/Imagens/lom/${profile}`, filename);

    homeSection.init();
    fightSection.init();
    islandSection.init();
    // clanSection.init();
    shopSection.init();
    homeSection.initFinalTasks();

    changeUser();
  });
}

init();
