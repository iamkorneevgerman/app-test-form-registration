export function initPhoneMask(input) {
  const setMask = (e) => {
    let value = input.value.replace(/\D/g, "");
    if (value.startsWith("7") || value.startsWith("8"))
      value = value.substring(1);

    let result = "+7 ";
    if (value.length > 0) result += "(" + value.substring(0, 3);
    if (value.length >= 4) result += ") " + value.substring(3, 6);
    if (value.length >= 7) result += "-" + value.substring(6, 8);
    if (value.length >= 9) result += "-" + value.substring(8, 10);

    input.value = result;
  };

  input.addEventListener("input", setMask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && /\D$/.test(input.value)) {
      input.value = input.value.slice(0, -1);
    }
  });
}
