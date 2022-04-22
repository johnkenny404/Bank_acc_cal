////////==============Bank acct==/////
const containerMovements = document.querySelector(".movements");
const labelBalance = document.querySelector(".balance_value");
const labelIn = document.querySelector(".summary__value--in");
const labelOut = document.querySelector(".summary__value--out");
const intAmout = document.querySelector(".summary__value--interest");

// login
const lognUser = document.querySelector(".login_user");
const loginInPin = document.querySelector(".login_pin");
const loginBTN = document.querySelector(".login-btn");
const labelWelcomeMsg = document.querySelector(".welcome");
const appContainer = document.querySelector(".app");

const account1 = {
  owner: "Kenny John",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> 
          ${i + 1}${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(account1.movements);

const calDisplayBal = function (movements) {
  const balance = movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${balance} EUR`;
};
// calDisplayBal(account1.movements);

const calDisplaySummary = function (acc) {
  const sumary = acc.movements
    .filter((mov) => mov > 0)
    .reduce((mov, accu) => mov + accu, 0);
  labelIn.textContent = `${sumary} € `;

  const debitSummary = acc.movements
    .filter((mov) => mov < 0)
    .reduce((mov, accu) => mov + accu, 0);
  labelOut.textContent = `${Math.abs(debitSummary)} €`;

  const int = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((dep) => dep >= 1)
    .reduce((dep, ac) => dep + ac, 0);
  intAmout.textContent = `${int} €`;
};
// calDisplaySummary(account1.movements);

const creatUserName = function (accts) {
  accts.forEach(function (acct) {
    acct.userName = acct.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((fletter) => fletter[0])
      .join("");
  });
};
creatUserName(accounts);
// event handlers
let currentAccount;

loginBTN.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find((acct) => acct.userName === lognUser.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(loginInPin.value)) {
    //display Ul and a welcome message
    labelWelcomeMsg.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    appContainer.style.opacity = 100;
    //emptying the login field
    loginInPin.value = lognUser.value = " ";
    loginInPin.blur();
    // lognUser = loginInPin = "";
    //displayMovement
    displayMovements(currentAccount.movements);
    // displaybal
    calDisplayBal(currentAccount.movements);
    //displaysummary
    calDisplaySummary(currentAccount);
  }
});
