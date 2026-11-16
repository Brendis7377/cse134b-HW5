const themeButton = document.createElement("button");
themeButton.type = "button";

document.querySelector("header").append(themeButton);

function applyTheme(theme)
{
  document.documentElement.dataset.theme = theme;

  themeButton.textContent =
    theme === "dark" ? "switch to light mode" : "switch to dark mode";
}

// try to get the saved theme
let savedThem = "light";

try
{
  const saved = localStorage.getItem("theme");

  if (saved === "dark" || saved === "light")
  {
    savedThem = saved;
  }
}
catch (error)
{
  console.warn("couldn't load the saved theme.");
}

applyTheme(savedThem);

themeButton.addEventListener("click", function ()
{
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  function changeTheme()
  {
    applyTheme(nextTheme);
    try
    {
      localStorage.setItem("theme", nextTheme);
    }
    catch (error)
    {
      console.warn("couldn't save the theme.");
    }
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // use the view transition when its available
  if (document.startViewTransition && !reducedMotion)
  {
    document.startViewTransition(changeTheme);
  }
  else {
    changeTheme();
  }
});