'use strict';
// The Banking app
// Data
//The accounts for each bank customer
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Aheed Shah',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Ahmad Naqshbandi',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sandra Foster',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

//This array stores each user
const accounts = [account1, account2, account3, account4];

// Setting up the elements of the website by making them equal to variables
const labelWelcome = document.querySelector('.welcome');

const labelDate = document.querySelector('.date');

const labelBalance = document.querySelector('.balance__value');

const labelSumIn = document.querySelector('.summary__value--in');

const labelSumOut = document.querySelector('.summary__value--out');

const labelSumInterest = document.querySelector('.summary__value--interest');

const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');

const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');

const btnTransfer = document.querySelector('.form__btn--transfer');

const btnLoan = document.querySelector('.form__btn--loan');

const btnClose = document.querySelector('.form__btn--close');

const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');

const inputLoginPin = document.querySelector('.login__input--pin');

const inputTransferTo = document.querySelector('.form__input--to');

const inputTransferAmount = document.querySelector('.form__input--amount');

const inputLoanAmount = document.querySelector('.form__input--loan-amount');

const inputCloseUsername = document.querySelector('.form__input--user');

const inputClosePin = document.querySelector('.form__input--pin');

// Functions for each display
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//This function displays balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
//This function calculates display's summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//This function creates user for each user
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
//This updates the User Interface according to the movements
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  //Find the current account from the form
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //If the pin and username match, we login
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});
//Event listener for transferring the money
btnTransfer.addEventListener('click', function (e) {
  //Preventing from submitting
  e.preventDefault();
  //Setting the amount to be equal to the amount the person wants to transfer
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find( //Finding the username to tranfer to and if it matches, we transfer
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});
//Event listener for taking a loan
btnLoan.addEventListener('click', function (e) {
  //Prevent the default
  e.preventDefault();

  //Amount is the loan amount you're requesting
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//Event listener for deleting the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0);

const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

let a = 10;

const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
      },
    { deposits: 0, withdrawals: 0 }
);

console.log(deposits, withdrawals);

const convertTitleCase = function (title) {
  const capitzalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title.toLowerCase().split(' ').map(word => (exceptions.includes(word) ? word : capitzalize(word))).join(' ');

  return capitzalize(titleCase);
};