const forms = document.querySelector(".contact-form");
const field = [
  forms.querySelector("#name"),
  forms.querySelector("#email"),
  forms.querySelector("#comments")
];

const cmmts = field[2];
const form_errors = [];
const editField = new Set();
const errorsDisplayed = new Map();

const fieldLabel = {
  name: "Name",
  email: "Email",
  comments: "Comments"
};

// these show the errors and characters left
const errorShown = document.createElement("section");
errorShown.className = "form-errors";
errorShown.setAttribute("aria-label", "Form errors");
errorShown.setAttribute("aria-live", "polite");
errorShown.setAttribute("aria-atomic", "true");

const infoShown = document.createElement("p");
infoShown.id = "comments-info";
infoShown.className = "form-info";

const countAnnounced = document.createElement("p");
countAnnounced.className = "count-announcement";
countAnnounced.setAttribute("aria-live", "polite");

const submitButton = forms.querySelector('button[type="submit"]');
submitButton.before(errorShown, infoShown, countAnnounced);

// this hidden field sends the error history
const historySeen = document.createElement("input");
historySeen.type = "hidden";
historySeen.name = "form-errors";
historySeen.value = "[]";
forms.append(historySeen);

// connect each input to its error message
field.forEach(function (input)
{
  const output = document.createElement("p");
  output.id = `${input.id}-error`;
  output.hidden = true;
  errorShown.append(output);

  const descriptions = input.getAttribute("aria-describedby") || "";

  input.setAttribute(
    "aria-describedby",
    `${descriptions} ${output.id}`
  );
});

cmmts.setAttribute(
  "aria-describedby",
  `${cmmts.getAttribute("aria-describedby")} comments-info`
);

// clear the old error before checking again
function fieldValidation(input)
{
  input.setCustomValidity("");

  let message = "";

  if (input.validity.valueMissing)
  {
    message = `please enter your ${fieldLabel[input.id].toLowerCase()}.`;
  }
  else if (input.validity.typeMismatch)
  {
    message = "enter an email address, like brenda@example.com.";
  }
  else if (
    input.validity.tooShort ||
    (input.minLength > 0 && input.value.length < input.minLength)
  )
  {
    message = `please use at least ${input.minLength} characters.`;
  }
  else if (
    input.validity.tooLong ||
    (input.maxLength > 0 && input.value.length > input.maxLength)
  )
  {
    message = `please use no more than ${input.maxLength} characters.`;
  }

  input.setCustomValidity(message);
  return message;
}

// show the error, or remove it once its fixed
function errorDisplayed(input, message)
{
  const output = document.getElementById(`${input.id}-error`);

  if (message)
  {
    const text = `${fieldLabel[input.id]}: ${message}`;

    if (output.textContent !== text)
    {
      output.textContent = text;
    }

    output.hidden = false;
    input.setAttribute("aria-invalid", "true");
    errorsDisplayed.set(input.id, message);
  }
  else
  {
    output.textContent = "";
    output.hidden = true;
    input.removeAttribute("aria-invalid");
    errorsDisplayed.delete(input.id);
  }
}

let previousCount = "";

// update how many characters are left
function updateChar()
{
  const remaining = cmmts.maxLength - cmmts.value.length;
  let state = "normal";
  let message = `${remaining} characters left.`;

  if (remaining === 0)
  {
    state = "limit";
    message = "0 characters left. you reached the character limit!";
  }
  else if (remaining <= 100)
  {
    state = "warning";
    message = `${remaining} characters left. you're getting close to the limit!`;
  }

  infoShown.textContent = message;
  infoShown.classList.toggle("near-limit", state !== "normal");

  // announce warnings when the warning state changes
  if (state !== previousCount)
  {
    countAnnounced.textContent = state === "normal" ? "" : message;
    previousCount = state;
  }
}

field.forEach(function (input)
{
  input.addEventListener("input", function ()
  {
    editField.add(input.id);
    const message = fieldValidation(input);

    // update errors that are already showing
    if (errorsDisplayed.has(input.id))
    {
      errorDisplayed(input, message);
    }

    if (input === cmmts)
    {
      updateChar();
    }
  });

  input.addEventListener("blur", function ()
  {
    // only show an error after the user edited the field
    if (editField.has(input.id))
    {
      errorDisplayed(input, fieldValidation(input));
    }
  });
});

forms.addEventListener("submit", function (event)
{
  let firstInvalidField = null;

  field.forEach(function (input)
  {
    const message = fieldValidation(input);
    errorDisplayed(input, message);

    if (message)
    {
      // save each invalid field once for this submit attempt
      form_errors.push({
        field: input.name,
        message: message
      });

      if (!firstInvalidField)
      {
        firstInvalidField = input;
      }
    }
  });

  if (firstInvalidField)
  {
    event.preventDefault();
    firstInvalidField.focus();
    return;
  }

  // keep past errors and send them with the corrected form
  historySeen.value = JSON.stringify(form_errors);
});

updateChar();

// use our checks once setup is done
// without javascript, the html checks still work
forms.noValidate = true;