function switch_design()
{
  // lets user switch camera designs by pressing a button
  // this inverts the button text and img src teabox/shoebox
  let btn = document.getElementById("designButton");
  let img = document.getElementById("designImg");
  if (btn.innerHTML === "Féach an bosca bróg")
  {
    btn.innerHTML = "Féach an bosca tae";
    img.src = "static/img/ceamara_brog.png";
  }
  else
  {
    btn.innerHTML = "Féach an bosca bróg";
    img.src = "static/img/tae_ceamara.png";
  }
}