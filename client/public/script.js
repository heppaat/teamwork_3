import { data } from '/data.js';

const loadEvent = function() {

  const page = window.location.pathname.substring(1);
  // Write your JavaScript code after this line
  
  console.log("data: ", data);
  console.log("page: ", page);
  
  const rootElement = document.getElementById("root");

  
  
  // Write your JavaScript code before this line

}

window.addEventListener("load", loadEvent);
