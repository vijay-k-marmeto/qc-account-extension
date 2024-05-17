const qcTotalWalletBal = document.getElementById("wallet-balance");
const qcErrorElement = document.querySelector("#error-container");

const submitButton = document.querySelector("#add-to-wallet-submit-button");
const submitButtonContent = document.querySelector(".submit-button-content");
const submitButtonSpinner = document.querySelector(".submit-button-spinner");

const storeDomain = submitButton.dataset.store
const customerId = submitButton.dataset.customerId

submitButton.addEventListener('click', addToWallets);

const userData = {
  store: shopDomain,
  customer_id: customerId,
}; 

const getWalletBals = () => {
  const getBalanceUrl = `https://uatdashboard.qwikcilver.com/giftcard/wallet/balance?store=${userData.store}&customer_id=${userData.customer_id}`;

  try{
    fetch(getBalanceUrl, {
        method: "POST",
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === true && data.code === 200) {
            qcErrorElement.innerText = ""
            qcTotalWalletBal.innerHTML = "Rs." + data.data.balance;
          } else {
            qcErrorElement.innerText = data.message;
          }
        })
  }
  catch(e){
    console.log('err', e.message)
  }
};

window.onload = function () {
  getWalletBals();
};

const addToWallets = () => {
  qcErrorElement.innerText = "";
  submitButtonContent.classList.remove("hidden");
  submitButtonSpinner.classList.add("hidden");

  const qcClaimCardValue = document.querySelector("#card-nput").value;
  const qcClaimPinValue = document.querySelector("#pin-input").value

  const addToWalletUrl =
    "https://uatdashboard.qwikcilver.com/giftcard/wallet/addgiftcard";

    async function addToWallet() {
      try {
        const response = await fetch(addToWalletUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...userData,
            cardNumber: qcClaimCardValue,
            pinNumber: qcClaimPinValue
          })
        });
        
        const data = await response.json();
    
        if (data.success === true && data.code === 200) {
          getWalletBals();
          alert("Your Card has been Successfully Added to the Wallet");
        } else {
          qcErrorElement.innerText = data.message;
        }
      } catch (err) {
        qcErrorElement.innerText = err.message
        console.log("error", err);
      } finally {
        submitButtonContent.classList.remove("hidden");
        submitButtonSpinner.classList.add("hidden");
      }
    }    
};