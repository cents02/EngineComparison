function onload() {
  time = []
  velocity = []
  time,velocity = generatedata()
new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: time,
      datasets: [{ 
          data: velocity,
          label: "Engine POWEH",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Potatoes over time'
      }
    }
  });
}
function generatedata() {
    var ve = document.getElementById("ve").value //velocity exhaust
    var m0 = document.getElementById("m0").value //initial propellant mass
    var p = document.getElementById("mfr").value //mass flow rate
    var r = document.getElementById("re").value //exhaust radious
    var time_interval = 0.001//time interval
    var time = 0//time interval
    var bt = getburntime(p,m0); //burn time
    var h = 0
    var t = 0
    time = []
    velocity_data = []
    height_data = []
    while (t < bt) {
        var vel = getburningvelocity(ve,m0,p,h,t,r)
        velocity_data.push(vel)
        h = getburningalt(ve,m0,p,h,t,r)
        height_data.push(h)
        time.push(t)
        t = t+ 0.001
    }
    return time,velocity_data
}
function getburntime( p, m0) {
  result = m0 / p
  return result
}
function getgravity(height) {
  altitudes = [0,1,2,3,4,5,6,7,8,9,10,11,13,15,17,20,25,30,32,35,40,45,47,50,51,60,70,71,80,84.9,89.7,100.4,105,110]
  gravity = [9.710472679,9.695332005,9.680226715,9.674194481,9.665156698,9.662146918,9.635122046,9.605227177,9.602245345,9.575471225,9.560941259,9.546739866,9.515196254,9.501683481,9.487028307]
  i = 0
  while (i < altitudes.length)
  {
    if (altitudes[i] >= height){
      if (altitudes[i] == height){
        return gravity[i] 
      }
      midpoint = (altitudes[i] + altitudes[i-1])/2
      if (height > midpoint){
        if ((altitudes[i] - height) > (height - midpoint)){
          return ((gravity[i]+ gravity[i-1])/2) //since its close to the midpoint, lets use an average of the two closest values
        } else {
          return (gravity[i])
        }
        
      } else if (midpoint > height){
        if ((midpoint - height) > (height - altitudes[i-1])){
          return (gravity[i - 1]) //since its close to the lower point, lets use the lower value
        } else {
          return ((gravity[i]+ gravity[i-1])/2)
        }
      } else {
        return ((gravity[i]+ gravity[i-1])/2) //if its exactly in the middle we return the average
      }
      
    } 
    i++;
  }
  return 
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
// For your sanity, please cross check the equations in the paper provided along with the code.
function getburningvelocity(ve,m0,p,h,t,r) { 
    g = getgravity(h)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    result = Math.sqrt((2*(ve*p-g*(m0 - p*t))/var1area))*Math.tanh(t*Math.sqrt(var1area/(2*(m0-p*t))*Math.sqrt((ve*p)/(m0-p*t)-g))) //Equation 3
    return result
}
function getburningalt(ve,m0,p,h,t,r)  {
    g = getgravity(h)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    result = (2*(m0-p*t))/var1area * Math.log(Math.cosh(t*Math.sqrt(var1area/(2*(m0-p*t))*Math.sqrt(ve/(m0-p*t)*p-g)))) //Equation 4
    return result
}
function getfallingvelocity(ve,m0,p,h,t,r) {
    g= getgravity(h)
    var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
    result = Math.sqrt((2*g*(m0-p*t))/var1area)*Math.tanh(t*(Math.sqrt(((c/0.5)*g))/(2*(m0-p*t)))) // Equation 5
    return result;

}
function getfallingheight(ve,m0,p,h,t,r) {
  g= getgravity(h)
  var1area = (Math.PI*getatmospheredensity(h)*Math.pow(r,2)*0.5)
  result = ((2*(m0-p*t)/var1area))*Math.log(Math.cosh(t*(Math.sqrt(((c/0.5)*g))/(2*(m0-p*t))))) // Equation 6
  return result
}