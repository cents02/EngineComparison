function onload() {
  generategraphs()
}
function generategraphs() {
  var ctx = document.getElementById("line-chart").getContext("2d");

  ctx.canvas.width = 700;
  ctx.canvas.height = 400;
  var result = generatedata()
  if (result[2][-1] > 110000) {
    document.getElementById("madeit").innerHTML = "YOU MADE IT"
  }
  new Chart(document.getElementById("line-chart"), {
      type: 'line',
      
      
      data: {
        labels: result[0],
        datasets: [{ 
            data: result[1],
            label: "Velocity",
            borderColor: "#3e95cd",
            fill: false
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        title: {
          display: true,
          
          text: 'Velocity over time'
        }
      }
    });
    //chart.canvas.parentNode.style.height = '128px';
    //chart.canvas.parentNode.style.width = '128px';
    var ctx2 = document.getElementById("line-chart2").getContext("2d");
    ctx2.canvas.width = 700;
    ctx2.canvas.height = 400;
  new Chart(document.getElementById("line-chart2"), {
    type: 'line',
    data: {
      labels: result[0],
      datasets: [{
          data: result[2],
          label: "Height",
          borderColor: "#3ae123",
          fill: false
        }
      ]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Height over time'
      }
    }
  });
  
}
function generatedata() {
    var ve = document.getElementById("ve").value //velocity exhaust
    var m0 = document.getElementById("m0").value //initial propellant mass
    // = document.getElementById("mfr").value //mass flow rate
    var r = document.getElementById("re").value //exhaust radious
    var mass = document.getElementById("mass").value //mass
    var thrust = document.getElementById("thrust").innerText
    document.getElementById("velbl").innerHTML = "Exhaust speed: " + ve
    document.getElementById("m0lbl").innerHTML =  "Fuel mass: " + m0
    //document.getElementById("mfrlbl").innerHTML = "Mass flow rate: "+ p
    document.getElementById("relbl").innerHTML = "Exhaust radious: "+ r
    document.getElementById("masslbl").innerHTML = "Total mass: " + mass
    var time_interval = 0.1//time interval
    var time = 0//time interval
    
    var p = thrust /ve
    var bt = getburntime(p,m0); //burn time
    var a = 0
    var h = 0
    var t = 0
    var time = []
    var v = 0.
    var velocitydata = [0.0]
    var heightdata = [0.0]
    var accelerationdata = [0.0]
    while (v >= 0) {
      time.push(t)
 
      if( t < bt) 
      {
        a = getacceleration(v,mass,p,h,t,r,ve)} 
      else {
          a = -k*Math.pow(v, 2) - m*g
        }
        a /= m
        v += a*time_interval
        h += v*time_interval
        
        accelerationdata.push(a)
        heightdata.push(h)
        velocitydata.push(v)
        t = t+ time_interval
    } 

    while (h > 0) {
      a = getfallingacceleration(v,mass,p,h,t,r,ve)
      a /= m
      v += a*time_interval
      h += v*time_interval
      
      accelerationdata.push(a)
      heightdata.push(h)
      velocitydata.push(v)
      t = t+ time_interval
  }
    return [time,velocitydata,heightdata,accelerationdata]
}
function addcell(data,row){
 
  var cell1 = row.insertCell(-1);
  cell1.innerHTML = data;
}
function getburntime( p, m0) {
  result = m0 / p
  return result
}
function getgravity(h) {
  return 6.67259*Math.pow(10,-11)*5.972*Math.pow(10,24)/Math.pow(h + 6371000, 2)
}
function getacceleration(v,mass,p,h,t,r,ve) { 
  g = getgravity(h)
  m = getmasst(mass,p,t)
  k = getk(h,r)
  a = p*ve - m*g - k*Math.pow(v, 2)
  return a
}
function getfallingacceleration(v,mass,p,h,t,r,ve) { 
  g = getgravity(h)
  m = getmasst(mass,p,t)
  k = getk(h,r)
  a = -k*Math.pow(v, 2) - m*g
  return a
}

// For your sanity, please cross check the equations in the paper provided along with the code.
function getburningvelocity(ve,mass,p,h,t,r,row) { 
    g = getgravity(h)
    addcell(g,row)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    var1 = getvar1(mass,r,h,p,t)
    var2 = getvar2(ve,mass,r,h,p,t)
    m = getmasst(mass,p,t)
    k = getk(h,r)
    addcell(m,row)
    addcell(k,row)
    result =  6.67259*pow(10,-11)*5.972*pow(10,24)/pow(yvals[-1] + 6371000, 2)
    //result = Math.sqrt(var1) * Math.tanh(Math.sqrt(1/var1)*Math.sqrt(var2))
    //result = Math.sqrt(-((2*(ve*p-g*(masst))/var1area)) *Math.tanh(t*Math.sqrt(var1area/(2*(masst))*Math.sqrt((ve*p)/(masst)-g)))) //Equation 3
    //result = -Math.sqrt(g*m - ve*p)*Math.tan(Math.sqrt(k)*Math.sqrt(g*m - ve*p)*t/m)/(Math.sqrt(k))
    return result
}
function getburningalt(ve,mass,p,h,t,r)  {
    g = getgravity(h)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    m0 = getmasst(mass,p,t)
    k = getk(h,r)
    masst = getmasst(mass,p,t)
    //result = (2*(masst))/var1area * Math.log(Math.cosh(t*Math.sqrt(var1area/(2*(masst))*Math.sqrt(ve/(masst)*p-g)))) //Equation 4
    result = m*Math.log(Math.cos(Math.sqrt(k)*Math.sqrt(g*m -ve*p)*t))/k
    return result
}
function getfallingvelocity(ve,mass,m0,p,h,t,r) {
    g= getgravity(h)
    m0 = getmasst(mass,p,t)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    result = Math.sqrt((2*g*(mass-m0))/var1area)*Math.tanh(t*(Math.sqrt(((var1area)*g))/(2*(mass-m0)))) // Equation 5
    return result;

}
function getfallingheight(ve,m0,p,h,t,r) {
  g= getgravity(h)
  var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
  m0 = getmasst(mass,p,t)
  result = ((2*(mass-m0)/var1area))*Math.log(Math.cosh(t*(Math.sqrt(((var1area/0.5)*g))/(2*(mass-m0))))) // Equation 6
  return result
}
function getk(h,r){
  result = 0.25*Math.PI*getatmospheredensity(h)*Math.pow(r,2)
  return result
}
function getmasst(mass,p,t){
  result = mass - p*t
  return result
}
function getvar1(mass,r,h,p,t) {
  result = getmasst(mass,p,t) / getk(h,r)
  return result
}
function getvar2(ev,mass,r,h,p,t) {
 result = (ev*p) / getmasst(mass,r,h,t) - getgravity(h)
 return result
}
function getatmospheredensity(height)
{
  altitudes = [0,1,2,3,4,5,6,7,8,9,10,11,13,15,17,20,25,30,32,35,40,45,47,50,51,60,70,71,80,84.9,89.7,100.4,105,110]
  densities = [1.225,1.0065,1.1116,0.9091,0.8191,0.7361,0.6597,0.5895,0.5252,0.4664,0.4127,0.3639,0.2655,0.1937,0.1423,0.088,0.0395,0.018,0.0132,0.0082,0.0039,0.0019,0.0014,0.001,0.00086,0.000288,0.000074,0.000064,0.000015,0.000007,0.000003,0.0000005,0.0000002,0.0000001]
 i=0
  while (i < altitudes.length)
  {
    if (altitudes[i] >= height){
      if (altitudes[i] == height){
        return densities[i] 
      }
      midpoint = (altitudes[i] + altitudes[i-1])/2
      if (height > midpoint){
        if ((altitudes[i] - height) > (height - midpoint)){
          return ((densities[i]+ densities[i-1])/2) //since its close to the midpoint, lets use an average of the two closest values
        } else {
          return (densities[i])
        }
        
      } else if (midpoint > height){
        if ((midpoint - height) > (height - altitudes[i-1])){
          return (densities[i - 1]) //since its close to the lower point, lets use the lower value
        } else {
          return ((densities[i]+ densities[i-1])/2)
        }
      } else {
        return ((densities[i]+ densities[i-1])/2) //if its exactly in the middle we return the average
      }
      
    } 
    i++;
  }
  return 
}