const upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower   = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+{}[]<>?/";

const lengthInput   = document.getElementById("length");
const lengthValue   = document.getElementById("lengthValue");
const passwordBox   = document.getElementById("password");
const feedback      = document.getElementById("feedback");
const meterFill     = document.getElementById("meterFill");
const strengthText  = document.getElementById("strengthText");
const entropyText   = document.getElementById("entropy");
const countText     = document.getElementById("count");
const copyBtn       = document.getElementById("copy");

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  generatePassword();
});

document.getElementById("generate").addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

function secureRandom(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword() {
  const length = parseInt(lengthInput.value);
  
  let pool = "";
  if (document.getElementById("upper").checked)   pool += upper;
  if (document.getElementById("lower").checked)   pool += lower;
  if (document.getElementById("numbers").checked) pool += numbers;
  if (document.getElementById("symbols").checked) pool += symbols;

  if (pool === "") {
    passwordBox.textContent = "Selecione pelo menos uma opção.";
    feedback.textContent = "Ative algum tipo de caractere.";
    feedback.className = "feedback warn";
    copyBtn.disabled = true;
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += pool[secureRandom(pool.length)];
  }

  passwordBox.textContent = password;
  updateStrength(password, pool.length);

  feedback.textContent = "Senha gerada com sucesso.";
  feedback.className = "feedback ok";
  copyBtn.disabled = false;
}

function updateStrength(password, poolSize) {
  const entropy = password.length * Math.log2(poolSize);
  
  entropyText.textContent = `Entropia: ${entropy.toFixed(1)} bits`;
  countText.textContent   = `${password.length} caracteres`;

  let percent = 30;
  let label   = "Fraca";
  let color   = "var(--bad)";

  if (entropy > 70) {
    percent = 100;
    label   = "Forte";
    color   = "var(--ok)";
  } else if (entropy > 45) {
    percent = 65;
    label   = "Média";
    color   = "var(--warn)";
  }

  meterFill.style.width = percent + "%";
  meterFill.style.backgroundColor = color;
  strengthText.textContent = "Força: " + label;
}

async function copyPassword() {
  const password = passwordBox.textContent.trim();
  if (!password || password.includes("Selecione")) return;

  try {
    await navigator.clipboard.writeText(password);
    feedback.textContent = "Senha copiada!";
    feedback.className = "feedback ok";
  } catch {
    feedback.textContent = "Não foi possível copiar.";
    feedback.className = "feedback bad";
  }
}

// Inicialização
copyBtn.disabled = true;
generatePassword();
