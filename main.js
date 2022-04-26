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

//transfer form
const formInputTo = document.querySelector(".form__input--to");
const formInputAmount = document.querySelector(".form__input--amount");
const formBTNTransfer = document.querySelector(".form__btn--transfer");

// closin acc
const formInputUser = document.querySelector(".form__input--user");
const formInputPin = document.querySelector(".form__input--pin");
const formBTNClose = document.querySelector(".form__btn--close");

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

const calDisplayBal = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
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

//refactoring login
const updateUI = function (acc) {
  displayMovements(acc.movements);
  // displaybal
  calDisplayBal(acc);
  //displaysummary
  calDisplaySummary(acc);
};
// event handlers
let currentAccount;

loginBTN.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find((acct) => acct.userName === lognUser.value);

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
    updateUI(currentAccount);
  }
});

formBTNTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(formInputAmount.value);
  const reciverAcc = accounts.find((acc) => acc.userName === formInputTo.value);

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.userName !== reciverAcc?.userName &&
    reciverAcc
  ) {
    formInputAmount.value = formInputTo.value = "";
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
    // displayMovements(currentAccount.movements);
    // // displaybal
    // calDisplayBal(currentAccount);
    // //displaysummary
    // calDisplaySummary(currentAccount);
  }
});

//deleting an account
formBTNClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === formInputUser.value &&
    Number(formInputPin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    console.log("done");

    //deleting
    accounts.splice(index, 1);

    formInputPin.value = formInputUser.value = "";

    // hiding the UI

    appContainer.style.opacity = 0;
  }
});
