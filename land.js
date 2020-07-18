const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get('ref');
let link = "./dice";
//let link = "http://localhost:8080/shinephp/dice";

if (ref != null) {
  link += ("?ref="+ref);
}
window.location.replace(link);
