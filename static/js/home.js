function onload() {
new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: ['yesterday','today','tomorrow'],
      datasets: [{ 
          data: [86,114,106],
          label: "Anastasios",
          borderColor: "#3e95cd",
          fill: false
        }, { 
          data: [0,-350,-411],
          label: "Philippos",
          borderColor: "#8e5ea2",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Gayness over time'
      }
    }
  });
}
function generatedata() {
    var ve = $(".ve").val(); //velocity exhaust
    var v0 = $(".v0").val(); //initial velocity
    var m0 = $(".m0").val(); //initial propellant mass
    var p = $(".mfr").val(); //mass flow rate
    var x0 = $(".x0").val(); //initial heigh
    var t = $(".t").val(); //time interval
    var bt = getburntime(p,m0); //burn time
    var h = 0
    while (h < 110) {
        var h = (Math.sqrt((2*(ve*p)-))
    }
}
function getburntime( p, m0) {
  result = m0 / p
  return result
}
function getgravity(height) {
    
}
function getburningvelocity(ve,v0,m0,p,x0,t,bt) {
    result = math.sqrt((2*(ve*p-)))
}
function getburningalt(x,y,z,t) {

}
function getfallingvelocity(x,y,z,t) {

}
function getfallingheight(x,y,z,t) {
    
}