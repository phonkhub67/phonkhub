if(window.innerWidth > 768){

const dot = document.createElement("div");
dot.className = "cursor-dot";

const ring = document.createElement("div");
ring.className = "cursor-ring";

document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;

document.addEventListener("mousemove",(e)=>{

mouseX = e.clientX;
mouseY = e.clientY;

dot.style.left = mouseX + "px";
dot.style.top = mouseY + "px";

});

function animate(){

ringX += (mouseX - ringX) * 0.15;
ringY += (mouseY - ringY) * 0.15;

ring.style.left = ringX + "px";
ring.style.top = ringY + "px";

requestAnimationFrame(animate);

}

animate();

document.addEventListener("mouseover",(e)=>{

if(
e.target.closest(
"a,button,input,textarea,.card,.song-card"
)
){
ring.classList.add("hover");
}

});

document.addEventListener("mouseout",(e)=>{

if(
e.target.closest(
"a,button,input,textarea,.card,.song-card"
)
){
ring.classList.remove("hover");
}

});

}