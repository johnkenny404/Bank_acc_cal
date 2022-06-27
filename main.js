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

// loan request
const formLoan = document.querySelector(".form__input--loan-amount");
const loanBtn = document.querySelector(".form__btn--loan");

//date formatting
const dateFormat = document.querySelector(".label-date");

// setting timer
const timeSetting = document.querySelector(".timer");

// sorting movenment array
const btnSort = document.querySelector(".btn--sort");

const account1 = {
  owner: "Kenny John",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.1782",
    "2019-12-23T07:42:02.3832",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-15T14:11:59.604Z",
    "2022-06-08T17:01:17.194Z",
    "2022-05-11T23:36:17.929Z",
    "2022-06-10T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-18T21:31:17.1782",
    "2019-12-23T07:42:02.3832",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-15T14:11:59.604Z",
    "2022-05-19T17:01:17.194Z",
    "2022-05-11T23:36:17.929Z",
    "2022-05-21T10:51:36.790Z",
  ],

  currency: "USD",
  locale: "en-US",
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

const formattedMovementDay = function (date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  {
    // const day = `${date.getDate()}`.padStart(2, "0");
    // const months = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${months}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const timeCountingDown = function () {
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    timeSetting.textContent = `${min}:${sec}`;

    // what next is as soon as we rich zero, we logout the user
    if (time === 0) {
      clearInterval(setinClear);
      labelWelcomeMsg.textContent = "Login to get started";
      appContainer.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const setinClear = setInterval(tick, 1000);
  return setinClear;
};

const currencyfor = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sorting = false) {
  containerMovements.innerHTML = "";
  // sorting movements through the sort button
  const movs = sorting
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattedMovementDay(date, acc.locale);

    const currencyFormating = currencyfor(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> 
          ${i + 1}${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${currencyFormating}</div>
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
  labelBalance.textContent = currencyfor(acc.balance, acc.locale, acc.currency);
};
// calDisplayBal(account1.movements);

const calDisplaySummary = function (acc) {
  const sumary = acc.movements
    .filter((mov) => mov > 0)
    .reduce((mov, accu) => mov + accu, 0);
  labelIn.textContent = currencyfor(sumary, acc.locale, acc.currency);

  const debitSummary = acc.movements
    .filter((mov) => mov < 0)
    .reduce((mov, accu) => mov + accu, 0);
  labelOut.textContent = currencyfor(
    Math.abs(debitSummary),
    acc.locale,
    acc.currency
  );

  const int = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((dep) => dep >= 1)
    .reduce((dep, ac) => dep + ac, 0);
  intAmout.textContent = currencyfor(int, acc.locale, acc.currency);
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
  displayMovements(acc);
  // displaybal
  calDisplayBal(acc);
  //displaysummary
  calDisplaySummary(acc);
};
// event handlers
let currentAccount, setinClear;
// fake always login
// currentAccount = account1;
// updateUI(currentAccount);
// appContainer.style.opacity = 100;
// const date = new date();
// dateFormat.textContent = new Intl.DateTimeFormat("en-US").format(date);

loginBTN.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find((acct) => acct.userName === lognUser.value);

  if (currentAccount?.pin === Number(loginInPin.value)) {
    //display Ul and a welcome message
    labelWelcomeMsg.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    appContainer.style.opacity = 100;
    //current date

    // const date = new Date();
    // const day = `${date.getDate()}`.padStart(2, "0");
    // const months = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const min = `${date.getMinutes()}`.padStart(2, 0);
    // const sec = `${date.getSeconds()}`.padStart(2, 0);
    // const hrs = `${date.getHours()}`.padStart(2, 0);
    // how date format = day/month/year
    // dateFormat.textContent = `${day}/${months}/${year},
    //  ${hrs}:${min}`;

    //writing international time ways

    const date = new Date();
    const option = {
      hours: "numeric",
      minutes: "numeric",
      day: "numeric",
      month: "numeric", // can be long
      year: "numeric",
      // weekday: "long",
    };
    // const locale = navigator.language; Note instead of using
    //this local coming from the browser, we use the data from the
    // currentMovementAcount i.e is demostrated below
    dateFormat.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(date);

    //emptying the login field
    loginInPin.value = lognUser.value = " ";
    loginInPin.blur();
    // lognUser = loginInPin = "";
    //displayMovement

    //timer
    if (setinClear) clearInterval(setinClear);
    setinClear = timeCountingDown();

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

    // current date update
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    // displayMovements(currentAccount.movements);
    // // displaybal
    // calDisplayBal(currentAccount);
    // //displaysummary
    // calDisplaySummary(currentAccount);
    clearInterval(setinClear);
    setinClear = timeCountingDown();
  }
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(formLoan.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(
      (mov) => mov >= amount * 0.1 /* 10 percent of the deposte*/
    )
  ) {
    // add the loan to the deposie
    currentAccount.movements.push(amount);

    //current acc date
    currentAccount.movementsDates.push(new Date().toISOString());
    // update the UI
    updateUI(currentAccount);
    //reset timer
    clearInterval(setinClear);
    setinClear = timeCountingDown();
  }
  formLoan.value = "";
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

    //deleting
    accounts.splice(index, 1);

    formInputPin.value = formInputUser.value = "";

    // hiding the UI

    appContainer.style.opacity = 0;
  }
});
let sortings = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortings);
  sortings = !sortings;
});
